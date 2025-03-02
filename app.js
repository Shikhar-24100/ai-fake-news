const express = require('express');
const cors = require('cors');
const axios = require('axios');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const DEEPSEEK_API_URL = 'https://api.deepseek.com/';
const DEEPSEEK_API_KEY = 'process.env.DEEPSEEK_API_KEY'; // Replace with your actual API key

// Analyze text using DeepSeek API
app.post('/analyze', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-v3', // Specify the model; adjust as needed
                prompt: `Analyze the following text for factual accuracy: "${text}"`,
                max_tokens: 100,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                },
            }
        );

        const analysis = response.data.choices[0].text.trim();
        res.json({ analysis });
    } catch (error) {
        console.error('Error communicating with DeepSeek API:', error);
        res.status(500).json({ error: 'Error analyzing text' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
