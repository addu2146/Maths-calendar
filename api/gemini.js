// Vercel Serverless Function for AI responses (Groq)
module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body || {};
    const { type = 'explain', topic = 'the topic', question = '', day = 'day', month = 'month' } = body;
    const finalPrompt = buildPrompt(type, topic, question, day, month);

    const groqKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL || 'gpt-oss-20b';

    if (!groqKey) {
        return res.status(200).json({
            content: getFallbackContent(type, topic),
            live: false,
            fallbackReason: 'Missing GROQ_API_KEY'
        });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
                model: groqModel,
                messages: [{ role: 'user', content: finalPrompt }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return res.status(200).json({
                content: getFallbackContent(type, topic),
                live: false,
                fallbackReason: `API error: ${response.status} ${response.statusText} ${errorText?.slice(0,180)}`
            });
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
            return res.status(200).json({ content: text, live: true });
        }
        return res.status(200).json({
            content: getFallbackContent(type, topic),
            live: false,
            fallbackReason: 'Empty response'
        });
    } catch (err) {
        console.error('AI request failed:', err);
        return res.status(200).json({ 
            content: getFallbackContent(type, topic), 
            live: false, 
            fallbackReason: `Request error: ${err.message}` 
        });
    }
};

function buildPrompt(type, topic, question, day, month) {
    if (type === 'hint') {
        return `Give a helpful hint (NOT the answer) for this math question: "${question}" about "${topic}". Be encouraging and guide the student toward the solution without giving it away. Keep it to 2-3 sentences. Make it fun and kid-friendly!`;
    }
    if (type === 'fact') {
        return `Share a fun, interesting fact about "${topic}" that would excite a young student learning math. Make it engaging and memorable. Keep it to 2-3 sentences.`;
    }
    // Default to explain
    return `Provide a clear, kid-friendly explanation of "${topic}" for the question: "${question}". Use simple language suitable for students. Include one worked example. Keep it under 150 words and make it fun!`;
}

function getFallbackContent(type, topic) {
    if (type === 'hint') {
        return `Here's a hint: Think carefully about what "${topic}" means. Break down the problem step by step, and look for patterns!`;
    }
    if (type === 'fact') {
        return `Fun fact: "${topic}" is used by mathematicians all around the world! Math helps us understand everything from building bridges to launching rockets!`;
    }
    return `Let me help you understand "${topic}"! This is an important concept in math. Try breaking it down into smaller pieces and working through examples.`;
}
