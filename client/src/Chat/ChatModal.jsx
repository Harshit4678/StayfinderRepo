import { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";
import MessageBubble from "./MessageBubble";

export default function ChatModal({ hostId, user, onClose }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Join conversation or create one
  useEffect(() => {
    const startChat = async () => {
      const res = await axios.post("http://localhost:5000/api/conversations", {
        senderId: user._id,
        receiverId: hostId,
      });

      setConversationId(res.data._id);
      socket.emit("join_conversation", res.data._id);

      const msgs = await axios.get(
        `http://localhost:5000/api/messages/${res.data._id}`
      );
      setMessages(msgs.data);
    };

    if (user && hostId) startChat();
  }, [user, hostId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const handleSend = async () => {
    const res = await axios.post("http://localhost:5000/api/messages", {
      sender: user._id,
      text,
      conversationId,
    });

    socket.emit("send_message", res.data);
    setText("");
  };

  return (
    <div className="fixed bottom-20 left-6 w-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Chat with Host</span>
        <button onClick={onClose}>❌</button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-2">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isSender={msg.sender === user._id}
          />
        ))}
      </div>

      <div className="p-2 flex border-t gap-2">
        <input
          className="flex-1 border px-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
