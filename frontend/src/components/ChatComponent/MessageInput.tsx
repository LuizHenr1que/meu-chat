interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
}

export default function MessageInput({ message, setMessage, sendMessage }: MessageInputProps) {
  return (
    <input
      className="w-full mb-2 p-2 border rounded"
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
      placeholder="Type your message..."
    />
  );
}
