interface Message {
  username: string;
  msg: string;
}

interface ChatWindowProps {
  messages: Message[];
  onlineUsers: string[];
  currentUser: string;
}

export default function ChatWindow({ messages, onlineUsers, currentUser }: ChatWindowProps) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-gray-700">
        <strong>Online:</strong> {onlineUsers.join(', ')}
      </div>

      <div className="border rounded h-48 overflow-y-auto p-2 mb-2 bg-gray-50 flex flex-col gap-2">
        {messages.map((m, i) => {
          const isMyMessage = m.username === currentUser;

          return (
            <div
              key={i}
              className={`flex ${isMyMessage ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow 
                  ${isMyMessage ? 'bg-green-200 text-gray-700' : 'bg-green-500 text-white'}
                `}
              >
                <p className="text-xs font-semibold">{m.username}</p>
                <p>{m.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
