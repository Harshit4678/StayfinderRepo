// src/pages/Inbox.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import MessageBubble from "../Chat/MessageBubble";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Inbox() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:5000/api/conversations/${user._id}`)
      .then((res) => setConversations(res.data))
      .catch((err) => console.log("Error loading conversations", err));
  }, [user]);

  useEffect(() => {
    if (selectedConv) {
      socket.emit("join_conversation", selectedConv._id);

      axios
        .get(`http://localhost:5000/api/messages/${selectedConv._id}`)
        .then((res) => setMessages(res.data));
    }
  }, [selectedConv]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (msg.conversationId === selectedConv?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedConv]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const msgObj = {
      conversationId: selectedConv._id,
      sender: user._id,
      text: newMsg,
    };

    const res = await axios.post(`http://localhost:5000/api/messages`, msgObj);
    socket.emit("send_message", res.data);
    setMessages((prev) => [...prev, res.data]);
    setNewMsg("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {conversations.map((conv) => {
          const partnerId = conv.members.find((id) => id !== user._id);
          return (
            <button
              key={conv._id}
              onClick={() => setSelectedConv(conv)}
              className={`block w-full text-left p-2 rounded ${
                selectedConv?._id === conv._id ? "bg-blue-100" : ""
              }`}
            >
              Chat with {partnerId}
            </button>
          );
        })}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-4 border-b bg-white shadow">
              <h3 className="font-bold">Chat Room</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.filter(Boolean).map((msg) => (
                <MessageBubble key={msg._id} msg={msg} userId={user._id} />
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                className="border flex-1 p-2 rounded"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
