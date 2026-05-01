// Remplacez l'import d'Anthropic par celui de Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = req.body.prompt;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
