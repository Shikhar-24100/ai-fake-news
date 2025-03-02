const fs = require("fs");
const natural = require("natural");

fs.readFile("article.txt", "utf8", (err, text) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Convert stopwords to a Set for faster lookup
    const stopwordSet = new Set(natural.stopwords);
    const filteredTokens = tokens.filter(word => !stopwordSet.has(word));

    // Convert tokens into a CSV column (one word per line)
    const csvColumn = ["word", ...filteredTokens].join("\n");

    // Write the CSV column to a file
    fs.writeFile("news_data.csv", csvColumn, "utf8", (err) => {
        if (err) {
            console.error("Error writing CSV:", err);
        } else {
            console.log("CSV file saved: news_data.csv");
        }
    });
});
