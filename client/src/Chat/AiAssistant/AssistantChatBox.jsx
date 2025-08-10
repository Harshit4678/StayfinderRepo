import axios from "axios";
import { useState } from "react";

export default function AssistantChatBox({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! How can I help you today? 😊" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/assistant/ask", {
        message: input,
      });

      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong while responding.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 bg-white shadow-xl w-80 max-h-[70vh] rounded-lg flex flex-col z-50">
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <h2 className="text-sm font-semibold">StayFinder Assistant</h2>
        <button onClick={onClose} className="text-white text-sm">
          ✖
        </button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-gray-100 self-end text-right ml-auto"
                : "bg-blue-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-sm border rounded px-2 py-1 mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
