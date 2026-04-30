// MorseTree component — renders the SVG tree faithfully matching the reference image.

const MorseTreeStyles = {
  bg: 'oklch(0.97 0.005 80)',          // off-white warm
  bgGrad: 'oklch(0.96 0.005 80)',
  edge: 'oklch(0.78 0.005 80)',        // soft hairline
  edgeHi: 'oklch(0.20 0.01 80)',       // charcoal
  nodeFill: 'oklch(0.97 0.005 80)',    // empty (matches bg)
  nodeStroke: 'oklch(0.65 0.005 80)',
  nodeFillActive: 'oklch(0.20 0.01 80)',     // filled charcoal
  nodeStrokeActive: 'oklch(0.20 0.01 80)',
  nodeFillCurrent: 'oklch(0.20 0.01 80)',    // current = solid charcoal too (no orange in minimal palette)
  nodeStrokeCurrent: 'oklch(0.20 0.01 80)',
  letter: 'oklch(0.45 0.005 80)',
  letterDim: 'oklch(0.65 0.005 80)',
  letterActive: 'oklch(0.18 0.01 80)',
  letterCurrent: 'oklch(0.18 0.01 80)',
};

function Node({ node, state, onTap }) {
  // state: 'idle' | 'active' (on path) | 'current' (selected leaf)
  const s = MorseTreeStyles;
  const fill = state === 'current' ? s.nodeFillCurrent : state === 'active' ? s.nodeFillActive : s.nodeFill;
  const stroke = state === 'current' ? s.nodeStrokeCurrent : state === 'active' ? s.nodeStrokeActive : s.nodeStroke;
  const labelColor = state === 'current' ? s.letterCurrent : state === 'active' ? s.letterActive : s.letter;
  const glow = 'none';

  if (node.shape === 'antenna') {
    // simple antenna icon at root
    return (
      <g>
        <line x1={node.x} y1={node.y - 14} x2={node.x} y2={node.y + 14} stroke={s.nodeStroke} strokeWidth="1.4" />
        <line x1={node.x - 8} y1={node.y - 8} x2={node.x} y2={node.y - 14} stroke={s.nodeStroke} strokeWidth="1.4" />
        <line x1={node.x + 8} y1={node.y - 8} x2={node.x} y2={node.y - 14} stroke={s.nodeStroke} strokeWidth="1.4" />
        <circle cx={node.x} cy={node.y - 18} r="2.5" fill={s.nodeStroke} />
      </g>
    );
  }

  const tapHandler = onTap ? () => onTap(node.id) : undefined;
  const labelAnchor = node.labelAnchor || 'middle';
  // label x,y: small offset from node
  const lx = node.x + (node.lx ?? 0);
  const ly = node.y + (node.ly ?? -22);

  return (
    <g style={{ cursor: 'pointer', filter: glow, transition: 'filter 240ms' }} onClick={tapHandler}>
      {/* hit area */}
      <rect x={node.x - 18} y={node.y - 18} width="36" height="36" fill="transparent" />
      {node.shape === 'circle' ? (
        <circle cx={node.x} cy={node.y} r="11" fill={fill} stroke={stroke} strokeWidth="1.6"
                style={{ transition: 'fill 240ms, stroke 240ms' }} />
      ) : (
        <rect x={node.x - 12} y={node.y - 8} width="24" height="16" rx="2"
              fill={fill} stroke={stroke} strokeWidth="1.6"
              style={{ transition: 'fill 240ms, stroke 240ms' }} />
      )}
      <text x={lx} y={ly} fontSize="14" fontWeight="500" fontFamily="'JetBrains Mono', monospace"
            fill={labelColor} textAnchor={labelAnchor} dominantBaseline="middle"
            style={{ transition: 'fill 240ms', letterSpacing: '0.04em' }}>
        {node.letter}
      </text>
    </g>
  );
}

function Edge({ edge, active }) {
  const s = MorseTreeStyles;
  const { from, to } = edge;
  // Render as orthogonal path: vertical first then horizontal, or single straight if aligned
  let d;
  if (from.x === to.x || from.y === to.y) {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    // L-shape: vertical from parent then horizontal to child OR horizontal then vertical
    // Use vertical-first when child y is far from parent y; else horizontal-first
    const dy = Math.abs(to.y - from.y);
    const dx = Math.abs(to.x - from.x);
    if (dy > dx) {
      d = `M ${from.x} ${from.y} L ${from.x} ${to.y} L ${to.x} ${to.y}`;
    } else {
      d = `M ${from.x} ${from.y} L ${to.x} ${from.y} L ${to.x} ${to.y}`;
    }
  }
  return (
    <path d={d} fill="none"
          stroke={active ? s.edgeHi : s.edge}
          strokeWidth={active ? 2 : 1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'stroke 280ms, stroke-width 280ms',
          }} />
  );
}

function StarField() { return null; }

function MorseTree({ activePath, currentId, onTapNode }) {
  const activeSet = new Set(activePath || []);
  const activeEdges = new Set();
  if (activePath && activePath.length > 1) {
    for (let i = 1; i < activePath.length; i++) {
      activeEdges.add(activePath[i]);
    }
  }

  return (
    <svg viewBox="0 0 360 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block' }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={MorseTreeStyles.bg} />
          <stop offset="100%" stopColor={MorseTreeStyles.bgGrad} />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="360" height="600" fill="url(#bgGrad)" />
      <StarField />

      {/* Edges first (under nodes) */}
      {MORSE_EDGES.map((e, i) => (
        <Edge key={i} edge={e} active={activeEdges.has(e.childId)} />
      ))}

      {/* Nodes */}
      {MORSE_NODES.map(n => {
        let state = 'idle';
        if (n.id === currentId) state = 'current';
        else if (activeSet.has(n.id)) state = 'active';
        return <Node key={n.id} node={n} state={state} onTap={n.id !== 'root' ? onTapNode : undefined} />;
      })}

      {/* Header text removed for minimal style */}
    </svg>
  );
}

window.MorseTree = MorseTree;
window.MorseTreeStyles = MorseTreeStyles;
