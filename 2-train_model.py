import pandas as pd
import numpy as np
import tensorflow as tf
import nltk
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense

# Download stopwords
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

# Load LIAR dataset (Ensure 'train.tsv' exists in the same folder)
columns = ["id", "label", "statement", "subject", "speaker", "job", "state", "party", "barely_true_counts", "false_counts", "half_true_counts", "mostly_true_counts", "pants_on_fire_counts", "context"]
df = pd.read_csv("train.tsv", sep="\t", header=None, names=columns)

# Select only necessary columns
df = df[["statement", "label"]]
df.dropna(inplace=True)

# Convert labels to binary (Fake: 1, Real: 0)
label_mapping = {"pants-fire": 1, "false": 1, "barely-true": 1, "half-true": 0, "mostly-true": 0, "true": 0}
df["label"] = df["label"].map(label_mapping)

# Text Preprocessing
df["statement"] = df["statement"].str.lower()
df["statement"] = df["statement"].apply(lambda x: " ".join([word for word in x.split() if word not in stop_words]))

# Tokenization
tokenizer = Tokenizer()
tokenizer.fit_on_texts(df["statement"])
vocab_size = len(tokenizer.word_index) + 1

# Convert text to sequences
sequences = tokenizer.texts_to_sequences(df["statement"])
X = pad_sequences(sequences, maxlen=50, padding="post")
y = np.array(df["label"])

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model Architecture
model = Sequential([
    Embedding(vocab_size, 128, input_length=50),
    LSTM(64, return_sequences=True),
    LSTM(32),
    Dense(1, activation="sigmoid")
])

# Compile Model
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

# Train Model
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=5, batch_size=32)

# Save Model & Tokenizer
model.save("fake_news_model.h5")
import pickle
with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

print("✅ Model training complete and saved!")
