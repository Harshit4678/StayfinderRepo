import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { conversationId, sender, text } = req.body;

  try {
    const msg = new Message({
      conversationId,
      sender,
      text,
    });

    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

console.log("getMessagesByConversation loaded");
export const getMessagesByConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
