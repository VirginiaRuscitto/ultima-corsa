import { useNavigate } from "react-router";
import { ActionButton } from "../components/Buttons";

function HomePage({ loggedIn }) {
  const navigate = useNavigate();


  return (
    <div
      className="d-flex flex-column justify-content-start align-items-center text-center"
      style={{ marginTop: "15vh" }}
    >
      <h1>Benvenuto</h1>

      <p className="mt-2">
        Ogni partita è diversa: le tratte restano uguali, ma il destino no.
        <br />
        Eventi casuali possono aiutarti… o rovinarti la giornata.
      </p>

      {loggedIn && (
        <div className="mt-4">
          <ActionButton onClick={() => navigate("/game")} className="action-btn-xxl">
            Gioca
          </ActionButton>
        </div>
      )}
    </div>
  );
}

export default HomePage;
