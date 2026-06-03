import { Row, Col } from "react-bootstrap";
import { ActionButton } from "../Buttons";

function SetupPhase({ onReady }) {
  return (
    <div className="text-center">
      <h2 className="game-h2">Setup</h2>
      <p>
        Osserva le linee, le stazioni e i collegamenti. Quando sei pronto,
        inizia la partita.
      </p>

      <div className="mt-4 mb-5 d-flex justify-content-center">
        <img
          src="/img/map-full.png"
          alt="Mappa completa della rete metropolitana"
          className="setup-map img-fluid shadow"
        />
      </div>

      <ActionButton onClick={onReady} className="action-btn-xl">
        Inizia
      </ActionButton>
    </div>
  );
}

export default SetupPhase;
