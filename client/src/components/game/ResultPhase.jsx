import { useEffect, useContext } from "react";
import { Card, Badge } from "react-bootstrap";

import StationBox from "./StationBox";
import MessageContext from "../../MessageContext.jsx";
import { ActionButton } from "../Buttons";

function ResultSummary({ startStation, endStation, finalScore, valid }) {
  return (
    <Card className="text-center shadow mb-4 result-summary">
      <Card.Body className="py-3">
        <h3 className="result-status mb-3">
          {valid ? "PERCORSO COMPLETATO" : "PERCORSO FALLITO"}
        </h3>

        <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
          <StationBox label="Da" station={startStation} />
          <i className="bi bi-arrow-right route-arrow"></i>
          <StationBox label="A" station={endStation} />
        </div>

        <h1 className="result-score">{finalScore}</h1>

        <p className="text-muted mt-2 mb-0">
          <i className="bi bi-coin"></i> monete finali
        </p>
      </Card.Body>
    </Card>
  );
}

function SegmentRow({ seg }) {
  const variant =
    seg.coinEffect > 0
      ? "success"
      : seg.coinEffect < 0
        ? "danger"
        : "secondary";

  const prefix = seg.coinEffect > 0 ? "+" : "";

  return (
    <div className="segment-row px-3 py-2 border-bottom">
      <div className="segment-left">
        <p className="segment-route mb-1">
          {seg.from} → {seg.to}
          <span className="text-muted ms-2 small">({seg.lineName})</span>
        </p>

        <p className="segment-event mb-0">{seg.eventDescription}</p>
      </div>

      <div className="segment-right">
        <Badge bg={variant}>
          {prefix}
          {seg.coinEffect} <i className="bi bi-coin"></i>
        </Badge>
      </div>
    </div>
  );
}

function SegmentsList({ segments }) {
  if (!segments?.length) return null;

  return (
    <Card className="mb-4 segment-card">
      <Card.Header className="segment-card-header">
        <h5 className="mb-0">Riepilogo delle tratte</h5>
      </Card.Header>

      <Card.Body className="p-0">
        {segments.map((seg, i) => (
          <SegmentRow key={i} seg={seg} />
        ))}
      </Card.Body>
    </Card>
  );
}

function ResultPhase({ routeResult, onNewGame, onGoHome, gameData }) {
  const { valid, finalScore, segments } = routeResult || {};
  const { setMessage } = useContext(MessageContext);

  useEffect(() => {
    if (!routeResult) return;

    setMessage({
      type: valid ? "success" : "danger",
      msg: valid
        ? `Percorso completato con ${segments.length} tratte!`
        : "Percorso non valido: hai perso tutte le monete.",
    });

    return () => setMessage(null);
  }, [routeResult]);

  return (
    <div className="text-center execution-wrapper">
      <h2 className="game-h2 mb-3">Risultato</h2>

      <ResultSummary
        startStation={gameData?.startStation}
        endStation={gameData?.endStation}
        finalScore={finalScore}
        valid={valid}
      />

      {valid && <SegmentsList segments={segments} />}

      <div className="d-flex gap-3 justify-content-center mt-3">
        <ActionButton className="action-btn-xl" onClick={onNewGame}>
          Nuova partita
        </ActionButton>

        <ActionButton className="action-btn-xl" onClick={onGoHome}>
          Torna alla home
        </ActionButton>
      </div>
    </div>
  );
}

export default ResultPhase;
