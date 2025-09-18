from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
from PIL import Image
import io
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="MealScan API - Simple Version")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Simple mock food classifier with validation
def mock_food_classifier(image):
    """Mock food classifier that returns random results for testing"""
    mock_foods = [
        {"label": "pizza", "score": 0.85},
        {"label": "burger", "score": 0.78},
        {"label": "salad", "score": 0.72},
        {"label": "pasta", "score": 0.68},
        {"label": "sandwich", "score": 0.75}
    ]
    import random
    return [random.choice(mock_foods)]

def is_food_image(image):
    """Validate if the uploaded image is likely to be food"""
    try:
        # Get image dimensions
        width, height = image.size
        
        # Basic validation checks
        if width < 50 or height < 50:
            return False, "Image too small. Please upload a higher resolution image."
        
        if width > 5000 or height > 5000:
            return False, "Image too large. Please upload a smaller image."
        
        # Check image aspect ratio (food images are usually not extremely wide/tall)
        aspect_ratio = width / height
        if aspect_ratio > 5 or aspect_ratio < 0.2:
            return False, "Please upload a properly oriented food image."
        
        # Mock food validation - in real implementation, this would use AI
        # For now, we'll simulate some validation based on image characteristics
        import random
        
        # Simulate 85% chance of being food (for testing purposes)
        is_food = random.random() < 0.85
        
        if not is_food:
            return False, "This doesn't appear to be a food image. Please upload a clear photo of food."
        
        return True, "Valid food image"
        
    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        return False, "Error processing image. Please try a different image."

@app.get("/")
async def root():
    return {"message": "Welcome to MealScan API (Simple Version)", "status": "running"}

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
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            logger.info(f"Successfully opened image, size: {image.size}")
        except Exception as e:
            logger.error(f"Error opening image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Validate if the image is food-related
        logger.info("Validating if image contains food")
        is_food, validation_message = is_food_image(image)
        if not is_food:
            logger.warning(f"Food validation failed: {validation_message}")
            raise HTTPException(status_code=400, detail=validation_message)
            
        # Mock food classification
        logger.info("Attempting food classification (mock)")
        try:
            results = mock_food_classifier(image)
            food_item = results[0]["label"]
            confidence = results[0]["score"]
            logger.info(f"Mock classification: {food_item} (confidence: {confidence})")
        except Exception as e:
            logger.error(f"Error in food classification: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail="Error in food classification")
        
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
            
        # If no product found, return default values
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
    """Retrieve recent scan history (mock data)"""
    # Return mock history for testing
    mock_history = [
        {
            "_id": "1",
            "timestamp": datetime.utcnow(),
            "food_item": "pizza",
            "confidence": 0.85,
            "nutrition_data": {
                "calories": 266.0,
                "proteins": 11.0,
                "fats": 10.0,
                "carbs": 33.0,
                "serving_size": "100g"
            }
        },
        {
            "_id": "2", 
            "timestamp": datetime.utcnow(),
            "food_item": "burger",
            "confidence": 0.78,
            "nutrition_data": {
                "calories": 295.0,
                "proteins": 17.0,
                "fats": 12.0,
                "carbs": 25.0,
                "serving_size": "100g"
            }
        }
    ]
    return mock_history[:limit]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
