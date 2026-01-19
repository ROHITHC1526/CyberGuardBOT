import re
import string
from typing import List

class TextPreprocessor:
    """Handles text preprocessing for scam detection."""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text input."""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', ' ', text)
        text = re.sub(r'www\.(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', ' ', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', ' ', text)
        
        # Remove phone numbers (various formats)
        text = re.sub(r'[\+]?[0-9]{1,3}?[-.\s]?[(]?[0-9]{1,4}[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}', ' ', text)
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def extract_features(text: str) -> dict:
        """Extract linguistic features that help identify scams."""
        features = {}
        
        # Count urgency words
        urgency_words = ['urgent', 'immediately', 'asap', 'hurry', 'limited time', 'act now', 
                        'expires', 'deadline', 'today only', 'instant', 'quick']
        features['urgency_count'] = sum(1 for word in urgency_words if word in text.lower())
        
        # Count monetary references
        money_patterns = [r'\$[\d,]+', r'[\d,]+ dollars', r'[\d,]+ usd', r'money', 
                         r'prize', r'reward', r'won', r'winner', r'free']
        features['money_count'] = sum(len(re.findall(pattern, text.lower())) for pattern in money_patterns)
        
        # Count action verbs (common in scams)
        action_words = ['click', 'call', 'send', 'verify', 'confirm', 'update', 'claim', 
                       'activate', 'register', 'subscribe']
        features['action_count'] = sum(1 for word in action_words if word in text.lower())
        
        # Count suspicious phrases
        suspicious_phrases = ['your account', 'verify your', 'suspended', 'locked', 
                             'tax refund', 'nigerian prince', 'congratulations', 'you have won',
                             'limited offer', 'click here', 'verify now']
        features['suspicious_count'] = sum(1 for phrase in suspicious_phrases if phrase in text.lower())
        
        # Text length
        features['text_length'] = len(text)
        features['word_count'] = len(text.split())
        
        # Check for excessive punctuation
        features['exclamation_count'] = text.count('!')
        features['question_count'] = text.count('?')
        features['caps_ratio'] = sum(1 for c in text if c.isupper()) / max(len(text), 1)
        
        return features
