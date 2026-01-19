"""
Flask backend API for scam detection.
Endpoint: POST /detect-scam
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from model_utils import ScamDetectionModel
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize model
model = ScamDetectionModel()

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "running",
        "message": "CyberGuard Bot - Scam Detection API",
        "model_loaded": model.model is not None and model.vectorizer is not None
    })

@app.route('/detect-scam', methods=['POST'])
def detect_scam():
    """
    Detect if a message is a scam.
    
    Request body:
    {
        "message": "Your account has been suspended. Click here..."
    }
    
    Response:
    {
        "prediction": "Scam",
        "probability": 87.5,
        "explanations": [
            "Contains 2 urgency-indicating word(s)",
            "Multiple suspicious phrases detected (3)"
        ]
    }
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided"
            }), 400
        
        # Extract message
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                "error": "Message field is required and cannot be empty"
            }), 400
        
        # Check if model is loaded
        if model.model is None or model.vectorizer is None:
            return jsonify({
                "error": "Model not loaded. Please train the model first."
            }), 503
        
        # Get prediction
        prediction, probability, explanations = model.predict(message)
        
        # Return response
        return jsonify({
            "prediction": prediction,
            "probability": round(probability, 2),
            "explanations": explanations,
            "message": message  # Echo back the message for reference
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while processing the request"
        }), 500

@app.route('/batch-detect', methods=['POST'])
def batch_detect():
    """
    Detect scams for multiple messages at once.
    
    Request body:
    {
        "messages": ["message1", "message2", ...]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'messages' not in data:
            return jsonify({
                "error": "Messages array is required"
            }), 400
        
        messages = data.get('messages', [])
        
        if not isinstance(messages, list):
            return jsonify({
                "error": "Messages must be an array"
            }), 400
        
        results = []
        for msg in messages:
            try:
                prediction, probability, explanations = model.predict(str(msg))
                results.append({
                    "message": str(msg),
                    "prediction": prediction,
                    "probability": round(probability, 2),
                    "explanations": explanations
                })
            except Exception as e:
                results.append({
                    "message": str(msg),
                    "error": str(e)
                })
        
        return jsonify({
            "results": results,
            "total": len(results)
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    # Check if model exists
    if model.model is None or model.vectorizer is None:
        print("⚠️  WARNING: Model not found. Please run train_model.py first.")
        print("   The API will start but /detect-scam will return errors.")
    
    print("\n" + "=" * 60)
    print("🚀 CyberGuard Bot - Scam Detection API")
    print("=" * 60)
    print("\nEndpoints:")
    print("  GET  /              - Health check")
    print("  POST /detect-scam   - Detect scam in single message")
    print("  POST /batch-detect  - Detect scam in multiple messages")
    print("\nStarting server on http://localhost:5000")
    print("=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
