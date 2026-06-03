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

function tryBuildOrderedPath(connectionIds, connections, startId, endId) {
  if (!connectionIds || connectionIds.length < 1) return null;

  //la stessa tratta si può usare al massimo una volta
  if (new Set(connectionIds).size !== connectionIds.length) return null;

  //tutti gl id devono esistere anche nel grafo reale
  const connMap = new Map(connections.map((c) => [c.id, c]));
  for (const id of connectionIds) {
    if (!connMap.has(id)) return null;
  }

  //costruzione del sottografo sempre bidirezionale
  const adj = new Map();
  for (const connId of connectionIds) {
    const c = connMap.get(connId);
    const a = c.stationAId;
    const b = c.stationBId;

    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);

    const edgeAB = { to: b, connId, used: false, twin: null };
    const edgeBA = { to: a, connId, used: false, twin: null };
    edgeAB.twin = edgeBA;
    edgeBA.twin = edgeAB;

    adj.get(a).push(edgeAB);
    adj.get(b).push(edgeBA);
  }

  //dfs con backtracking
  const path = [];

  function dfs(currentId) {
    if (path.length === connectionIds.length) {
      return currentId === endId;
    }

    for (const edge of adj.get(currentId) || []) {
      if (edge.used) continue;

      edge.used = true;
      edge.twin.used = true;
      path.push({ connId: edge.connId, from: currentId, to: edge.to });

      if (dfs(edge.to)) return true;

      path.pop();
      edge.used = false;
      edge.twin.used = false;
    }
    return false;
  }
  return dfs(startId) ? path : null;
}

export default { buildGraph, allDistancesFrom, tryBuildOrderedPath };
