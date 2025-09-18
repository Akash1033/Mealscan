# MealScan - AI-Powered Nutrition Insights App

MealScan is an intelligent nutrition analysis application that uses AI to identify food items from images and provide detailed nutritional information.

## Features

- Image-based food recognition using AI models
- **Food image validation** - Only accepts actual food images
- Nutritional breakdown of identified foods
- User history tracking
- Clean and intuitive user interface
- Smart error handling with helpful messages

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

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
python setup.py
```

The setup script will ask you to choose between:
- **Full version**: Uses real AI models (requires more dependencies)
- **Simple version**: Uses mock AI for testing (minimal dependencies)

### Option 2: Manual Setup

#### Backend Setup

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
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mealscan
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   OPENFOODFACTS_API_URL=https://world.openfoodfacts.org
   ```

5. Run the backend server:
   
   **For full version (with AI models):**
   ```bash
   uvicorn main:app --reload
   ```
   
   **For simple version (mock AI):**
   ```bash
   python main_simple.py
   ```

#### Frontend Setup

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

## Troubleshooting

### Common Issues

**"Error processing image"**
- Make sure the backend server is running on port 8000
- Check if you have a valid Hugging Face API key (optional but recommended)
- Ensure the image file is a valid image format (JPEG, PNG, GIF)

**"This doesn't appear to be a food image"**
- The app validates that uploaded images contain food
- Upload clear photos of meals, dishes, or food items
- Avoid uploading images of people, objects, or non-food items
- Make sure the food is clearly visible and well-lit

**"AI models are not available"**
- The app can work without Hugging Face API key but with rate limits
- Get a free API key from https://huggingface.co/settings/tokens
- Add it to your `.env` file

**"Cannot connect to server"**
- Make sure the backend is running: `cd backend && python main.py`
- Check if port 8000 is available
- Verify the frontend is trying to connect to `http://localhost:8000`

**MongoDB connection issues**
- The app works without MongoDB (scan history won't be saved)
- To use MongoDB: install and start MongoDB, then update MONGODB_URI in `.env`

### Getting Help

1. Check the console logs in your browser (F12)
2. Check the backend terminal for error messages
3. Make sure all dependencies are installed correctly
4. Try restarting both frontend and backend servers

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