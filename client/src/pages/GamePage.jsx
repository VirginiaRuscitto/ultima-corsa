import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import API from "../../API.js";
import PlanningPhase from "../components/game/PlanningPhase.jsx";
import ExecutionPhase from "../components/game/ExecutionPhase.jsx";
import ResultPhase from "../components/game/ResultPhase.jsx";
import MessageContext from "../MessageContext";

const GAME_DURATION_SECONDS = 90;

function GamePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [phase, setPhase] = useState("loading"); // loading-planning-execution-result
  const [network, setNetwork] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
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
        setMessage({ type: "danger", msg: "Impossibile caricare la rete" });
      }
    };

    fetchNetwork();
  }, []);

  useEffect(() => {
    function applyGame(data) {
      if (data.finalScore != null) {
        //controlla sia null che undefined
        setMessage({ type: "info", msg: "Questa partita è già conclusa" });
        navigate("/game");
        return;
      }

      const elapsedSeconds = dayjs().diff(dayjs(data.playedAt), "second");
      if (elapsedSeconds >= GAME_DURATION_SECONDS) {
        setMessage({
          type: "warning",
          msg: "Il tempo per questa partita è scaduto",
        });
        navigate("/game");
        return;
      }

      setGameData(data);
      setPhase("planning");
    }

    if (state?.game && String(state.game.id) === id) {
      applyGame(state.game);
      return;
    }

    API.getGame(id)
      .then(applyGame)
      .catch(() => {
        setMessage({ type: "danger", msg: "Impossibile caricare la partita" });
        navigate("/game");
      });
  }, [id]);

  useEffect(() => {
    return () => setMessage(null);
  }, []);

  async function handleSubmitRoute(connectionIds) {
    setMessage(null);

    try {
      const result = await API.submitRoute(gameData.id, connectionIds);
      navigate(location.pathname, { replace: true, state: null }); //importante per sigillare correttamente una partita anche lato frontend
      setRouteResult(result);
      setPhase(result.valid ? "execution" : "result");
    } catch {
      setMessage({ type: "danger", msg: "Errore nell'invio del percorso" });
    }
  }

  function handleExecutionDone() {
    setPhase("result");
    setMessage(null);
  }

  function handleNewGame() {
    setMessage(null);
    navigate("/game");
  }

  function handleGoHome() {
    setMessage(null);
    navigate("/");
  }

  if (phase === "loading" || !network) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" className="mb-3" />
          <p className="text-muted">Caricamento partita...</p>
        </div>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="text-center mt-5">
        <h3>Errore nel caricamento della rete</h3>
        <p className="text-muted">
          Non è stato possibile recuperare i dati necessari per la partita.
        </p>
      </div>
    );
  }

  return (
    <>
      {phase === "planning" && gameData && (
        <PlanningPhase
          connections={network.connections}
          startStation={gameData.startStation}
          endStation={gameData.endStation}
          playedAt={gameData.playedAt}
          duration={GAME_DURATION_SECONDS}
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
          onGoHome={handleGoHome}
          gameData={gameData}
        />
      )}
    </>
  );
}

export default GamePage;
