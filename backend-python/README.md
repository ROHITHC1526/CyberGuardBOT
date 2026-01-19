# CyberGuard Bot - Python ML Backend

Python Flask backend for scam detection using TF-IDF + Logistic Regression.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Train the model:
```bash
python train_model.py
```

3. Run the Flask server:
```bash
python app.py
```

## API Endpoints

### POST /detect-scam
Detect if a single message is a scam.

**Request:**
```json
{
  "message": "Your account has been suspended. Click here..."
}
```

**Response:**
```json
{
  "prediction": "Scam",
  "probability": 87.5,
  "explanations": [
    "Contains 2 urgency-indicating word(s)",
    "Multiple suspicious phrases detected (3)"
  ],
  "message": "Your account has been suspended..."
}
```

### POST /batch-detect
Detect scams in multiple messages at once.

**Request:**
```json
{
  "messages": ["message1", "message2", ...]
}
```

### GET /
Health check endpoint.

## Model Training

The model uses:
- **TF-IDF Vectorization**: Converts text to numerical features
- **Logistic Regression**: Binary classification (Scam/Legit)

To use your own dataset, create a CSV file with columns:
- `message`: The text message
- `label`: 1 for scam, 0 for legit

Then run:
```bash
python train_model.py path/to/your/dataset.csv
```
