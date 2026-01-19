# CyberGuard Bot - Node.js Backend

Express.js middleware backend that connects the frontend with the Python ML backend and stores results in MongoDB.

## Architecture

```
Frontend → Node.js Backend → Python ML Backend → Node.js Backend → MongoDB → Frontend
```

The Node.js backend:
1. Receives messages from the frontend
2. Forwards them to the Python ML backend for analysis
3. Stores the results in MongoDB
4. Returns the response to the frontend

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cyberguard_bot
PYTHON_API_URL=http://localhost:5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
# Start MongoDB service from Services or use mongod

# macOS/Linux
mongod
```

Or use MongoDB Atlas (cloud):
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /api/analyze-message

Analyze a message for scam detection.

**Request:**
```json
{
  "message": "Your account has been suspended. Click here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65f1234567890abcdef12345",
    "message": "Your account has been suspended...",
    "prediction": "Scam",
    "probability": 87.5,
    "explanations": [
      "Contains 2 urgency-indicating word(s)",
      "Multiple suspicious phrases detected (3)"
    ],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/messages

Retrieve stored messages with pagination.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)
- `skip` (optional): Number of messages to skip (default: 0)
- `prediction` (optional): Filter by "Scam" or "Legit"

**Example:**
```
GET /api/messages?limit=20&skip=0&prediction=Scam
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [...],
    "pagination": {
      "total": 1000,
      "limit": 20,
      "skip": 0,
      "hasMore": true
    }
  }
}
```

### GET /api/stats

Get statistics about analyzed messages.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMessages": 1000,
    "scamCount": 450,
    "legitCount": 550,
    "scamPercentage": "45.00",
    "legitPercentage": "55.00",
    "scamStats": {
      "avgProbability": 78.5,
      "minProbability": 50.2,
      "maxProbability": 99.9
    },
    "legitStats": {...}
  }
}
```

## MongoDB Schema

The `Message` model stores:
- `message`: Original message text
- `prediction`: "Scam" or "Legit"
- `probability`: Confidence percentage (0-100)
- `explanations`: Array of explanation strings
- `timestamp`: Analysis timestamp
- `ipAddress`: Client IP (for analytics)
- `createdAt`: MongoDB timestamp
- `updatedAt`: MongoDB timestamp

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **axios**: HTTP client for Python backend
- **cors**: Enable CORS
- **dotenv**: Environment variables

## Prerequisites

1. **MongoDB**: Must be installed and running
2. **Python Backend**: Must be running on the port specified in `PYTHON_API_URL`

## Error Handling

The backend handles:
- Missing or invalid message input
- Python backend connection failures
- MongoDB connection errors
- Invalid responses from Python backend

All errors return appropriate HTTP status codes and error messages.
