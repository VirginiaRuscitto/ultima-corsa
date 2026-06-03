import "../styles/App.css";

export function AuthButton({ children, onClick }) {
  return (
    <button className="auth-btn" onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function ActionButton({ children, onClick, disabled = false, type = "button", className = ""}) {
  return (
    <button className={`action-btn ${className}`} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}