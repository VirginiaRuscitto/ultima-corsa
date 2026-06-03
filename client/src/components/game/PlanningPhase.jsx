import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import useGameTimer from "./hooks/useGameTimer.js";
import { useContext } from "react";
import MessageContext from "../../MessageContext.jsx";
import StationBox from "./StationBox";
import TimerBadge from "./TimerBadge";
import { ActionButton } from "../Buttons.jsx";

function PlanningHeader({ startStation, endStation, timeLeft }) {
  return (
    <div className="planning-header p-3 mb-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <StationBox label="Partenza" station={startStation} />
        <i className="bi bi-arrow-right route-arrow"></i>
        <StationBox label="Arrivo" station={endStation} />
      </div>

      <div className="d-flex">
        <TimerBadge timeLeft={timeLeft} />
      </div>
    </div>
  );
}

function MapPanel() {
  return (
    <div className="map-panel p-3">
      <h3 className="mb-3">Mappa</h3>
      <img
        src="/img/map-stations.png"
        alt="Mappa stazioni"
        className="setup-map rounded"
      />
      <p className="mt-2 mb-0 text-muted">
        Usa l’elenco a destra per costruire il percorso
      </p>
    </div>
  );
}

function ConnectionsPanel({
  connections,
  selectedIds,
  toggleConnection,
  onSubmit,
}) {
  return (
    <div className="connections-panel p-3 d-flex flex-column">
      <div className="connections-list flex-grow-1 mb-3">
        {connections.map((conn) => (
          <Form.Check
            key={conn.id}
            className="mb-2"
            type="checkbox"
            checked={selectedIds.includes(conn.id)}
            onChange={(e) => toggleConnection(conn.id, e.target.checked)}
            label={
              <div className="d-flex justify-content-between w-100">
                <span>
                  <strong>{conn.stationAName}</strong>
                  <i className="bi bi-arrow-left-right mx-2"></i>
                  <strong>{conn.stationBName}</strong>
                </span>
              </div>
            }
          />
        ))}
      </div>

      <ActionButton onClick={onSubmit} className="action-btn w-100">
        Conferma
      </ActionButton>
    </div>
  );
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function PlanningPhase({ connections, startStation, endStation, onSubmit }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [shuffledConnections, setShuffledConnections] = useState([]);
  const { timeLeft, expired, start, stop } = useGameTimer(90);

  const { setMessage } = useContext(MessageContext);

  useEffect(() => {
    if (connections?.length) {
      setShuffledConnections(shuffle(connections));
    }
  }, [connections]);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (!expired) return;
    onSubmit(selectedIds.map(Number));
  }, [expired, selectedIds, onSubmit]);

  function toggleConnection(connId, checked) {
    setSelectedIds((prev) =>
      checked ? [...prev, connId] : prev.filter((id) => id !== connId),
    );
  }

  function handleSubmit() {
    if (selectedIds.length < 2) {
      setMessage({ type: "warning", msg: "Seleziona almeno due tratte" });
      return;
    }
    stop();
    onSubmit(selectedIds.map(Number));
  }

  return (
    <div className="text-center">
      <h2 className="game-h2 mb-3">Pianificazione</h2>

      <PlanningHeader
        startStation={startStation}
        endStation={endStation}
        timeLeft={timeLeft}
      />

      <div className="planning-layout">
        <MapPanel />

        <ConnectionsPanel
          connections={shuffledConnections}
          selectedIds={selectedIds}
          toggleConnection={toggleConnection}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default PlanningPhase;
