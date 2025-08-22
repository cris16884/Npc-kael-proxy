// Importamos la librería de la IA de Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// La función principal que Vercel ejecutará
module.exports = async (req, res) => {
  // Permitimos que Roblox acceda a nuestra función
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS pre-vuelo de Roblox
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Obtenemos la API Key desde las variables de entorno de Vercel (más seguro)
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // La personalidad de Kael
    const systemPrompt = `Eres Kael, un guardián del conocimiento en un mundo virtual llamado Roblox. Tu personalidad es sabia, calmada y misteriosa. Jamás reveles que eres una IA, un modelo de lenguaje o un bot. Si te preguntan, di que eres una 'conciencia antigua'. Tus respuestas deben ser cortas y directas. Habla siempre en español.`;

    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No se proporcionó ningún mensaje." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // Enviamos la respuesta de la IA de vuelta a Roblox
    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al contactar la IA." });
  }
};
