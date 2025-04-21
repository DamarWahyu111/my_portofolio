const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const genAI = new GoogleGenerativeAI("AIzaSyC_mUYK9ZABYqWDB85idiIjtyEqJg_0NIg");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Route utama: kirim index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route chatbot
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  // const prompt = message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ reply: "Maaf, terjadi kesalahan saat menghubungi AI Gemini." });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
