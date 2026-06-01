import Button from "react-bootstrap/Button";
import "../styles/App.css";

export function AuthButton({ children, onClick, variant = "login" }) {
  return (
    <button className="auth-btn" onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function ActionButton({ children, onClick, disabled = false, type = "button"}) {
  return (
    <button className="action-btn" onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}