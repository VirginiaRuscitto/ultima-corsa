import { useState } from "react";
import { Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";
import { ActionButton } from "../Buttons.jsx";

function ExecutionHeader({ currentIndex, total }) {
  const percent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted small">
          Tratta {currentIndex + 1} di {total}
        </span>
      </div>
      <ProgressBar now={percent} animated className="execution-progress" />
    </div>
  );
}

function SegmentCard({ segment }) {
  let effectVariant;
  if (segment.coinEffect > 0) {
    effectVariant = "success";
  } else if (segment.coinEffect < 0) {
    effectVariant = "danger";
  } else {
    effectVariant = "secondary";
  }
  const effectPrefix = segment.coinEffect > 0 ? "+" : ""; //sennò gli effetti positivi sono senza segno

  return (
    <Card className="segment-card mb-4">
      <Card.Header className="segment-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <strong>{segment.from}</strong>
            <span className="text-muted d-flex align-items-center">
              <i className="bi bi-arrow-right route-arrow"></i>
            </span>
            <strong>{segment.to}</strong>
          </div>

          <small className="text-muted">{segment.lineName}</small>
        </div>
      </Card.Header>

      <Card.Body className="text-center py-4">
        <p className="fs-5 mb-3">{segment.eventDescription}</p>

        <Badge bg={effectVariant} className="fs-6 px-3 py-2 mb-3">
          {effectPrefix}
          {segment.coinEffect} <i className="bi bi-coin ms-1"></i>
        </Badge>

        <div className="text-muted">
          Monete dopo la tratta{" "}
          <strong className="text-dark">{segment.coinsAfter}</strong>
        </div>
      </Card.Body>
    </Card>
  );
}

function ExecutionPhase({ segments, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === segments.length - 1;
  const current = segments[currentIndex];

  function handleNext() {
    if (isLast) onDone();
    else setCurrentIndex((i) => i + 1);
  }

  return (
    <div className="execution-wrapper">
      <ExecutionHeader currentIndex={currentIndex} total={segments.length} />

      <SegmentCard segment={current} />

      <div className="text-center">
        <ActionButton onClick={handleNext} className="action-btn-xl">
          {isLast ? "Visualizza risultato finale" : "Prossima tratta →"}
        </ActionButton>
      </div>
    </div>
  );
}

export default ExecutionPhase;
