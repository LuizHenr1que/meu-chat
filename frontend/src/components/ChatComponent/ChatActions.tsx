interface ChatActionsProps {
  logout: () => void;
  sendMessage: () => void;
}

export default function ChatActions({ logout, sendMessage }: ChatActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={sendMessage}
      >
        Send
      </button>
      <button
        className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
