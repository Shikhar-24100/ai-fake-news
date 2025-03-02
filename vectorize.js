const fs = require("fs");
const tf = require("@tensorflow/tfjs");

const csv = require("csv-parser");
const natural = require("natural");

const vectorizer = new natural.TfIdf();
const words = [];

async function loadCSV(filename) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filename)
            .pipe(csv({ headers: ["word"] })) // Since there's only one column
            .on("data", (row) => {
                words.push(row.word);
                vectorizer.addDocument(row.word);
            })
            .on("end", () => resolve(words))
            .on("error", (err) => reject(err));
    });
}

async function vectorizeData() {
    await loadCSV("news_data");

    // Convert words to TF-IDF vectors
    const X = words.map((word) => {
        const vector = [];
        vectorizer.tfidfs(word, (i, measure) => vector.push(measure));
        return tf.tensor1d(vector);
    });

    // Convert to Tensors
    return { X: tf.stack(X) };
}

module.exports = vectorizeData;
