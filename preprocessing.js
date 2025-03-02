const fs = require("fs");
const natural = require("natural");

fs.readFile("article.txt", "utf8", (err, text) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(word => !stopwords.includes(word));

    console.log(filteredTokens);
});
