import styles from "./Home.module.css";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Home() {
  const [welcomeMessage, setWelcomeMessage] = useState("");

  async function getMessage() {
    try {
      const response = await fetch("http://localhost:3000/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.text();
      setWelcomeMessage(result);
    } catch (err) {
      console.error({
        message: "Error fetching welcome message:",
        error: err.message,
      });
    }
  }

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <div>
      <Navbar />
      {/* ============ MAIN =========== */}
      <main className={styles.main}>
        <h2>{welcomeMessage}</h2>
        <Link to="/chat" className={styles.chatButton}>
          Chat with Tina
        </Link>
      </main>
    </div>
  );
}
