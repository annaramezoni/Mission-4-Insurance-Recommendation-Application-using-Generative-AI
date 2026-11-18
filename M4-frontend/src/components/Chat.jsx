import Navbar from "./Navbar";
import styles from "./Chat.module.css";
import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

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
      setMessages([
        {
          sender: "Tina",
          content: result.message,
        },
      ]);
    } catch (err) {
      console.error({
        message: "Error fetching welcome message:",
        error: err.message,
      });
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
          <div className={styles.chatMessages}>
            {messages.map((message, index) => (
              <div className={styles.chatMessage} key={index}>
                <strong>{message.sender}:</strong>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
