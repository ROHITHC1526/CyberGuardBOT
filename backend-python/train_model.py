"""
Training script for the scam detection model.
Uses TF-IDF vectorization + Logistic Regression.
"""

import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
from text_preprocessor import TextPreprocessor

# Sample training data (you can replace this with your actual dataset)
def generate_sample_data():
    """Generate sample training data for demonstration."""
    scam_messages = [
        "URGENT! Your account has been suspended. Click here immediately to verify: http://verify-now.com",
        "Congratulations! You have won $10,000! Call now at 1-800-WINNER to claim your prize!",
        "Limited time offer! Act now and get $5000 deposited to your account. Verify your details ASAP!",
        "Your tax refund of $2,450 is ready. Click here to claim: www.taxrefund.gov/claim",
        "Your credit card will be locked in 24 hours. Verify your account now: http://secure-bank.com/verify",
        "You've been selected as a winner! Send $100 processing fee to receive your $50,000 prize!",
        "URGENT MESSAGE: Your package delivery failed. Pay $5.99 to reschedule immediately!",
        "Your Netflix account will expire today. Update payment info now: netflix-pay.com",
        "Congratulations! You are the 1,000,000th visitor! Claim your free iPhone now!",
        "Your Amazon order needs verification. Click here immediately: amaz0n-verify.link",
    ]
    
    legit_messages = [
        "Hi, just wanted to check if you're free for lunch tomorrow?",
        "Thanks for the update on the project. I'll review it and get back to you.",
        "The meeting has been scheduled for 3 PM in the conference room.",
        "Could you please send me the quarterly report when you get a chance?",
        "Happy birthday! Hope you have a wonderful day.",
        "I'll be running about 15 minutes late for our appointment.",
        "The weather looks great today. Perfect for a walk in the park.",
        "Let me know your availability for a quick call this afternoon.",
        "I've attached the document you requested. Please review when convenient.",
        "Thanks for your help with the presentation. It went really well!",
    ]
    
    # Create balanced dataset
    data = {
        'message': scam_messages + legit_messages,
        'label': [1] * len(scam_messages) + [0] * len(legit_messages)
    }
    
    return pd.DataFrame(data)

def load_training_data(file_path: str = None):
    """
    Load training data from CSV file or generate sample data.
    
    Expected CSV format:
    - message: text content
    - label: 1 for scam, 0 for legit
    """
    if file_path and os.path.exists(file_path):
        print(f"Loading data from {file_path}")
        df = pd.read_csv(file_path)
        return df
    else:
        print("No dataset file found. Using sample data for demonstration.")
        print("To use your own data, place a CSV file in the dataset/ folder with columns: message, label")
        return generate_sample_data()

def train_model(data_path: str = None):
    """Train the scam detection model."""
    print("=" * 60)
    print("Training Scam Detection Model")
    print("=" * 60)
    
    # Load data
    df = load_training_data(data_path)
    
    if df is None or df.empty:
        raise ValueError("No training data available!")
    
    print(f"\nLoaded {len(df)} samples")
    print(f"Scam samples: {df['label'].sum()}")
    print(f"Legit samples: {len(df) - df['label'].sum()}")
    
    # Preprocess text
    preprocessor = TextPreprocessor()
    df['cleaned_message'] = df['message'].apply(preprocessor.clean_text)
    
    # Remove empty messages
    df = df[df['cleaned_message'].str.len() > 0]
    
    print(f"\nAfter preprocessing: {len(df)} samples")
    
    # Prepare features and labels
    X = df['cleaned_message'].values
    y = df['label'].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # TF-IDF Vectorization
    print("\nCreating TF-IDF features...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),  # Unigrams and bigrams
        min_df=2,
        max_df=0.95,
        stop_words='english'
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print(f"TF-IDF feature matrix shape: {X_train_tfidf.shape}")
    
    # Train Logistic Regression model
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(
        random_state=42,
        max_iter=1000,
        C=1.0,
        class_weight='balanced'  # Handle class imbalance
    )
    
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate model
    print("\nEvaluating model...")
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nTest Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legit', 'Scam']))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Save model and vectorizer
    os.makedirs('model', exist_ok=True)
    
    model_path = 'model/scam_model.pkl'
    vectorizer_path = 'model/tfidf_vectorizer.pkl'
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"\n✅ Model saved to {model_path}")
    print(f"✅ Vectorizer saved to {vectorizer_path}")
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    # You can specify a path to your dataset CSV file
    # Example: train_model("../dataset/scam_data.csv")
    train_model()
