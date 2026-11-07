// Builds the lesson path (NODES) and registers each unit's desk shift. Load after js/content/*.
const NODES = []; UNITS.forEach(u => { u.lessons.forEach(l => NODES.push({ ...l, unit: u, kind: 'lesson' })); NODES.push({ ...u.app, unit: u, kind: 'app' }); if (u.shift) { u.shift.who = u.mentor; SHIFTS[u.app.id] = u.shift; } });
const NODE = Object.fromEntries(NODES.map(n => [n.id, n]));
