const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrapeArticle(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract full sentences instead of words
    const sentences = $("article p")
        .map((i, el) => $(el).text().replace(/\s+/g, " ").trim()) // Clean up extra spaces
        .get();

    // Ensure sentences are enclosed in double quotes (safe for CSV)
    const csvData = "sentence\n" + sentences.map(sentence => `"${sentence.replace(/"/g, '""')}"`).join("\n");

    // Save to CSV file
    fs.writeFileSync("news_sentences.csv", csvData, "utf8");
    console.log("Sentences saved to news_sentences.csv");
}

scrapeArticle("https://www.ndtv.com/india-news/maha-kumbh-2025-tents-off-cleanliness-drive-on-how-maha-kumbh-site-looks-post-grand-event-7828916#pfrom=home-ndtv_topstories");
