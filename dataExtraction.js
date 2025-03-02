const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrapeArticle(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        // const articleText = $("article").text().replace(/\s+/g, ' ').trim();
        // const articleText = $("article").text().trim();
        const articleText = $("article p")
            .map((i, el) => $(el).text().replace(/\s+/g, ' ').trim()) // Removes excess spaces
            .get()
            .join("\n");

        // Write data to a file
        fs.writeFileSync("article.txt", articleText, "utf8");

        return articleText; 
    } catch (error) {
        console.error("Error fetching the article:", error);
        return null;
    }
}

// Execute the function and export the result
async function main() {
    const url = "https://www.ndtv.com/world-news/make-a-deal-or-we-are-out-trump-and-zelensky-argue-in-oval-office-7818820";
    const extractedText = await scrapeArticle(url);
    
    if (extractedText) {
        console.log("Article saved to article.txt");
    }
}

main();
