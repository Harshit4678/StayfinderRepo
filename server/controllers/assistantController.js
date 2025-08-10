import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // ya OPENAI_API_KEY, jo bhi .env me hai
  baseURL: "https://openrouter.ai/api/v1",
});

export const askAiAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct", // <-- OpenRouter model name
      messages: [
        {
          role: "system",
          content: `You're an AI assistant for StayFinder. Help users with:
- booking help
- response in language of the user
- payment awareness
- report fraud
- becoming a host
- listing management
- listing or location queries
- general travel advice
- local recommendations
- calm and flirtatious responses
- always be friendly and helpful
- never say "I don't know" or "I can't help with that"

If a user mentions fraud, scam, suspicious host, or any problem with a host or listing, always guide them to report the issue. Tell them: "You can scroll down on the listing details page and click the 'Having an issue? Report here' button to report your problem directly to StayFinder support or admin. Our team will assist you as soon as possible."
          `,
        },
        {
          role: "user",
          content: message,
        },
        {
          role: "Host",
          content: `you are Ai assistant for StayFinder's hosts , Help host with:
          - Help host to reply Customer
          - Idea for problem solving
          - listing management
            - listing or location queries
         - make perfect reply for promt given by hosts
          - marketings skills suggestion`, // <-- Optional: add context if needed
        },
      ],
    });

    const aiReply = response.choices[0].message.content.trim();
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "AI assistant failed to respond" });
  }
};
