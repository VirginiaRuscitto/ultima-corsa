import { useState, useEffect } from "react";
import dayjs from "dayjs";

function useGameTimer(duration, playedAt) {
  const initialElapsed = playedAt ? dayjs().diff(dayjs(playedAt), "second") : 0;
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, duration - initialElapsed),
  );
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!playedAt || !active) return;

    const tick = () => {
      const elapsed = dayjs().diff(dayjs(playedAt), "second");
      setTimeLeft(Math.max(0, duration - elapsed));
    };

    tick();
    
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [playedAt, active]);

  function stop() {
    setActive(false);
  }

  return { timeLeft, expired: timeLeft === 0, stop };
}

export default useGameTimer;
