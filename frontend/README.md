# CyberGuard Bot - React Frontend

Modern React chatbot UI for scam detection with a dark cyber security theme.

## Features

- 🎨 **Dark Cyber Theme**: Futuristic dark UI with cyan/blue accents
- 💬 **Chat Interface**: Clean message input and display
- 📊 **Visual Results**: Probability bars and detailed explanations
- ⚡ **Real-time Analysis**: Instant feedback on message analysis
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

**Note**: Make sure the Node.js backend is running on `http://localhost:3000` (or update the API URL in `ChatBot.js`)

## Project Structure

```
src/
├── App.js                 # Main app component
├── App.css                # App styles
├── index.js               # React entry point
├── index.css              # Global styles
└── components/
    ├── ChatBot.js         # Main chatbot container
    ├── ChatBot.css        # Chatbot styles
    ├── MessageInput.js    # Input component
    ├── MessageInput.css   # Input styles
    ├── MessageDisplay.js  # User message display
    ├── MessageDisplay.css # Message styles
    ├── ResultCard.js      # Result display component
    └── ResultCard.css     # Result card styles
```

## Components

### ChatBot
Main container component that manages state and coordinates all child components.

### MessageInput
Text area for pasting messages with send button. Supports Enter to send, Shift+Enter for new line.

### MessageDisplay
Displays user messages in a chat bubble format.

### ResultCard
Displays analysis results including:
- Prediction badge (Scam/Legit)
- Probability percentage
- Animated probability bar
- Explanation bullets

## API Integration

The frontend calls the Node.js backend at:
- `POST http://localhost:3000/api/analyze-message`

Request:
```json
{
  "message": "Your account has been suspended..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "message": "...",
    "prediction": "Scam",
    "probability": 87.5,
    "explanations": ["..."],
    "timestamp": "..."
  }
}
```

## Customization

### Change API URL

Edit `src/components/ChatBot.js`:
```javascript
const response = await fetch('YOUR_API_URL/api/analyze-message', {
  // ...
});
```

### Theme Colors

Main theme colors are defined in CSS files:
- Primary: `#00ffff` (Cyan)
- Secondary: `#0080ff` (Blue)
- Background: `#0a0e27` (Dark blue)
- Text: `#e0e0e0` (Light gray)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.
