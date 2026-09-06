import { useState } from "react";
import "./App.css";

const users = [
  {
    id: 1,
    name: "Rakesh",
    status: "Online",
    avatar: "R",
    lastMessage: "Hey! How are you?",
    time: "10:42 AM",
  },
  {
    id: 2,
    name: "Sadanand",
    status: "Online",
    avatar: "S",
    lastMessage: "Project update?",
    time: "09:35 AM",
  },
  {
    id: 3,
    name: "Poojitha",
    status: "Offline",
    avatar: "P",
    lastMessage: "Okay, thank you!",
    time: "Yesterday",
  },
  {
    id: 4,
    name: "Sanika",
    status: "Online",
    avatar: "S",
    lastMessage: "I will check it.",
    time: "Yesterday",
  },
  {
    id: 5,
    name: "Ashmitha",
    status: "Offline",
    avatar: "A",
    lastMessage: "See you tomorrow.",
    time: "Monday",
  },
];

const initialMessages = {
  1: [
    {
      id: 1,
      sender: "them",
      text: "Hello Shyam! 👋",
      time: "10:38 AM",
    },
    {
      id: 2,
      sender: "them",
      text: "How is the project going?",
      time: "10:39 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "Hey Rakesh! It's going well. 🚀",
      time: "10:40 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "I'm currently working on the Personal Chat module.",
      time: "10:41 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "Great! Let me know if you need anything.",
      time: "10:42 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "them",
      text: "Hey Shyam!",
      time: "09:30 AM",
    },
    {
      id: 2,
      sender: "them",
      text: "Do you have any project update?",
      time: "09:35 AM",
    },
  ],
  3: [
    {
      id: 1,
      sender: "them",
      text: "Okay, thank you!",
      time: "Yesterday",
    },
  ],
  4: [
    {
      id: 1,
      sender: "them",
      text: "I will check it.",
      time: "Yesterday",
    },
  ],
  5: [
    {
      id: 1,
      sender: "them",
      text: "See you tomorrow.",
      time: "Monday",
    },
  ],
};

function App() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = messages[selectedUser.id] || [];

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: trimmedMessage,
      time: getCurrentTime(),
    };

    setMessages((previousMessages) => ({
      ...previousMessages,
      [selectedUser.id]: [
        ...(previousMessages[selectedUser.id] || []),
        newMessage,
      ],
    }));

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">L</div>
            <span>Lumen</span>
          </div>

          <button className="new-chat-btn" title="New Chat">
            +
          </button>
        </div>

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="chat-label">MESSAGES</div>

        <div className="user-list">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              className={`user-item ${
                selectedUser.id === user.id ? "active" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="avatar">
                {user.avatar}

                <span
                  className={`status-dot ${
                    user.status === "Online" ? "online" : "offline"
                  }`}
                />
              </div>

              <div className="user-info">
                <div className="user-top">
                  <strong>{user.name}</strong>
                  <small>{user.time}</small>
                </div>

                <p>{user.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="profile-avatar">S</div>

          <div>
            <strong>Shyam</strong>
            <span>Author</span>
          </div>

          <button className="settings-btn">⚙</button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        <header className="chat-header">
          <div className="chat-user">
            <div className="avatar large">
              {selectedUser.avatar}

              <span
                className={`status-dot ${
                  selectedUser.status === "Online" ? "online" : "offline"
                }`}
              />
            </div>

            <div>
              <h2>{selectedUser.name}</h2>

              <span
                className={
                  selectedUser.status === "Online"
                    ? "online-text"
                    : "offline-text"
                }
              >
                ● {selectedUser.status}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button title="Search">⌕</button>
            <button title="More">⋮</button>
          </div>
        </header>

        {/* Messages */}
        <section className="messages">
          <div className="date-divider">
            <span>Today</span>
          </div>

          {currentMessages.map((item) => (
            <div
              key={item.id}
              className={`message ${
                item.sender === "me" ? "sent" : "received"
              }`}
            >
              {item.sender === "them" && (
                <div className="message-avatar">
                  {selectedUser.avatar}
                </div>
              )}

              <div>
                <div className="message-bubble">{item.text}</div>

                <span className="message-time">
                  {item.time}

                  {item.sender === "me" && " ✓✓"}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Input */}
        <div className="message-input-area">
          <button className="input-action" title="Attach file">
            📎
          </button>

          <input
            type="text"
            placeholder={`Message ${selectedUser.name}...`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="emoji-btn" title="Emoji">
            🙂
          </button>

          <button
            className="send-btn"
            onClick={handleSend}
            title="Send message"
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;