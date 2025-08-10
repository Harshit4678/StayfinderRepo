export default function MessageBubble({ msg, userId }) {
  if (!msg || !msg.text) return null; // Defensive: skip if msg is missing

  const isMine = msg.sender === userId;

  return (
    <div
      className={`p-2 rounded max-w-xs ${
        isMine ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200"
      }`}
    >
      {msg.text}
      <div className="text-xs text-right opacity-50">
        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
      </div>
    </div>
  );
}
