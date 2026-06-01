import { useNavigate, useLocation } from "react-router";
import LoginForm from "../components/LoginForm";

function LoginPage({ handleLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const onSubmit = async (credentials) => {
    await handleLogin(credentials);
    navigate(from, { replace: true });
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
}

export default LoginPage;