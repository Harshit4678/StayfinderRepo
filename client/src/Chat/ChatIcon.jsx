export default function ChatIcon({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
    >
      💬 Chat with Host
    </button>
  );
}
