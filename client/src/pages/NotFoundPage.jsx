import { useNavigate } from "react-router";
import { ActionButton } from "../components/Buttons";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-start align-items-center text-center" style={{ marginTop: "15vh" }}>
      <h1>Pagina non trovata</h1>
      <ActionButton className="mt-5" onClick={() => navigate("/")}> Torna alla Home</ActionButton>
    </div>
  );
}

export default NotFoundPage;