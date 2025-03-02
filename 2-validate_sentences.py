import pandas as pd
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load Model & Tokenizer
model = tf.keras.models.load_model("fake_news_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# Load the extracted sentences
df = pd.read_csv("news_sentences.csv", quotechar='"', encoding="utf-8")

# Ensure all sentences are strings
df["sentence"] = df["sentence"].astype(str)

# Tokenize & Pad Sentences
sequences = tokenizer.texts_to_sequences(df["sentence"])
X = pad_sequences(sequences, maxlen=50, padding="post")

# Make Predictions
predictions = model.predict(X)

# Convert predictions to labels
df["prediction"] = ["Fake" if pred > 0.5 else "Real" for pred in predictions]

# Calculate Percentage of Real News
total_sentences = len(df)
real_count = len(df[df["prediction"] == "Real"])
fake_count = len(df[df["prediction"] == "Fake"])

real_percentage = (real_count / total_sentences) * 100
fake_percentage = (fake_count / total_sentences) * 100

# Save results
df.to_csv("validated_sentences.csv", index=False)
print(f"✅ Sentences classified! Results saved in validated_sentences.csv")
print(f"🔹 Real: {real_percentage:.2f}% | 🔹 Fake: {fake_percentage:.2f}%")
