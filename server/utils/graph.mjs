//TODO vedere se per il frontend i nomi delle linee devo metterli qui o dopo

function buildGraph(connections) { //bidirezionale ovviamente
    const g = new Map();

    for (const c of connections) {
        if (!g.has(c.stationAId)) g.set(c.stationAId, []);
        if (!g.has(c.stationBId)) g.set(c.stationBId, []);

        g.get(c.stationAId).push({
        stationId: c.stationBId,
        lineId: c.lineId
        });
        g.get(c.stationBId).push({
        stationId: c.stationAId,
        lineId: c.lineId
        });
    }

    return g;
}

function bfsDistance(graph, start, target) {
    if (start === target) return 0;

    const visited = new Set([start]);
    const queue = [[start, 0]];

    while (queue.length) {
        const [node, dist] = queue.shift();

        for (const edge of (graph.get(node) || [])) {
        const neighbor = edge.stationId;

        if (neighbor === target)
            return dist + 1;

        if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([neighbor, dist + 1]);
        }
        }
    }

    return -1;
}

function allDistancesFrom(graph, start) {
    const dist = new Map([[start, 0]]);
    const queue = [start];

    while (queue.length) {
        const node = queue.shift();

        for (const edge of (graph.get(node) || [])) {
        const neighbor = edge.stationId;

        if (!dist.has(neighbor)) {
            dist.set(neighbor, dist.get(node) + 1);
            queue.push(neighbor);
        }
        }
    }

    return dist;
}

function validateRoute(connectionIds, connections, startId, endId) {
    if (!connectionIds?.length) return false;

    //ogni tratta deve essere unica
    const unique = new Set(connectionIds);
        if (unique.size !== connectionIds.length) {
            return false;
        }

    const connMap = new Map(connections.map(c => [c.id, c]));

    const g = new Map();
    for (const id of connectionIds) {
        const c = connMap.get(id);
        if (!c) return false;

        const a = c.stationAId;
        const b = c.stationBId;

        if (!g.has(a)) g.set(a, new Set());
        if (!g.has(b)) g.set(b, new Set());

        g.get(a).add(b);
        g.get(b).add(a);
    }

    if (!g.has(startId) || !g.has(endId)) return false;
    
    //controllo struttura lineare
    for (const [node, neighbors] of g.entries()) {
        const deg = neighbors.size;

        if (node === startId || node === endId) {
            if (deg !== 1) return false;
        } else {
            if (deg !== 2) return false;
        }
    }

    //bfs per verificare che sia tutto connesso
    const visited = new Set();
    const queue = [startId];
    visited.add(startId);

    while (queue.length) {
        const node = queue.shift();

        for (const x of g.get(node) || []) {
            if (!visited.has(x)) {
                visited.add(x);
                queue.push(x);
            }
        }
    }
    
    if (visited.size !== g.size) return false;
    if (!visited.has(endId)) return false;

    return true;
}

export default {buildGraph, bfsDistance, allDistancesFrom, validateRoute};