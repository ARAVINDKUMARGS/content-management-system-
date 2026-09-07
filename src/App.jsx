import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");

        const response = await fetch(`${API_URL}/users`);

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        const allUsers = data.users || [];

        setUsers(allUsers);

        // Shyam ko current user maanenge
        const firstChatUser = allUsers.find(
          (user) => user.name !== "Shyam"
        );

        if (firstChatUser) {
          setSelectedUser(firstChatUser);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
        setError(
          "Unable to load users. Please check whether the backend is running."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // =========================
  // CURRENT USER
  // =========================
  const currentUser = users.find(
    (user) => user.name === "Shyam"
  );

  // =========================
  // FETCH MESSAGES
  // =========================
  useEffect(() => {
    if (!selectedUser || !currentUser) {
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setError("");

        const response = await fetch(
          `${API_URL}/messages/${selectedUser._id}?currentUserId=${currentUser._id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Fetch messages error:", error);

        setMessages([]);

        setError("Unable to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter(
    (user) =>
      user.name !== "Shyam" &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // FORMAT TIME
  // =========================
  const getCurrentTime = (date = new Date()) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (
      !trimmedMessage ||
      !selectedUser ||
      !currentUser ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          sender: currentUser._id,
          receiver: selectedUser._id,
          text: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      if (data.message) {
        setMessages((previousMessages) => [
          ...previousMessages,
          data.message,
        ]);
      }

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);

      setError("Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  // =========================
  // ENTER KEY
  // =========================
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loadingUsers) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="logo-icon">L</div>

          <h2>Loading Lumen...</h2>

          <p>Connecting to your chats</p>
        </div>
      </div>
    );
  }

  // =========================
  // CURRENT USER NOT FOUND
  // =========================
  if (!currentUser) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="logo-icon">L</div>

          <h2>Shyam user not found</h2>

          <p>
            Please make sure Shyam exists in MongoDB.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NO CHAT USER
  // =========================
  if (!selectedUser) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="logo-icon">L</div>

          <h2>No users found</h2>

          <p>Please check your database.</p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="sidebar-header">

          <div className="logo">

            <div className="logo-icon">
              L
            </div>

            <span>
              Lumen
            </span>

          </div>

          <button
            className="new-chat-btn"
            title="New Chat"
          >
            +
          </button>

        </div>

        {/* Search */}

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="chat-label">
          MESSAGES
        </div>

        {/* Users */}

        <div className="user-list">

          {filteredUsers.length === 0 ? (

            <div className="empty-chat">
              <p>
                No users found.
              </p>
            </div>

          ) : (

            filteredUsers.map((user) => (

              <button
                key={user._id}
                className={`user-item ${
                  selectedUser._id === user._id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedUser(user)
                }
              >

                <div className="avatar">

                  {user.avatar ||
                    user.name.charAt(0)}

                  <span
                    className={`status-dot ${
                      user.status === "online"
                        ? "online"
                        : "offline"
                    }`}
                  />

                </div>

                <div className="user-info">

                  <div className="user-top">

                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      {user.lastMessageTime
                        ? getCurrentTime(
                            user.lastMessageTime
                          )
                        : ""}
                    </small>

                  </div>

                  <p>
                    {user.lastMessage ||
                      "Start a conversation"}
                  </p>

                </div>

              </button>

            ))

          )}

        </div>

        {/* Profile */}

        <div className="sidebar-footer">

          <div className="profile-avatar">
            {currentUser.avatar ||
              currentUser.name.charAt(0)}
          </div>

          <div>

            <strong>
              Shyam
            </strong>

            <span>
              Author
            </span>

          </div>

          <button className="settings-btn">
            ⚙
          </button>

        </div>

      </aside>

      {/* ================= CHAT AREA ================= */}

      <main className="chat-area">

        {/* Header */}

        <header className="chat-header">

          <div className="chat-user">

            <div className="avatar large">

              {selectedUser.avatar ||
                selectedUser.name.charAt(0)}

              <span
                className={`status-dot ${
                  selectedUser.status === "online"
                    ? "online"
                    : "offline"
                }`}
              />

            </div>

            <div>

              <h2>
                {selectedUser.name}
              </h2>

              <span
                className={
                  selectedUser.status === "online"
                    ? "online-text"
                    : "offline-text"
                }
              >
                ●{" "}
                {selectedUser.status === "online"
                  ? "Online"
                  : "Offline"}
              </span>

            </div>

          </div>

          <div className="header-actions">

            <button title="Search">
              ⌕
            </button>

            <button title="More">
              ⋮
            </button>

          </div>

        </header>

        {/* Error */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Messages */}

        <section className="messages">

          <div className="date-divider">
            <span>
              Today
            </span>
          </div>

          {loadingMessages ? (

            <div className="empty-chat">

              <p>
                Loading messages...
              </p>

            </div>

          ) : messages.length === 0 ? (

            <div className="empty-chat">

              <div className="empty-avatar">
                {selectedUser.avatar ||
                  selectedUser.name.charAt(0)}
              </div>

              <h3>
                No messages yet
              </h3>

              <p>
                Start a conversation with{" "}
                {selectedUser.name}.
              </p>

            </div>

          ) : (

            messages.map((item) => {

              const senderId =
                typeof item.sender === "object"
                  ? item.sender._id
                  : item.sender;

              const isMine =
                String(senderId) ===
                String(currentUser._id);

              return (

                <div
                  key={item._id}
                  className={`message ${
                    isMine
                      ? "sent"
                      : "received"
                  }`}
                >

                  {!isMine && (

                    <div className="message-avatar">

                      {selectedUser.avatar ||
                        selectedUser.name.charAt(0)}

                    </div>

                  )}

                  <div>

                    <div className="message-bubble">
                      {item.text}
                    </div>

                    <span className="message-time">

                      {getCurrentTime(
                        item.createdAt
                      )}

                      {isMine && " ✓✓"}

                    </span>

                  </div>

                </div>

              );
            })

          )}

        </section>

        {/* Input */}

        <div className="message-input-area">

          <button
            className="input-action"
            title="Attach file"
          >
            📎
          </button>

          <input
            type="text"
            placeholder={`Message ${selectedUser.name}...`}
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={sending}
          />

          <button
            className="emoji-btn"
            title="Emoji"
          >
            🙂
          </button>

          <button
            className="send-btn"
            onClick={handleSend}
            title="Send message"
            disabled={
              sending ||
              !message.trim()
            }
          >
            {sending ? "..." : "➤"}
          </button>

        </div>

      </main>

    </div>
  );
}

export default App;