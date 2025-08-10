// src/components/Chat/AiAssistant/AssistantWidget.jsx
import { useState } from "react";
import AssistantChatBox from "./AssistantChatBox";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg cursor-pointer z-50"
      >
        💬 StayFi Assistant
      </div>

      {open && <AssistantChatBox onClose={() => setOpen(false)} />}
    </>
  );
}
