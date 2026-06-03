import { useEffect, useState, useContext } from "react";
import { Spinner } from "react-bootstrap";
import API from "../../API";
import LeaderboardTable from "../components/LeaderboardTable";
import MessageContext from "../MessageContext";

function LeaderboardPage({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setMessage } = useContext(MessageContext);

  useEffect(() => {
    setLoading(true);
    API.getLeaderboard()
      .then((res) => setData(res))
      .catch(() =>
        setMessage({
          type: "danger",
          msg: "Impossibile caricare la classifica",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-center">
        <Spinner animation="border" className="mb-3" />
        <p className="text-muted">Caricamento classifica...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>Nessun punteggio ancora registrato</h3>
        <p className="text-muted">
          Gioca una partita per comparire in classifica!
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center mb-4">Classifica</h1>

      <div className="lb-wrapper">
        <LeaderboardTable data={data} user={user} />
      </div>
    </>
  );
}

export default LeaderboardPage;
