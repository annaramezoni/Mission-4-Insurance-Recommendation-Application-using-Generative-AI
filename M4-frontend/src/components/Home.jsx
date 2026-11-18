import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

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
      <nav className={styles.navbar1}>
        <img src="./images/logo.png" alt="Turners'logo" />
        <div className={styles.loginContainer}>
          <FontAwesomeIcon icon={faUser} />
          <a>LOGIN</a>
          <span>
            <i>OR</i>
          </span>
          <a>REGISTER</a>
        </div>
      </nav>
      <nav className={styles.navbar2}></nav>
      {/* ============ MAIN =========== */}
      <main className={styles.main}>
        <h2>{welcomeMessage}</h2>
      </main>
    </div>
  );
}
