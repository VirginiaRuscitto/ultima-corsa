import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";

import API from "../../API.js";
import { ActionButton } from "../components/Buttons";
import MessageContext from "../MessageContext";

function SetupPage() {
  const navigate = useNavigate();

  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const { setMessage } = useContext(MessageContext);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const net = await API.getNetwork();
        setNetwork(net);
        setNetworkError(false);
      } catch {
        setNetworkError(true);
        setMessage({
          type: "danger",
          msg: "Impossibile caricare la rete",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, []);

  async function handleReady() {
    if (!network) {
      setMessage({
        type: "danger",
        msg: "Rete non disponibile",
      });
      return;
    }

    setCreating(true);
    setMessage(null);

    try {
      const game = await API.createGame();
      navigate(`/game/${game.id}`, { state: { game } });
    } catch {
      setMessage({
        type: "danger",
        msg: "Errore nella creazione della partita",
      });

      setCreating(false);
    }
  }

  if (loading || creating) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" className="mb-3" />

          <p className="text-muted">
            {loading ? "Caricamento rete..." : "Creazione partita..."}
          </p>
        </div>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="text-center mt-5">
        <h3>Errore nel caricamento della rete</h3>

        <p className="text-muted">
          Non è stato possibile recuperare i dati necessari per iniziare una
          partita.
        </p>
      </div>
    );
  }

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

      <ActionButton onClick={handleReady} className="action-btn-xl">
        Inizia
      </ActionButton>
    </div>
  );
}

export default SetupPage;
