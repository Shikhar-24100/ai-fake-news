from flask import Flask, request, jsonify
import pandas as pd
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# Load Model & Tokenizer
model = tf.keras.models.load_model("fake_news_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Tokenize & Pad Text
    sequence = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequence, maxlen=50, padding="post")

    # Make Prediction
    prediction = model.predict(padded_sequence)[0][0]
    result = "Fake" if prediction > 0.5 else "Real"

    return jsonify({"text": text, "prediction": result})

@app.route("/validate", methods=["POST"])
def validate():
    data = request.json
    sentences = data.get("sentences", [])

    if not sentences:
        return jsonify({"error": "No sentences provided"}), 400

    # Tokenize & Pad Sentences
    sequences = tokenizer.texts_to_sequences(sentences)
    X = pad_sequences(sequences, maxlen=50, padding="post")

    # Make Predictions
    predictions = model.predict(X)

    # Convert predictions to labels
    results = ["Fake" if pred > 0.5 else "Real" for pred in predictions]

    # Calculate Percentage of Real News
    total_sentences = len(sentences)
    real_count = results.count("Real")
    fake_count = results.count("Fake")

    real_percentage = (real_count / total_sentences) * 100
    fake_percentage = (fake_count / total_sentences) * 100

    return jsonify({
        "total_sentences": total_sentences,
        "real_percentage": f"{real_percentage:.2f}%",
        "fake_percentage": f"{fake_percentage:.2f}%",
        "predictions": results
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)

