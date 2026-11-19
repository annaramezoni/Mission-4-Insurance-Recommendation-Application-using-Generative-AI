import Navbar from "./Navbar";
import styles from "./Chat.module.css";
import { useState, useEffect } from "react";

export default function Chat() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMessageAndId();
  }, []);

  async function getMessageAndId() {
    try {
      const response = await fetch("http://localhost:3000/startChat", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      setSessionId(result.sessionId);
      setMessages([{ sender: "Tina", content: result.message }]);
    } catch (err) {
      console.error({
        message: "Error fetching welcome message:",
        error: err.message,
      });
    }
  }

  async function getAndStoreUserInput(e) {
    e.preventDefault();

    const input = userInput.trim();
    if (!input) return;
    setUserInput("");

    await sendMessage(input);
  }

  async function sendMessage(message) {
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "Me", content: message }]);
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          sessionId: sessionId,
          message: message,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setMessages(result.messages);
    } catch (err) {
      console.error({
        message: "Error fetching AI response:",
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.chatbotBox}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <h4>Tina - Your AI Insurance Policy Assistant</h4>
            <button>X</button>
          </div>
          {/* Chat conversation */}
          <div>
            {messages.map((message, index) => (
              <div className={styles.chatMessage} key={index}>
                <strong>{message.sender}:</strong>
                <p
                  className={
                    message.sender === "Me"
                      ? styles.userMessage
                      : styles.tinaMessage
                  }>
                  {message.content}
                </p>
              </div>
            ))}
          </div>
          {/* Input box */}
          <form
            className={styles.inputContainer}
            onSubmit={getAndStoreUserInput}>
            <input
              className={styles.chatInput}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              className={styles.sendButton}
              type="submit"
              aria-label="Send" //accessibility
              disabled={loading || !userInput.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
