import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";

interface Message {
  id: string;
  text: string;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message: Message = {
      id: (socket.id ?? "unknown") + Date.now(),
      text: input,
    };

    socket.emit("message", message);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <b>{msg.id.slice(0, 5)}:</b> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Digite sua mensagem..."
        style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button onClick={sendMessage} style={{ marginTop: 10, width: "100%" }}>
        Enviar
      </button>
    </div>
  );
};
