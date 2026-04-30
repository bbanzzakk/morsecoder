// Morse code tree — coordinates faithfully matching the reference image
// Layout grid (viewBox 0 0 360 620):
//   Top row (y=70):   O  M  T  [root/antenna]  E  I  S  H
//   Row 2 (y=160):    Q  G                    U  V
//   Row 3 (y=230):       Z                       F
//   Row 4 (y=310):    Y  K     N           A  R  L
//   Row 5 (y=380):       C
//   Row 6 (y=460):    X  D                W  P
//   Row 7 (y=530):       B                   J
//
// Node shape: 'circle' = dot-leaf style, 'square' = dash-leaf style
// Each node carries label position offset (lx, ly) — matching where the letter sits in the image

const G = { // grid x positions
  col0: 40,
  col1: 90,
  col2: 140,
  col3: 175,   // center vertical (root / N / D / B axis)
  col4: 215,   // A column
  col5: 255,
  col6: 305,
  col7: 340,
};

const ROW = {
  top: 70,
  r2: 160,
  r3: 230,
  r4: 310,
  r5: 380,
  r6: 460,
  r7: 535,
};

// Each node: id, letter, code, x, y, shape, parent, branch, lx/ly = label offset
const MORSE_NODES = [
  // Root (antenna icon)
  { id: 'root', letter: '', code: '', x: G.col3, y: 24, shape: 'antenna' },

  // ── Top row ──
  // T is dash-child of root (left), E is dot-child of root (right)
  // Per image: O M T are joined by a horizontal line on the LEFT; E I S H on the RIGHT
  { id: 'T', letter: 'T', code: '−',    x: G.col2, y: ROW.top, shape: 'square', parent: 'root', branch: 'dash', lx: 0,  ly: -22 },
  { id: 'M', letter: 'M', code: '−−',   x: G.col1, y: ROW.top, shape: 'square', parent: 'T',    branch: 'dash', lx: 0,  ly: -22 },
  { id: 'O', letter: 'O', code: '−−−',  x: G.col0, y: ROW.top, shape: 'square', parent: 'M',    branch: 'dash', lx: 0,  ly: -22 },

  { id: 'E', letter: 'E', code: '·',    x: G.col4, y: ROW.top, shape: 'circle', parent: 'root', branch: 'dot',  lx: 0,  ly: -22 },
  { id: 'I', letter: 'I', code: '··',   x: G.col5, y: ROW.top, shape: 'circle', parent: 'E',    branch: 'dot',  lx: 0,  ly: -22 },
  { id: 'S', letter: 'S', code: '···',  x: G.col6, y: ROW.top, shape: 'circle', parent: 'I',    branch: 'dot',  lx: 0,  ly: -22 },
  { id: 'H', letter: 'H', code: '····', x: G.col7, y: ROW.top, shape: 'circle', parent: 'S',    branch: 'dot',  lx: 0,  ly: -22 },

  // ── Row 2 ──
  // Under M: G (dot-child of M), under G: Q (dash-child of G horizontal LEFT)
  { id: 'G', letter: 'G', code: '−−·',  x: G.col1, y: ROW.r2, shape: 'circle', parent: 'M', branch: 'dot',  lx: 18, ly: 5 },
  { id: 'Q', letter: 'Q', code: '−−·−', x: G.col0, y: ROW.r2, shape: 'square', parent: 'G', branch: 'dash', lx: -18, ly: 5, labelAnchor: 'end' },

  // Under I: U (dash-child of I) ; Under S: V (dash-child of S)
  { id: 'U', letter: 'U', code: '··−',  x: G.col5, y: ROW.r2, shape: 'square', parent: 'I', branch: 'dash', lx: -18, ly: 5, labelAnchor: 'end' },
  { id: 'V', letter: 'V', code: '···−', x: G.col6, y: ROW.r2, shape: 'square', parent: 'S', branch: 'dash', lx: 18, ly: 5 },

  // ── Row 3 ──
  // Under G: Z (dot-child)
  { id: 'Z', letter: 'Z', code: '−−··', x: G.col1, y: ROW.r3, shape: 'circle', parent: 'G', branch: 'dot',  lx: -18, ly: 5, labelAnchor: 'end' },
  // Under U: F (dot-child)
  { id: 'F', letter: 'F', code: '··−·', x: G.col5, y: ROW.r3, shape: 'circle', parent: 'U', branch: 'dot',  lx: 18, ly: 5 },

  // ── Row 4 ──
  // T dot-child = N (vertical drop from T at col2 down to row 4)
  { id: 'N', letter: 'N', code: '−·',   x: G.col2, y: ROW.r4, shape: 'circle', parent: 'T', branch: 'dot',  lx: 18, ly: 5 },
  // K (N dash-child, to the LEFT) and Y (K dash-child further left)
  { id: 'K', letter: 'K', code: '−·−',  x: G.col1, y: ROW.r4, shape: 'square', parent: 'N', branch: 'dash', lx: 0, ly: -22 },
  { id: 'Y', letter: 'Y', code: '−·−−', x: G.col0, y: ROW.r4, shape: 'square', parent: 'K', branch: 'dash', lx: 0, ly: -22 },

  // E dash-child = A — appears as ORANGE square right next to N column on right side
  { id: 'A', letter: 'A', code: '·−',   x: G.col4, y: ROW.r4, shape: 'square', parent: 'E', branch: 'dash', lx: -18, ly: 22, labelAnchor: 'end' },
  // A dot-child = R (right of A)
  { id: 'R', letter: 'R', code: '·−·',  x: G.col5, y: ROW.r4, shape: 'circle', parent: 'A', branch: 'dot',  lx: 0, ly: -22 },
  // R dot-child = L (right of R)
  { id: 'L', letter: 'L', code: '·−··', x: G.col6, y: ROW.r4, shape: 'circle', parent: 'R', branch: 'dot',  lx: 18, ly: 5 },

  // ── Row 5 ──
  // K dot-child = C
  { id: 'C', letter: 'C', code: '−·−·', x: G.col1, y: ROW.r5, shape: 'circle', parent: 'K', branch: 'dot',  lx: 18, ly: 5 },

  // ── Row 6 ──
  // N dot-child = D (vertical drop from N)
  { id: 'D', letter: 'D', code: '−··',  x: G.col2, y: ROW.r6, shape: 'circle', parent: 'N', branch: 'dot',  lx: 18, ly: 5 },
  // D dash-child = X (left of D)
  { id: 'X', letter: 'X', code: '−··−', x: G.col1, y: ROW.r6, shape: 'square', parent: 'D', branch: 'dash', lx: -18, ly: 5, labelAnchor: 'end' },

  // A dash-child = W (vertical drop from A)
  { id: 'W', letter: 'W', code: '·−−',  x: G.col4, y: ROW.r6, shape: 'square', parent: 'A', branch: 'dash', lx: -18, ly: 22, labelAnchor: 'end' },
  // W dot-child = P (right of W)
  { id: 'P', letter: 'P', code: '·−−·', x: G.col5, y: ROW.r6, shape: 'circle', parent: 'W', branch: 'dot',  lx: 18, ly: 5 },

  // ── Row 7 ──
  // D dot-child = B (vertical drop from D)
  { id: 'B', letter: 'B', code: '−···', x: G.col2, y: ROW.r7, shape: 'circle', parent: 'D', branch: 'dot',  lx: 18, ly: 5 },
  // W dash-child = J (vertical drop from W)
  { id: 'J', letter: 'J', code: '·−−−', x: G.col4, y: ROW.r7, shape: 'square', parent: 'W', branch: 'dash', lx: 18, ly: 5 },
];

const MORSE_EDGES = MORSE_NODES
  .filter(n => n.parent)
  .map(n => {
    const parent = MORSE_NODES.find(p => p.id === n.parent);
    return { from: parent, to: n, branch: n.branch, childId: n.id };
  });

function pathToLetter(letterId) {
  const path = [];
  let curr = MORSE_NODES.find(n => n.id === letterId);
  while (curr) {
    path.unshift(curr.id);
    curr = curr.parent ? MORSE_NODES.find(n => n.id === curr.parent) : null;
  }
  return path;
}

window.MORSE_NODES = MORSE_NODES;
window.MORSE_EDGES = MORSE_EDGES;
window.pathToLetter = pathToLetter;
