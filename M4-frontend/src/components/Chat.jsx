import Navbar from "./Navbar";
import styles from "./Chat.module.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  // begins a session and loads the welcome message
  async function startChat() {
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

  // it validates, clears the input, and calls sendMessage
  async function handleSubmit(e) {
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
            <button
              type="button"
              aria-label="Return to home"
              onClick={() => navigate("/")}>
              X
            </button>
          </div>
          {/* Chat conversation */}
          <div className={styles.messages} ref={messagesRef}>
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
          <form className={styles.inputContainer} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className={styles.chatInput}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading} //It prevents the user from sending another message while Tina is still processing the previous one.
            />
            <button
              className={styles.sendButton}
              type="submit"
              aria-label="Send" //accessibility
              disabled={loading || !userInput.trim()} //It prevents submitting an empty message.
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
