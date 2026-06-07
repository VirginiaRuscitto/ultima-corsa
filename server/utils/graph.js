function buildGraph(connections) {
  //bidirezionale ovviamente
  const g = new Map();

  for (const c of connections) {
    if (!g.has(c.stationAId)) g.set(c.stationAId, []);
    if (!g.has(c.stationBId)) g.set(c.stationBId, []);

    g.get(c.stationAId).push({
      stationId: c.stationBId,
      lineId: c.lineId,
    });
    g.get(c.stationBId).push({
      stationId: c.stationAId,
      lineId: c.lineId,
    });
  }

  return g;
}

function allDistancesFrom(graph, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];

  while (queue.length) {
    const node = queue.shift();

    for (const edge of graph.get(node) || []) {
      const neighbor = edge.stationId;

      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node) + 1);
        queue.push(neighbor);
      }
    }
  }

  return dist;
}

function validateOrderedPath(connectionIds, connections, startId, endId) {
  if (!connectionIds || connectionIds.length < 1) return null;

  //la stessa tratta si può usare al massimo una volta
  if (new Set(connectionIds).size !== connectionIds.length) return null;

  //tutti gl id devono esistere anche nel grafo reale
  const connMap = new Map(connections.map((c) => [c.id, c]));
  for (const id of connectionIds) {
    if (!connMap.has(id)) return null;
  }

  const path = [];
  let current = startId;
  for (const connId of connectionIds) {
    const c = connMap.get(connId);

    if (c.stationAId === current) {
      path.push({ from: current, to: c.stationBId, connId });
      current = c.stationBId;
    } else if (c.stationBId === current) {
      path.push({ from: current, to: c.stationAId, connId });
      current = c.stationAId;
    } else {
      return null;
    }
  }

  if (current !== endId) return null;

  return path;
}

export default { buildGraph, allDistancesFrom, validateOrderedPath };
