from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv
from typing import List, Optional
import requests
from transformers import pipeline
from PIL import Image
import io
import json
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="MealScan API")

# Configure CORS - More permissive during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set")

try:
    client = AsyncIOMotorClient(MONGODB_URI)
    # Test the connection
    client.admin.command('ping')
    db = client.mealscan
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    logger.error(traceback.format_exc())
    raise

# Initialize Hugging Face models with API key
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
if not HUGGINGFACE_API_KEY:
    raise ValueError("HUGGINGFACE_API_KEY environment variable is not set")

try:
    # Load models with smaller size
    food_classifier = pipeline(
        "image-classification",
        model="nateraw/food",
        token=HUGGINGFACE_API_KEY
    )
    food_category_classifier = pipeline(
        "image-classification",
        model="Kaludi/food-category-classification-v2.0",
        token=HUGGINGFACE_API_KEY
    )
    logger.info("Successfully loaded Hugging Face models")
except Exception as e:
    logger.error(f"Failed to load Hugging Face models: {str(e)}")
    logger.error(traceback.format_exc())
    raise

@app.get("/")
async def root():
    return {"message": "Welcome to MealScan API", "status": "running"}

@app.post("/api/scan")
async def scan_food(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}, content_type: {file.content_type}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Read and process the image
        contents = await file.read()
        try:
            image = Image.open(io.BytesIO(contents))
            logger.info(f"Successfully opened image, size: {image.size}")
        except Exception as e:
            logger.error(f"Error opening image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image file")
            
        # First classification attempt with nateraw/food
        logger.info("Attempting food classification")
        try:
            results = food_classifier(image)
            food_item = results[0]["label"]
            confidence = results[0]["score"]
            logger.info(f"Initial classification: {food_item} (confidence: {confidence})")
        except Exception as e:
            logger.error(f"Error in food classification: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail="Error in food classification")
        
        # If confidence is low, try the category classifier
        if confidence < 0.7:
            logger.info("Low confidence, trying category classifier")
            try:
                category_results = food_category_classifier(image)
                food_category = category_results[0]["label"]
                food_item = f"{food_item} ({food_category})"
                logger.info(f"Refined classification: {food_item}")
            except Exception as e:
                logger.error(f"Error in category classification: {str(e)}")
                # Continue even if category classification fails
        
        # Query Open Food Facts API
        logger.info("Fetching nutritional data")
        nutrition_data = await get_nutrition_data(food_item)
        
        if not nutrition_data:
            logger.warning(f"No nutritional data found for {food_item}")
            nutrition_data = {
                "calories": "N/A",
                "proteins": "N/A",
                "fats": "N/A",
                "carbs": "N/A",
                "serving_size": "100g"
            }
        
        # Store scan history
        try:
            scan_record = {
                "timestamp": datetime.utcnow(),
                "food_item": food_item,
                "nutrition_data": nutrition_data,
                "confidence": float(confidence),
                "image_url": None
            }
            await db.scan_history.insert_one(scan_record)
            logger.info("Successfully stored scan record")
        except Exception as e:
            logger.error(f"Error storing scan record: {str(e)}")
            # Continue even if storage fails
        
        return {
            "food_item": food_item,
            "confidence": float(confidence),
            "nutrition_data": nutrition_data
        }
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

async def get_nutrition_data(food_item: str):
    """Query Open Food Facts API for nutritional information"""
    try:
        # Search for the food item using the public API
        search_url = "https://world.openfoodfacts.org/cgi/search.pl"
        params = {
            "search_terms": food_item,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": 1
        }
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("products") and len(data["products"]) > 0:
            product = data["products"][0]
            nutriments = product.get("nutriments", {})
            
            # Get nutritional values with proper type conversion
            try:
                calories = float(nutriments.get("energy-kcal_100g", 0))
            except (ValueError, TypeError):
                try:
                    # Try alternative energy field
                    calories = float(nutriments.get("energy_100g", 0)) / 4.184  # Convert kJ to kcal
                except (ValueError, TypeError):
                    calories = 0
                    
            try:
                proteins = float(nutriments.get("proteins_100g", 0))
            except (ValueError, TypeError):
                proteins = 0
                
            try:
                fats = float(nutriments.get("fat_100g", 0))
            except (ValueError, TypeError):
                fats = 0
                
            try:
                carbs = float(nutriments.get("carbohydrates_100g", 0))
            except (ValueError, TypeError):
                carbs = 0
            
            return {
                "calories": round(calories, 1),
                "proteins": round(proteins, 1),
                "fats": round(fats, 1),
                "carbs": round(carbs, 1),
                "serving_size": "100g"
            }
            
        # If no product found, try searching by category
        category_url = "https://world.openfoodfacts.org/category/{}/1.json".format(food_item.lower().replace(" ", "-"))
        response = requests.get(category_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("products") and len(data["products"]) > 0:
                product = data["products"][0]
                nutriments = product.get("nutriments", {})
                
                return {
                    "calories": round(float(nutriments.get("energy-kcal_100g", 0)), 1),
                    "proteins": round(float(nutriments.get("proteins_100g", 0)), 1),
                    "fats": round(float(nutriments.get("fat_100g", 0)), 1),
                    "carbs": round(float(nutriments.get("carbohydrates_100g", 0)), 1),
                    "serving_size": "100g"
                }
        
        # If still no data found, return default values
        logger.warning(f"No nutritional data found for {food_item}")
        return {
            "calories": 0.0,
            "proteins": 0.0,
            "fats": 0.0,
            "carbs": 0.0,
            "serving_size": "100g"
        }
        
    except Exception as e:
        logger.error(f"Error fetching nutrition data: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "calories": 0.0,
            "proteins": 0.0,
            "fats": 0.0,
            "carbs": 0.0,
            "serving_size": "100g"
        }

@app.get("/api/history")
async def get_scan_history(limit: int = 10):
    """Retrieve recent scan history"""
    try:
        cursor = db.scan_history.find().sort("timestamp", -1).limit(limit)
        history = await cursor.to_list(length=limit)
        # Convert ObjectId to string for JSON serialization
        for record in history:
            record["_id"] = str(record["_id"])
        return history
    except Exception as e:
        logger.error(f"Error fetching scan history: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 