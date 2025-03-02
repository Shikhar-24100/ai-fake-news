const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const csv = require("csv-parser");
const natural = require("natural");

const vectorizer = new natural.TfIdf();
const liarTrainFile = "train.tsv";

// Load LIAR Dataset
async function loadLIARData(filename) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filename)
            .pipe(csv({ separator: "\t", headers: false })) // Tab-separated
            .on("data", (row) => {
                const label = row["0"]; // First column is the label
                const text = row["2"]; // Third column is the news text

                data.push({ label, text });
                vectorizer.addDocument(text);
            })
            .on("end", () => resolve(data))
            .on("error", (err) => reject(err));
    });
}

// Convert Labels to Numerical Values
function encodeLabels(label) {
    const labelMap = {
        "true": 1,
        "mostly-true": 0.8,
        "half-true": 0.5,
        "barely-true": 0.3,
        "false": 0,
        "pants-fire": 0 // Strongly false
    };
    return labelMap[label] || 0; // Default to 0 if unknown
}

// Convert Text to TF-IDF Vectors
function vectorizeText(text) {
    const vector = [];
    vectorizer.tfidfs(text, (i, measure) => vector.push(measure));
    return tf.tensor1d(vector);
}

async function prepareTrainingData() {
    const data = await loadLIARData(liarTrainFile);

    const X = data.map(({ text }) => vectorizeText(text));
    const y = data.map(({ label }) => encodeLabels(label));

    return { X: tf.stack(X), y: tf.tensor1d(y) };
}

module.exports = prepareTrainingData;
