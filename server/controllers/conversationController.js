import { Conversation } from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = new Conversation({
        members: [senderId, receiverId],
      });
      await convo.save();
    }

    res.status(200).json(convo);
  } catch (err) {
    res.status(500).json({ message: "Error creating conversation" });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });

    res.json(convos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations" });
  }
};
