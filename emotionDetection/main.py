from keras.models import load_model
from keras.preprocessing.image import img_to_array
import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import pandas as pd
import os
from werkzeug.utils import secure_filename
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Path configurations
FACE_CASCADE_PATH = 'haarcascade_frontalface_default.xml'
MODEL_PATH = 'model.h5'
CSV_PATH = r"C:\Users\ashpa\Downloads\Emotify-master\Emotify-master\songRecommender\data\data_moods.csv"  # Updated to relative path

# Initialize models
try:
    face_classifier = cv2.CascadeClassifier(FACE_CASCADE_PATH)
    classifier = load_model(MODEL_PATH)
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def detect_emotion_from_image(image_path):
    try:
        frame = cv2.imread(image_path)
        if frame is None:
            raise ValueError("Could not read image file")
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
        
        emotions = {}
        
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            roi_gray = cv2.resize(roi_gray, (48, 48))
            
            if np.sum([roi_gray]) != 0:
                roi = roi_gray.astype('float') / 255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)
                
                prediction = classifier.predict(roi)[0]
                label = emotion_labels[prediction.argmax()]
                emotions[label] = emotions.get(label, 0) + 1
                
        return emotions
    except Exception as e:
        logger.error(f"Error in detect_emotion_from_image: {str(e)}")
        return {}

def detect_emotion_from_webcam():
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise RuntimeError("Could not open webcam")
            
        emotions = {}
        
        for _ in range(50):  # Capture 50 frames
            ret, frame = cap.read()
            if not ret:
                break
                
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
            
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y + h, x:x + w]
                roi_gray = cv2.resize(roi_gray, (48, 48))
                
                if np.sum([roi_gray]) != 0:
                    roi = roi_gray.astype('float') / 255.0
                    roi = img_to_array(roi)
                    roi = np.expand_dims(roi, axis=0)
                    
                    prediction = classifier.predict(roi)[0]
                    label = emotion_labels[prediction.argmax()]
                    emotions[label] = emotions.get(label, 0) + 1
        
        return emotions
    except Exception as e:
        logger.error(f"Error in detect_emotion_from_webcam: {str(e)}")
        return {}
    finally:
        if 'cap' in locals():
            cap.release()

def determine_mood(emotions):
    if not emotions:
        val = "Neutral"
    else:
        val = max(emotions.items(), key=lambda x: x[1])[0]
    
    # Mood mapping
    mood_map = {
        'Angry': 'Energetic',
        'Surprise': 'Energetic',
        'Fear': 'Calm',
        'Neutral': 'Calm',
        'Happy': 'Happy',
        'Sad': 'Sad',
        'Disgust': 'Calm'
    }
    
    return mood_map.get(val, val)

def get_song_recommendations(mood):
    try:
        # Verify CSV exists
        if not os.path.exists(CSV_PATH):
            raise FileNotFoundError(f"CSV file not found at {CSV_PATH}")
        
        # Read CSV with error handling
        df = pd.read_csv(CSV_PATH)
        
        # Check for required columns
        required_columns = ['name', 'artist', 'mood']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Filter by mood (case insensitive)
        df_filtered = df[df['mood'].str.lower() == mood.lower()]
        
        if df_filtered.empty:
            logger.warning(f"No songs found for mood: {mood}")
            return []
        
        # Get random sample (3- songs)
        sample_size = min(10, max(3, len(df_filtered)))
        df_sample = df_filtered.sample(sample_size)
        
        # Prepare response with available data
        recommendations = []
        for _, row in df_sample.iterrows():
            song_data = {
                'name': row['name'],
                'artist': row['artist'],
                'mood': row['mood'],
                'link': row.get('link'),  # Returns None if column doesn't exist
                'spotify_id': row.get('spotify_id'),
                'album_cover': row.get('album_cover')
            }
            recommendations.append(song_data)
        
        return recommendations
    except Exception as e:
        logger.error(f"Error in get_song_recommendations: {str(e)}")
        return []

@app.route('/recommendations', methods=['GET', 'POST'])
def get_recommendations():
    try:
        # Get mood from appropriate method
        if request.method == 'GET':
            logger.info("Detecting mood from webcam")
            emotions = detect_emotion_from_webcam()
        elif request.method == 'POST':
            if 'file' not in request.files:
                return jsonify({"status": "error", "message": "No file provided"}), 400
                
            file = request.files['file']
            if file.filename == '':
                return jsonify({"status": "error", "message": "No selected file"}), 400
                
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                logger.info(f"Processing uploaded image: {filename}")
                emotions = detect_emotion_from_image(filepath)
                os.remove(filepath)  # Clean up
            else:
                return jsonify({"status": "error", "message": "Invalid file type"}), 400
        
        mood = determine_mood(emotions)
        logger.info(f"Detected mood: {mood}")
        
        recommended_songs = get_song_recommendations(mood)
        logger.info(f"Found {len(recommended_songs)} recommendations")
        
        return jsonify({
            "status": "success",
            "mood": mood,
            "recommended_songs": recommended_songs
        })
        
    except Exception as e:
        logger.error(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    try:
        test_songs = get_song_recommendations("Happy")
        return jsonify({
            "status": "success",
            "message": "API is working",
            "sample_recommendations": test_songs,
            "csv_columns": list(pd.read_csv(CSV_PATH).columns) if os.path.exists(CSV_PATH) else "CSV not found"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)