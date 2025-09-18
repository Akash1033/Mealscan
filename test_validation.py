#!/usr/bin/env python3
"""
Test script to demonstrate food image validation
"""

import requests
import json
from PIL import Image
import io

def test_food_validation():
    """Test the food validation endpoint"""
    
    # Test with a simple colored image (not food)
    print("🧪 Testing food validation...")
    
    # Create a simple test image (not food)
    test_image = Image.new('RGB', (200, 200), color='blue')
    
    # Convert to bytes
    img_byte_arr = io.BytesIO()
    test_image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Test the API
    try:
        response = requests.post(
            'http://localhost:8000/api/scan',
            files={'file': ('test_image.png', img_byte_arr, 'image/png')},
            timeout=10
        )
        
        if response.status_code == 400:
            print("✅ Validation working! Got expected error:")
            print(f"   {response.json()['detail']}")
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(f"   {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the backend is running:")
        print("   cd Mealscan/backend && python main_simple.py")
    except Exception as e:
        print(f"❌ Error testing validation: {e}")

if __name__ == "__main__":
    test_food_validation()
