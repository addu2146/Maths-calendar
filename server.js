import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_DATA, DEFAULT_MONTHS } from './src/js/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/months', (req, res) => {
    res.json({ months: DEFAULT_MONTHS, data: DEFAULT_DATA });
});

app.post('/api/gemini', async (req, res) => {
    const { type = 'explain', topic = 'the topic', day = 'day', month = 'month', prompt } = req.body || {};
    const finalPrompt = prompt || buildPrompt(type, topic, day, month);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.json({ content: 'Set GEMINI_API_KEY to enable live responses.', live: false, fallbackReason: 'API key missing' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }] })
        });
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            return res.json({ content: text, live: true });
        }
        return res.json({ content: 'No content returned from Gemini.', live: false, fallbackReason: 'Empty response' });
    } catch (err) {
        return res.json({ content: `Gemini request failed: ${err.message}`, live: false, fallbackReason: 'Request error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Maths Calendar server running at http://localhost:${PORT}`);
});

function buildPrompt(type, topic, day, month) {
    if (String(type).toLowerCase() === 'fact') {
        return `Share a brief historical or contextual note about the topic "${topic}" (Month ${month}, Day ${day}). Keep it rigorous yet accessible.`;
    }
    return `Provide a concise explanation of "${topic}" suitable for advanced high-school students (Day ${day}, Month ${month}). Include one worked example.`;
}
