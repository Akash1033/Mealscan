# MealScan - AI-Powered Nutrition Insights App

MealScan is an intelligent nutrition analysis application that uses AI to identify food items from images and provide detailed nutritional information.

## Features

- Image-based food recognition using AI models
- Nutritional breakdown of identified foods
- User history tracking
- Clean and intuitive user interface

## Tech Stack

- Frontend: React
- Backend: FastAPI (Python)
- Database: MongoDB
- AI Models: 
  - nateraw/food (Food Recognition)
  - Kaludi/food-category-classification-v2.0 (Food Category Classification)
- Nutrition Data: Open Food Facts API

## Project Structure

```
mealscan/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
└── README.md          # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables in `.env`

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/scan`: Upload and analyze food images
- `GET /api/history`: Retrieve user's scan history
- `GET /api/food/{food_id}`: Get detailed nutritional information

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string
- `HUGGINGFACE_API_KEY`: API key for Hugging Face models
- `OPENFOODFACTS_API_URL`: Open Food Facts API URL

### Frontend
- `REACT_APP_API_URL`: Backend API URL 