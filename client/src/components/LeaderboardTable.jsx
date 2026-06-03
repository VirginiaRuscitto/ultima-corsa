function LeaderboardRow({ entry, isCurrentUser }) {
  return (
    <tr className={isCurrentUser ? "lb-current fw-bold" : ""}>
      <td className="text-center">{entry.bestScore}</td>
      <td>{entry.username}</td>
      <td className="text-end">{entry.date}</td>
    </tr>
  );
}

function LeaderboardTable({ data, user }) {
  return (
    <table className="lb-table">
      <thead>
        <tr>
          <th className="text-center">Punteggio</th>
          <th>Username</th>
          <th className="text-end">Data</th>
        </tr>
      </thead>

      <tbody>
        {data.map((entry) => (
          <LeaderboardRow
            key={entry.username}
            entry={entry}
            isCurrentUser={user?.username === entry.username}
          />
        ))}
      </tbody>
    </table>
  );
}

export default LeaderboardTable;