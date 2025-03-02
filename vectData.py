import pandas as pd
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load dataset
df = pd.read_csv("news_sentences.csv", quotechar='"', encoding="utf-8")

# df = pd.read_csv("news_sentences.csv")  # Now using sentences instead of words

# Tokenize sentences
tokenizer = Tokenizer(oov_token="<OOV>")
tokenizer.fit_on_texts(df["sentence"])

# Save tokenizer for later use
with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

# Convert sentences to sequences
sequences = tokenizer.texts_to_sequences(df["sentence"])
padded_sequences = pad_sequences(sequences, maxlen=50, padding="post")

# Save as TensorFlow dataset
X = padded_sequences
df.to_csv("vectorized_sentences.csv", index=False)

print("Vectorization complete. Data saved.")
