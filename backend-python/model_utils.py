import joblib
import os
from typing import Tuple, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from text_preprocessor import TextPreprocessor

class ScamDetectionModel:
    """Manages the scam detection model and predictions."""
    
    def __init__(self, model_path: str = "model/scam_model.pkl", 
                 vectorizer_path: str = "model/tfidf_vectorizer.pkl"):
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.model = None
        self.vectorizer = None
        self.preprocessor = TextPreprocessor()
        self.load_model()
    
    def load_model(self):
        """Load trained model and vectorizer from disk."""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                print(f"Model loaded from {self.model_path}")
            else:
                print(f"Model files not found. Please train the model first.")
                self.model = None
                self.vectorizer = None
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
            self.vectorizer = None
    
    def predict(self, text: str) -> Tuple[str, float, List[str]]:
        """
        Predict if text is a scam.
        
        Returns:
            tuple: (prediction, probability, explanations)
        """
        if self.model is None or self.vectorizer is None:
            raise ValueError("Model not loaded. Please train the model first.")
        
        # Preprocess text
        cleaned_text = self.preprocessor.clean_text(text)
        
        if not cleaned_text or len(cleaned_text.strip()) == 0:
            return "Legit", 0.0, ["Empty or invalid text input"]
        
        # Transform text using TF-IDF
        text_vector = self.vectorizer.transform([cleaned_text])
        
        # Get prediction and probability
        prediction_proba = self.model.predict_proba(text_vector)[0]
        scam_probability = prediction_proba[1]  # Assuming 1 = Scam, 0 = Legit
        
        # Determine prediction
        prediction = "Scam" if scam_probability >= 0.5 else "Legit"
        
        # Generate explanations
        explanations = self._generate_explanations(text, cleaned_text, scam_probability)
        
        return prediction, scam_probability * 100, explanations
    
    def _generate_explanations(self, original_text: str, cleaned_text: str, 
                              scam_probability: float) -> List[str]:
        """Generate explanations for why a message is classified as scam or legit."""
        explanations = []
        features = self.preprocessor.extract_features(cleaned_text)
        
        if scam_probability >= 0.5:
            # Scam explanations
            if features['urgency_count'] > 0:
                explanations.append(f"Contains {features['urgency_count']} urgency-indicating word(s)")
            
            if features['money_count'] > 2:
                explanations.append(f"Multiple monetary references detected ({features['money_count']})")
            
            if features['suspicious_count'] > 1:
                explanations.append(f"Contains {features['suspicious_count']} suspicious phrase(s)")
            
            if features['exclamation_count'] > 2:
                explanations.append(f"Excessive exclamation marks ({features['exclamation_count']})")
            
            if features['caps_ratio'] > 0.3:
                explanations.append(f"High ratio of uppercase letters ({features['caps_ratio']:.1%})")
            
            if features['action_count'] > 2:
                explanations.append(f"Multiple action-inducing words ({features['action_count']})")
            
            # Default explanation if none match
            if not explanations:
                explanations.append("Text pattern matches known scam characteristics")
        else:
            # Legit explanations
            if features['urgency_count'] == 0:
                explanations.append("No urgency-indicating words detected")
            
            if features['money_count'] <= 1:
                explanations.append("Few or no monetary references")
            
            if features['suspicious_count'] == 0:
                explanations.append("No suspicious phrases detected")
            
            if features['word_count'] > 10:
                explanations.append("Message has sufficient contextual length")
            
            # Default explanation
            if not explanations:
                explanations.append("Text pattern appears legitimate")
        
        return explanations
