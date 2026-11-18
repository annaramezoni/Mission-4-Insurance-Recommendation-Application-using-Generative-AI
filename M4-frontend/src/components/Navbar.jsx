import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navbar.module.css";

export default function Navbar() {
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
    </div>
  );
}
