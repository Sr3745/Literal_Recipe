export default async function handler(request, response) {
    // 1. Get the API Key from Vercel's Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return response.status(500).json({ error: "API key not configured on Vercel." });
    }

    // 2. Get the recipe prompt sent from your frontend
    const recipePrompt = request.body.prompt;
    if (!recipePrompt) {
        return response.status(400).json({ error: "Prompt is missing." });
    }

    // 3. Construct the full prompt for the AI
    const fullPrompt = `Generate a funny, cartoonish, literal visualization of this cooking instruction: "${recipePrompt}"`;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`;

    // 4. Call the Google AI API from our secure server function
    try {
        const aiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [{ "parts": [{ "text": fullPrompt }] }]
            })
        });

        const data = await aiResponse.json();

        // 5. Send the AI's response back to our frontend
        const aiResponseText = data.candidates[0].content.parts[0].text;
        response.status(200).json({ text: aiResponseText });

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to fetch data from AI." });
    }
}