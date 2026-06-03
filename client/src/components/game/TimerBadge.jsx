import { Badge } from "react-bootstrap";

function TimerBadge({ timeLeft }) {
  const variant =
    timeLeft <= 15 ? "danger" : timeLeft <= 30 ? "warning" : "success";
  return (
    <Badge bg={variant} className="timer-badge">
      <i className="bi bi-clock me-1"></i>
      {timeLeft}s
    </Badge>
  );
}

export default TimerBadge;
