import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";
import API from "../../API.js";
import SetupPhase from "../components/game/SetupPhase.jsx";
import PlanningPhase from "../components/game/PlanningPhase.jsx";
import ExecutionPhase from "../components/game/ExecutionPhase.jsx";
import ResultPhase from "../components/game/ResultPhase.jsx";
import MessageContext from "../MessageContext";

function GamePage({ }) {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("setup"); // setup-planning-execution-result
  const [network, setNetwork] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const { setMessage } = useContext(MessageContext);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        setLoading(true);
        const net = await API.getNetwork();
        setNetwork(net);
        setNetworkError(false);
      } catch (error) {
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

    setLoading(true);
    setMessage(null);

    try {
      const data = await API.createGame();

      setGameData(data);
      setPhase("planning");
    } catch (err) {
      setMessage({
        type: "danger",
        msg: "Errore nella creazione della partita",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitRoute(connectionIds) {
    setLoading(true);
    setMessage(null);

    try {
      const result = await API.submitRoute(gameData.id, connectionIds);

      setRouteResult(result);

      if (result.valid) {
        setPhase("execution");
      } else {
        setPhase("result");
      }
    } catch (err) {
      setMessage({
        type: "danger",
        msg: "Errore nell'invio del percorso",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleExecutionDone() {
    setPhase("result");
    setMessage(null);
  }

  function handleNewGame() {
    setGameData(null);
    setRouteResult(null);
    setPhase("setup");
  }

  if (loading) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" className="mb-3" />

          <p className="text-muted">
            {phase === "setup" ? "Caricamento rete..." : "Elaborazione..."}
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
    <>
      {phase === "setup" && <SetupPhase onReady={handleReady} />}

      {phase === "planning" && network && gameData && (
        <PlanningPhase
          connections={network.connections}
          startStation={gameData.startStation}
          endStation={gameData.endStation}
          onSubmit={handleSubmitRoute}
        />
      )}

      {phase === "execution" && routeResult?.valid && (
        <ExecutionPhase
          segments={routeResult.segments}
          onDone={handleExecutionDone}
        />
      )}

      {phase === "result" && routeResult && (
        <ResultPhase
          routeResult={routeResult}
          onNewGame={handleNewGame}
          onGoHome={() => navigate("/")}
          gameData={gameData}
        />
      )}
    </>
  );
}

export default GamePage;
