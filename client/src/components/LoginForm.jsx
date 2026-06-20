import { useState } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { ActionButton } from "./Buttons";

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) return setError("Username obbligatorio");
    if (!password) return setError("Password obbligatoria");

    try {
      setIsSubmitting(true);
      setError("");

      await onSubmit({username: username.trim(), password});
    } catch (err) {
      setError(err.message || "Credenziali non valide");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="login-card p-4">
      <h3 className="mb-4 text-center">Accedi</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} onChange={(e) => {setUsername(e.target.value); if (error) setError("");}} disabled={isSubmitting}/>
        </Form.Group>

        <Form.Group className="mb-4" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => {setPassword(e.target.value); if (error) setError("");}} disabled={isSubmitting}/>
        </Form.Group>

        <div className="d-flex justify-content-center">
          <ActionButton type="submit" disabled={isSubmitting || !username.trim() || !password}>
            {isSubmitting ? "Accesso in corso…" : "Entra"}
          </ActionButton>
        </div>
      </Form>
    </Card>
  );
}

export default LoginForm;