import { useState, useEffect } from "react";

function useGameTimer(duration) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const id = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  function start() {
    setExpired(false);
    setTimeLeft(duration);
  }

  function stop() {
    setTimeLeft(null);
  }

  return { timeLeft: timeLeft ?? 0, expired, start, stop };
}

export default useGameTimer;
