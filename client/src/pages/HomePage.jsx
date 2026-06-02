import { useNavigate } from "react-router";
import API from "../../API.js";
import { ActionButton } from "../components/Buttons";

function HomePage({ loggedIn }) {

  const navigate = useNavigate();
  const handlePlay = async () => {
    try {
      const game = await API.createGame();
      navigate(`/game/${game.id}`);
    } catch (err) {
      console.error("Errore creazione partita:", err);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-start align-items-center text-center" style={{ marginTop: "15vh" }}>

      <h1>Benvenuto</h1>

      <p className="mt-2">
        Ogni partita è diversa: le tratte restano uguali, ma il destino no. <br/>
        Eventi casuali possono aiutarti… o rovinarti la giornata.
      </p>

      {loggedIn && (
        <div className="mt-4">
          <ActionButton onClick={handlePlay} className="action-btn-xxl">
            Gioca
          </ActionButton>
        </div>
      )}

    </div>
  );
}

export default HomePage;