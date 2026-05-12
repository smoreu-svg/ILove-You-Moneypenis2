import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
//  MONEYPENIS VS DOUBLE ZERO — 11 missives
// ═══════════════════════════════════════════════════════════════════════════

const COLS = 8;
const ROWS = 12;
const SEQ = ['I', 'H', 'Y', 'D', 'E'];
const PRIDE = ['L', 'G', 'B', 'T', 'Q', 'i', 'A', 'P'];
const INTRUDERS = ['ENV', 'BILL'];

const C = {
  pink: '#e85a9b', pinkSoft: '#f9b6cc', teal: '#7ec6c1', tealSoft: '#aedce8',
  red: '#d92b2b', cream: '#f5efe6', ivory: '#f7eee2', white: '#ffffff',
  black: '#0a0a0a', midnight: '#0e1438', gold: '#c8a030', leaf: '#2d5a3f',
  pr1: '#e63946', pr2: '#f4a261', pr3: '#ffd166', pr4: '#06d6a0', pr5: '#118ab2', pr6: '#7c3a9c',
  pg1: '#000000', pg2: '#7b4b29', pg3: '#5bcefa', pg4: '#f5a9b8',
};

const LEVELS = [
  { n:1,  title:"Premier regard",   phrase:"Quelque chose commence — sans bruit.",       palette:'mono_pink',     speed:880, target:2,  intruders:0,    twins:false, tinted:false, pride:false },
  { n:2,  title:"Première lettre",  phrase:"Une enveloppe glisse sous la porte.",        palette:'classic',       speed:800, target:3,  intruders:0,    twins:false, tinted:false, pride:false },
  { n:3,  title:"Réponse",          phrase:"Je relis trois fois avant de répondre.",     palette:'white_teal',    speed:730, target:4,  intruders:0,    twins:false, tinted:false, pride:false },
  { n:4,  title:"Trouble",          phrase:"Quelque chose se trouble en moi.",           palette:'stripes',       speed:670, target:5,  intruders:0,    twins:false, tinted:false, pride:false },
  { n:5,  title:"Aveu",             phrase:"Je dois te dire — au risque de te perdre.",  palette:'split',         speed:610, target:6,  intruders:0.07, twins:false, tinted:false, pride:false },
  { n:6,  title:"Déclaration",      phrase:"Je t'aime. Voilà tout.",                     palette:'rose_ivory',    speed:550, target:7,  intruders:0.09, twins:false, tinted:false, pride:false },
  { n:7,  title:"Avertissement",    phrase:"Lecteur, ce qui suit te concerne aussi.",    palette:'rainbow_heart', speed:500, target:7,  intruders:0.10, twins:false, tinted:true,  pride:true  },
  { n:8,  title:"Mon amour",        phrase:"Moneypenis mon amour, mon cœur, mon ange.",  palette:'rainbow_brush', speed:450, target:8,  intruders:0.10, twins:true,  tinted:true,  pride:true  },
  { n:9,  title:"Manifeste",        phrase:"Je suis Moneypenis.",                        palette:'progress',      speed:410, target:9,  intruders:0.12, twins:true,  tinted:true,  pride:true  },
  { n:10, title:"Noël",             phrase:"Il neigeait — c'était la dernière.",         palette:'midnight',      speed:370, target:10, intruders:0.12, twins:true,  tinted:true,  pride:true  },
  { n:11, title:"Fin",              phrase:"Ton autre cœur.",                            palette:'inverted',      speed:330, target:12, intruders:0.10, twins:true,  tinted:true,  pride:true  },
];

const PALETTES = {
  mono_pink:     { bg:'#fdf6f0', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.pink, heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.pink, leaf:C.leaf, cellLine:'rgba(0,0,0,0.04)', boardBg:'#fdf6f0', bgType:'plain' },
  classic:       { bg:'#f0ede4', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.teal, heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.teal, leaf:C.leaf, cellLine:'rgba(0,0,0,0.05)', boardBg:'#f0ede4', bgType:'brush_teal' },
  white_teal:    { bg:'#6fbab5', text:'#fff',     stroke:C.black, strokeW:3,   I:C.white,heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.white,leaf:C.leaf, cellLine:'rgba(255,255,255,0.10)', boardBg:'#6fbab5', bgType:'plain' },
  stripes:       { bg:'#f0ede4', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.pink, heart:C.teal, you:C.red, dollar:C.pink, eggplant:C.teal, leaf:C.leaf, cellLine:'rgba(0,0,0,0.05)', boardBg:'#f0ede4', bgType:'stripes_pinkteal' },
  split:         { bg:'#fff', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.pink, heart:C.tealSoft, you:C.red, dollar:C.pink, eggplant:C.tealSoft, leaf:C.leaf, cellLine:'rgba(0,0,0,0.05)', boardBg:'transparent', bgType:'split' },
  rose_ivory:    { bg:'#f5e8df', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.pink, heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.pink, leaf:C.leaf, cellLine:'rgba(0,0,0,0.04)', boardBg:'#f5e8df', bgType:'plain' },
  rainbow_heart: { bg:'#f7eee2', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.pink, heart:'rainbow', you:C.red, dollar:C.pink, eggplant:C.pink, leaf:C.leaf, cellLine:'rgba(0,0,0,0.05)', boardBg:'#f7eee2', bgType:'plain', tints:[C.pink, C.teal] },
  rainbow_brush: { bg:'#fff', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.teal, heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.teal, leaf:C.leaf, cellLine:'rgba(0,0,0,0.06)', boardBg:'#fff', bgType:'rainbow_brush', tints:[C.pink, C.teal] },
  progress:      { bg:'#fff', text:'#1a1a1a', stroke:C.black, strokeW:3.5, I:C.teal, heart:C.pink, you:C.red, dollar:C.pink, eggplant:C.teal, leaf:C.leaf, cellLine:'rgba(0,0,0,0.06)', boardBg:'#fff', bgType:'progress_pride', tints:[C.pink, C.teal, C.pr3] },
  midnight:      { bg:'#0e1438', text:'#f0e8d8', stroke:'#f0e8d8', strokeW:2.5, I:C.tealSoft, heart:C.pinkSoft, you:'#ff6680', dollar:C.gold, eggplant:C.tealSoft, leaf:'#7ac09c', cellLine:'rgba(255,255,255,0.06)', boardBg:'#141a44', bgType:'plain', tints:[C.pinkSoft, C.tealSoft, C.gold] },
  inverted:      { bg:'#0a0a0a', text:'#fff', stroke:'#fff', strokeW:2.5, I:'#fff', heart:'#fff', you:'#fff', dollar:'#fff', eggplant:'#fff', leaf:'#fff', cellLine:'rgba(255,255,255,0.08)', boardBg:'#0a0a0a', bgType:'plain', tints:[C.white, C.pinkSoft, C.tealSoft] },
};

// ─── ELEMENT SVGs ───────────────────────────────────────────────────────────

const ElemI = ({ color, stroke, sw }) => (
  <svg viewBox="0 0 60 80" style={{display:'block',overflow:'visible'}}>
    <path d="M 4 4 L 56 4 L 56 22 L 38 22 L 38 58 L 56 58 L 56 76 L 4 76 L 4 58 L 22 58 L 22 22 L 4 22 Z"
      fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter"/>
  </svg>
);

const ElemHeart = ({ color, stroke, sw, rainbow, uid }) => (
  <svg viewBox="0 0 80 76" style={{display:'block',overflow:'visible'}}>
    <defs>
      <linearGradient id={`rb-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.pr1}/><stop offset="16%" stopColor={C.pr1}/>
        <stop offset="16%" stopColor={C.pr2}/><stop offset="33%" stopColor={C.pr2}/>
        <stop offset="33%" stopColor={C.pr3}/><stop offset="50%" stopColor={C.pr3}/>
        <stop offset="50%" stopColor={C.pr4}/><stop offset="66%" stopColor={C.pr4}/>
        <stop offset="66%" stopColor={C.pr5}/><stop offset="83%" stopColor={C.pr5}/>
        <stop offset="83%" stopColor={C.pr6}/><stop offset="100%" stopColor={C.pr6}/>
      </linearGradient>
    </defs>
    <path d="M 40 70 C 8 50 0 28 12 14 C 22 4 36 8 40 22 C 44 8 58 4 68 14 C 80 28 72 50 40 70 Z"
      fill={rainbow ? `url(#rb-${uid})` : color}
      stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
  </svg>
);

const ElemYou = ({ color, scale=1 }) => (
  <div style={{
    fontFamily:"'Pacifico', cursive",
    color,
    fontSize: `${160*scale}%`,
    lineHeight: 0.85,
    transform: 'rotate(-8deg)',
    textShadow: '0 0 3px white, 0 0 6px white, 0 0 9px white, 0 0 12px white',
    pointerEvents:'none',
    whiteSpace:'nowrap',
  }}>you</div>
);

const ElemDollar = ({ color, stroke, sw }) => (
  <svg viewBox="0 0 60 80" style={{display:'block',overflow:'visible'}}>
    <text x="30" y="65" textAnchor="middle"
      style={{fontFamily:"'Alfa Slab One', serif", fontSize:72, paintOrder:'stroke'}}
      fill={color} stroke={stroke} strokeWidth={sw*1.6} strokeLinejoin="round">$</text>
  </svg>
);

const ElemEggplant = ({ color, stroke, sw, leaf }) => (
  <svg viewBox="0 0 60 80" style={{display:'block',overflow:'visible'}}>
    <path d="M 28 22 Q 8 28 10 52 Q 12 76 32 76 Q 52 76 50 56 Q 48 30 38 24 Z"
      fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
    <path d="M 16 16 Q 20 4 28 12 Q 32 0 36 12 Q 44 4 44 16 Q 50 12 46 22 L 22 24 Q 14 22 16 16 Z"
      fill={leaf} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
  </svg>
);

const PrideLetter = ({ letter, color }) => (
  <div style={{
    fontFamily:"'Alfa Slab One', serif",
    color,
    fontSize:'175%',
    lineHeight:1,
    WebkitTextStroke:'1.5px #000',
  }}>{letter === 'P' ? '+' : letter === 'i' ? 'I' : letter}</div>
);

const ElemEnvelope = ({ color, stroke, sw }) => (
  <svg viewBox="0 0 70 50" style={{display:'block'}}>
    <rect x="4" y="6" width="62" height="38" fill={color} stroke={stroke} strokeWidth={sw}/>
    <path d="M 4 6 L 35 30 L 66 6" fill="none" stroke={stroke} strokeWidth={sw}/>
  </svg>
);

const ElemBill = ({ color, stroke, sw }) => (
  <svg viewBox="0 0 80 40" style={{display:'block'}}>
    <rect x="3" y="3" width="74" height="34" fill={color} stroke={stroke} strokeWidth={sw} rx="2"/>
    <circle cx="40" cy="20" r="9" fill="none" stroke={stroke} strokeWidth={sw*0.8}/>
    <text x="40" y="25" textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight="bold" fill={stroke}>$</text>
  </svg>
);

// ─── CELL CONTENT ───────────────────────────────────────────────────────────
function CellContent({ cell, palette, uid, smallY=false }) {
  if (!cell) return null;
  const p = palette;
  const stroke = p.stroke;
  const sw = p.strokeW;

  if (cell.s) {
    const colors = [C.pr1, C.pr2, C.pr3, C.pr4, C.pr5, C.pr6, C.pg3, C.pg4];
    const idx = PRIDE.indexOf(cell.e);
    return <div><PrideLetter letter={cell.e} color={colors[idx] || C.pr1}/></div>;
  }
  if (cell.e === 'ENV') return <div style={{width:'80%',opacity:0.85}}><ElemEnvelope color={cell.t || '#f5e8df'} stroke={stroke} sw={sw}/></div>;
  if (cell.e === 'BILL') return <div style={{width:'82%',opacity:0.85}}><ElemBill color={cell.t || '#a8c890'} stroke={stroke} sw={sw}/></div>;
  if (cell.e === 'I') return <div style={{width:'60%',height:'78%'}}><ElemI color={cell.t || p.I} stroke={stroke} sw={sw}/></div>;
  if (cell.e === 'H') return <div style={{width:'80%',height:'74%'}}><ElemHeart color={cell.t || (p.heart === 'rainbow' ? C.pink : p.heart)} stroke={stroke} sw={sw} rainbow={p.heart === 'rainbow' && !cell.t} uid={uid}/></div>;
  if (cell.e === 'Y') return <ElemYou color={cell.t || p.you} scale={smallY ? 0.6 : 1}/>;
  if (cell.e === 'D') return <div style={{width:'68%',height:'80%'}}><ElemDollar color={cell.t || p.dollar} stroke={stroke} sw={sw}/></div>;
  if (cell.e === 'E') return <div style={{width:'70%',height:'80%'}}><ElemEggplant color={cell.t || p.eggplant} stroke={stroke} sw={sw} leaf={p.leaf}/></div>;
  return null;
}

// ─── BACKGROUND PATTERNS ────────────────────────────────────────────────────
function BoardBackground({ bgType, w, h, seed }) {
  if (bgType === 'plain') return null;

  // Deterministic-ish pseudo-random based on seed for stability
  const rand = (i) => {
    const x = Math.sin((i+1) * (seed+1) * 9301) * 10000;
    return x - Math.floor(x);
  };

  if (bgType === 'brush_teal') {
    return (
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.50}} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {Array.from({length:14}).map((_,i)=>(
          <rect key={i} x={rand(i)*40-20} y={i*(h/14) + rand(i+5)*3}
            width={w+40} height={h/14 * (0.45 + rand(i+10)*0.45)}
            fill={i%2===0 ? C.teal : C.tealSoft} opacity={0.55 + rand(i+20)*0.30}/>
        ))}
      </svg>
    );
  }
  if (bgType === 'stripes_pinkteal') {
    return (
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.55}} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {Array.from({length:14}).map((_,i)=>(
          <rect key={i} x={rand(i)*40-20} y={i*(h/14) + rand(i+5)*3}
            width={w+40} height={h/14 * (0.50 + rand(i+10)*0.40)}
            fill={i%2===0 ? C.pink : C.teal} opacity={0.55 + rand(i+20)*0.25}/>
        ))}
      </svg>
    );
  }
  if (bgType === 'rainbow_brush') {
    const cols = [C.pr1, C.pr2, C.pr3, C.pr4, C.pr5, C.pr6];
    return (
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.50}} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {Array.from({length:12}).map((_,i)=>(
          <rect key={i} x={rand(i)*40-20} y={i*(h/12) + rand(i+5)*3}
            width={w+40} height={h/12 * (0.60 + rand(i+10)*0.30)}
            fill={cols[i%6]} opacity={0.60 + rand(i+20)*0.25}/>
        ))}
      </svg>
    );
  }
  if (bgType === 'progress_pride') {
    const cols = [C.pr1, C.pr2, C.pr3, C.pr4, C.pr5, C.pr6];
    return (
      <div style={{position:'absolute',inset:0,opacity:0.55}}>
        <div style={{position:'absolute',inset:0, background:`linear-gradient(180deg, ${cols.map((c,i)=>`${c} ${(i*100/6).toFixed(1)}% ${((i+1)*100/6).toFixed(1)}%`).join(', ')})`}}/>
        <svg style={{position:'absolute',inset:0,width:'45%',height:'100%'}} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
          <polygon points={`0,0 70,${h/2} 0,${h}`} fill="#fff" opacity="1"/>
          <polygon points={`0,0 56,${h/2} 0,${h}`} fill={C.pinkSoft} opacity="1"/>
          <polygon points={`0,0 42,${h/2} 0,${h}`} fill={C.pg3} opacity="1"/>
          <polygon points={`0,0 28,${h/2} 0,${h}`} fill={C.pg2} opacity="1"/>
          <polygon points={`0,0 14,${h/2} 0,${h}`} fill={C.pg1} opacity="1"/>
        </svg>
      </div>
    );
  }
  if (bgType === 'split') {
    return (
      <div style={{position:'absolute',inset:0, background:'linear-gradient(90deg, #f9b6cc 50%, #aedce8 50%)'}}/>
    );
  }
  return null;
}

// ─── MATCH DETECTION ────────────────────────────────────────────────────────
function findMatches(grid, level) {
  const m = new Set();
  const dirs = [[0,1],[1,0],[1,1],[-1,1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        let ok = true;
        let tint = null;
        for (let i = 0; i < 5; i++) {
          const nr = r + dr*i, nc = c + dc*i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { ok = false; break; }
          const cell = grid[nr][nc];
          if (!cell || cell.e !== SEQ[i] || cell.s) { ok = false; break; }
          if (level.tinted) {
            if (i === 0) tint = cell.t;
            else if (cell.t !== tint) { ok = false; break; }
          }
        }
        if (ok) {
          for (let i = 0; i < 5; i++) m.add(`${r + dr*i},${c + dc*i}`);
        }
      }
    }
  }
  return m;
}

function findPrideMatch(grid) {
  const m = new Set();
  const dirs = [[0,1],[1,0],[1,1],[-1,1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        let ok = true;
        for (let i = 0; i < 8; i++) {
          const nr = r + dr*i, nc = c + dc*i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { ok = false; break; }
          const cell = grid[nr][nc];
          if (!cell || !cell.s || cell.e !== PRIDE[i]) { ok = false; break; }
        }
        if (ok) {
          for (let i = 0; i < 8; i++) m.add(`${r + dr*i},${c + dc*i}`);
        }
      }
    }
  }
  return m;
}

function gravity(g) {
  const ng = Array.from({length: ROWS}, (_, r) => Array.from({length: COLS}, (_, c) => g[r][c]));
  for (let c = 0; c < COLS; c++) {
    const stack = [];
    for (let r = ROWS - 1; r >= 0; r--) if (ng[r][c]) stack.push(ng[r][c]);
    for (let r = ROWS - 1; r >= 0; r--) ng[r][c] = stack[ROWS - 1 - r] || null;
  }
  return ng;
}

function spawnCell(level, palette) {
  const r = Math.random();
  if (level.pride && r < 0.033) {
    const letter = PRIDE[Math.floor(Math.random() * 8)];
    return { e: letter, t: null, s: true };
  }
  if (r < 0.033 + level.intruders) {
    const intruder = INTRUDERS[Math.floor(Math.random() * INTRUDERS.length)];
    const intColor = intruder === 'ENV' ? '#f5e8df' : '#a8c890';
    return { e: intruder, t: intColor };
  }
  const e = SEQ[Math.floor(Math.random() * 5)];
  let t = null;
  if (level.tinted && palette.tints) {
    t = palette.tints[Math.floor(Math.random() * palette.tints.length)];
  }
  return { e, t };
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════════════════════════════
export default function MoneypenisGame() {
  const [screen, setScreen] = useState('title');
  const [levelIdx, setLevelIdx] = useState(0);
  const [grid, setGrid] = useState(() => Array.from({length: ROWS}, () => Array(COLS).fill(null)));
  const [piece, setPiece] = useState(null);
  const [next, setNext] = useState(null);
  const [score, setScore] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [matched, setMatched] = useState(new Set());
  const [paused, setPaused] = useState(false);
  const [combo, setCombo] = useState(0);
  const lockingRef = useRef(false);
  const stateRef = useRef({});

  const level = LEVELS[levelIdx];
  const palette = PALETTES[level.palette];
  stateRef.current = { grid, piece, paused, screen, level, palette, matched };

  const canPlace = (g, r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS && !g[r][c];
  const canPlacePiece = (g, p) => {
    if (!canPlace(g, p.row, p.col)) return false;
    if (p.twin) {
      const tr = p.row + p.twin.dr;
      const tc = p.col + p.twin.dc;
      if (!canPlace(g, tr, tc)) return false;
    }
    return true;
  };

  const makePiece = useCallback((cellData) => {
    const c = Math.floor(COLS / 2);
    const p = { ...cellData, row: 0, col: c };
    if (level.twins && Math.random() < 0.18 && !cellData.s && cellData.e !== 'ENV' && cellData.e !== 'BILL') {
      const twinData = spawnCell(level, palette);
      if (!twinData.s && twinData.e !== 'ENV' && twinData.e !== 'BILL') {
        p.twin = { e: twinData.e, t: twinData.t, dr: 0, dc: 1 };
        if (p.col + 1 >= COLS) p.col = COLS - 2;
      }
    }
    return p;
  }, [level, palette]);

  const lockPiece = useCallback((p) => {
    if (lockingRef.current) return;
    lockingRef.current = true;

    let g = grid.map(row => [...row]);
    g[p.row][p.col] = { e: p.e, t: p.t, s: p.s };
    if (p.twin) {
      const tr = p.row + p.twin.dr;
      const tc = p.col + p.twin.dc;
      if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
        g[tr][tc] = { e: p.twin.e, t: p.twin.t };
      }
    }
    g = gravity(g);

    let chainCount = 0;
    let totalScore = 0;

    const cascade = () => {
      const prideMatches = level.pride ? findPrideMatch(g) : new Set();
      if (prideMatches.size > 0) {
        for (const k of prideMatches) {
          const [r, c] = k.split(',').map(Number);
          g[r][c] = null;
        }
        totalScore += 10000;
        setScore(s => s + totalScore);
        setMatched(new Set());
        setGrid(g);
        setScreen('super');
        lockingRef.current = false;
        return;
      }

      const standardMatches = findMatches(g, level);
      if (standardMatches.size === 0) {
        setScore(s => s + totalScore);
        setMatched(new Set());
        setGrid(g);
        setCombo(chainCount);
        if (chainCount > 0) {
          setMatchesCount(mc => {
            const nm = mc + chainCount;
            if (nm >= level.target) {
              setTimeout(() => setScreen('levelDone'), 350);
            }
            return nm;
          });
        }
        const nxt = next;
        const np = makePiece(nxt || spawnCell(level, palette));
        if (!canPlacePiece(g, np)) {
          setScreen('gameOver');
          setPiece(null);
        } else {
          setPiece(np);
          setNext(spawnCell(level, palette));
        }
        lockingRef.current = false;
        return;
      }

      chainCount++;
      setMatched(new Set(standardMatches));
      setGrid([...g]);
      setTimeout(() => {
        for (const k of standardMatches) {
          const [r, c] = k.split(',').map(Number);
          g[r][c] = null;
        }
        totalScore += 500 * (standardMatches.size / 5) * chainCount;
        g = gravity(g);
        cascade();
      }, 420);
    };

    cascade();
  }, [grid, level, palette, next, makePiece]);

  // Tick
  useEffect(() => {
    if (screen !== 'play' || paused || matched.size > 0) return;
    const id = setInterval(() => {
      const s = stateRef.current;
      if (!s.piece || s.matched.size > 0 || lockingRef.current) return;
      const newP = { ...s.piece, row: s.piece.row + 1 };
      if (canPlacePiece(s.grid, newP)) {
        setPiece(newP);
      } else {
        lockPiece(s.piece);
      }
    }, level.speed);
    return () => clearInterval(id);
  }, [screen, paused, matched, level.speed, lockPiece]);

  // Controls
  const moveLeft = () => {
    const s = stateRef.current;
    if (s.screen !== 'play' || !s.piece || s.paused || s.matched.size > 0 || lockingRef.current) return;
    const np = { ...s.piece, col: s.piece.col - 1 };
    if (canPlacePiece(s.grid, np)) setPiece(np);
  };
  const moveRight = () => {
    const s = stateRef.current;
    if (s.screen !== 'play' || !s.piece || s.paused || s.matched.size > 0 || lockingRef.current) return;
    const np = { ...s.piece, col: s.piece.col + 1 };
    if (canPlacePiece(s.grid, np)) setPiece(np);
  };
  const softDrop = () => {
    const s = stateRef.current;
    if (s.screen !== 'play' || !s.piece || s.paused || s.matched.size > 0 || lockingRef.current) return;
    const np = { ...s.piece, row: s.piece.row + 1 };
    if (canPlacePiece(s.grid, np)) setPiece(np);
    else lockPiece(s.piece);
  };
  const hardDrop = () => {
    const s = stateRef.current;
    if (s.screen !== 'play' || !s.piece || s.paused || s.matched.size > 0 || lockingRef.current) return;
    let row = s.piece.row;
    while (canPlacePiece(s.grid, { ...s.piece, row: row + 1 })) row++;
    lockPiece({ ...s.piece, row });
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowLeft') moveLeft();
      else if (e.key === 'ArrowRight') moveRight();
      else if (e.key === 'ArrowDown') { e.preventDefault(); softDrop(); }
      else if (e.key === ' ') { e.preventDefault(); hardDrop(); }
      else if (e.key === 'p' || e.key === 'P') setPaused(p => !p);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Flow
  const startGame = () => {
    setLevelIdx(0);
    setScore(0);
    setScreen('intro');
  };
  const startLevel = () => {
    const lv = LEVELS[levelIdx];
    const pal = PALETTES[lv.palette];
    setGrid(Array.from({length: ROWS}, () => Array(COLS).fill(null)));
    setMatchesCount(0);
    setMatched(new Set());
    setCombo(0);
    lockingRef.current = false;
    const firstCell = spawnCell(lv, pal);
    const firstPiece = { ...firstCell, row: 0, col: Math.floor(COLS/2) };
    if (lv.twins && Math.random() < 0.18 && !firstCell.s && firstCell.e !== 'ENV' && firstCell.e !== 'BILL') {
      const tw = spawnCell(lv, pal);
      if (!tw.s && tw.e !== 'ENV' && tw.e !== 'BILL') {
        firstPiece.twin = { e: tw.e, t: tw.t, dr: 0, dc: 1 };
      }
    }
    setPiece(firstPiece);
    setNext(spawnCell(lv, pal));
    setScreen('play');
  };
  const nextLevel = () => {
    if (levelIdx >= LEVELS.length - 1) setScreen('final');
    else { setLevelIdx(i => i + 1); setScreen('intro'); }
  };
  const restart = () => { setLevelIdx(0); setScore(0); setScreen('title'); };
  const continueFromSuper = () => {
    if (levelIdx >= LEVELS.length - 1) setScreen('final');
    else { setLevelIdx(i => i + 1); setScreen('intro'); }
  };

  const displayGrid = useMemo(() => {
    const dg = grid.map(row => [...row]);
    if (piece && screen === 'play') {
      if (piece.row >= 0 && piece.row < ROWS && piece.col >= 0 && piece.col < COLS) {
        dg[piece.row][piece.col] = { e: piece.e, t: piece.t, s: piece.s, falling: true };
      }
      if (piece.twin) {
        const tr = piece.row + piece.twin.dr;
        const tc = piece.col + piece.twin.dc;
        if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
          dg[tr][tc] = { e: piece.twin.e, t: piece.twin.t, falling: true };
        }
      }
    }
    return dg;
  }, [grid, piece, screen]);

  const cellSize = 'clamp(28px, 10vw, 42px)';
  const bgIsDark = palette.bg === '#0a0a0a' || palette.bg === '#0e1438';

  return (
    <div style={{
      minHeight:'100vh', width:'100%',
      background: palette.bg,
      fontFamily:"'Libre Baskerville', 'Cormorant Garamond', serif",
      color: palette.text,
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'10px 6px 14px',
      WebkitTapHighlightColor:'transparent',
      transition:'background 0.6s ease, color 0.6s ease',
      position:'relative', overflow:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Oswald:wght@200;300;400&family=Alfa+Slab+One&family=Pacifico&display=swap');
        button { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; border: none; cursor: pointer; }
        button:active { transform: scale(0.96); }
        @keyframes flashCell { 0% { transform: scale(1); filter: brightness(1); } 35% { transform: scale(1.22); filter: brightness(1.5); } 100% { transform: scale(0); filter: brightness(2); opacity: 0; } }
        @keyframes glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.78; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rainbowShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        @keyframes confetti { 0% { transform: translateY(-20vh) rotate(0); opacity: 1; } 100% { transform: translateY(120vh) rotate(720deg); opacity: 0; } }
        .cell-falling { animation: glow 0.9s ease-in-out infinite; }
        .cell-matched { animation: flashCell 0.42s ease-out forwards; }
        .overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.5s ease-out; }
      `}</style>

      {/* HEADER */}
      {screen !== 'title' && (
        <div style={{textAlign:'center', marginBottom:6, zIndex:2}}>
          <div style={{fontFamily:"'Oswald', sans-serif", fontWeight:200, fontSize:8, letterSpacing:5, color:palette.text, opacity:0.5, textTransform:'uppercase'}}>
            Moneypenis · VS 00
          </div>
          <h1 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontWeight:700, fontSize:17, margin:'2px 0 0', lineHeight:1.1}}>
            Missive {level.n} · {level.title}
          </h1>
        </div>
      )}

      {/* SEQUENCE HINT */}
      {screen === 'play' && (
        <div style={{display:'flex', alignItems:'center', gap:3, marginBottom:6, zIndex:2}}>
          {SEQ.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CellContent cell={{e: s}} palette={palette} uid={`hint${i}`} smallY/>
              </div>
              {i < 4 && <span style={{fontSize:9, opacity:0.4}}>→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* STATS */}
      {screen === 'play' && (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', maxWidth:360, padding:'5px 12px', borderTop:`1px solid ${palette.text}30`, borderBottom:`1px solid ${palette.text}30`, marginBottom:8, zIndex:2}}>
          <Stat label="Score" value={Math.floor(score)}/>
          <Stat label="Lettres" value={`${matchesCount}/${level.target}`}/>
          <NextBox next={next} palette={palette}/>
        </div>
      )}

      {/* BOARD */}
      {screen === 'play' && (
        <div style={{
          position:'relative',
          background: palette.boardBg,
          border: `2px solid ${bgIsDark ? '#fff' : palette.text}`,
          padding: 2,
          boxShadow: bgIsDark ? '0 0 30px rgba(255,255,255,0.05)' : '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 2,
        }}>
          <BoardBackground bgType={palette.bgType} w={COLS*40} h={ROWS*40} seed={levelIdx}/>
          <div style={{
            display:'grid',
            gridTemplateColumns: `repeat(${COLS}, ${cellSize})`,
            gridTemplateRows: `repeat(${ROWS}, ${cellSize})`,
            position:'relative',
            zIndex:1,
          }}>
            {displayGrid.map((row, r) =>
              row.map((cell, c) => {
                const isMatched = matched.has(`${r},${c}`);
                return (
                  <div key={`${r}-${c}`} style={{
                    border: `1px solid ${palette.cellLine}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    position:'relative',
                    background: cell?.falling ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}>
                    {cell && (
                      <div className={isMatched ? 'cell-matched' : (cell.falling ? 'cell-falling' : '')}
                        style={{
                          width:'92%', height:'92%',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                        <CellContent cell={cell} palette={palette} uid={`${r}-${c}`} smallY/>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CONTROLS */}
      {screen === 'play' && (
        <div style={{marginTop:10, width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:5, zIndex:2}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5}}>
            <CtrlBtn onClick={moveLeft} palette={palette}>◁</CtrlBtn>
            <CtrlBtn onClick={softDrop} palette={palette}>▽</CtrlBtn>
            <CtrlBtn onClick={moveRight} palette={palette}>▷</CtrlBtn>
          </div>
          <CtrlBtn onClick={hardDrop} palette={palette} big>Déposer</CtrlBtn>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:2, fontSize:9, letterSpacing:2, opacity:0.5, fontFamily:"'Oswald', sans-serif", textTransform:'uppercase'}}>
            <span onClick={()=>setPaused(p=>!p)} style={{cursor:'pointer'}}>{paused ? '▶ Reprendre' : '⏸ Pause'}</span>
            <span>{combo > 1 ? `× ${combo} cascade` : ''}</span>
          </div>
        </div>
      )}

      {/* TITLE SCREEN */}
      {screen === 'title' && (
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', textAlign:'center', maxWidth:360, minHeight:'80vh'}}>
          <div style={{position:'relative', width:190, height:200, marginBottom:32}}>
            <div style={{position:'absolute', top:0, left:6, width:72, height:80}}><ElemI color={C.teal} stroke={C.black} sw={4}/></div>
            <div style={{position:'absolute', top:-2, right:6, width:96, height:92}}><ElemHeart color={C.pink} stroke={C.black} sw={4} uid="t1"/></div>
            <div style={{position:'absolute', top:62, left:62, zIndex:3, fontSize:30}}><ElemYou color={C.red}/></div>
            <div style={{position:'absolute', bottom:0, left:0, width:78, height:100}}><ElemDollar color={C.pink} stroke={C.black} sw={4}/></div>
            <div style={{position:'absolute', bottom:0, right:0, width:90, height:110}}><ElemEggplant color={C.teal} stroke={C.black} sw={4} leaf={C.leaf}/></div>
          </div>
          <div style={{fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:6, opacity:0.6, textTransform:'uppercase', marginBottom:6}}>11 missives</div>
          <h1 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:30, margin:0, marginBottom:4}}>Sir Moneypenis</h1>
          <h2 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontWeight:400, fontSize:20, margin:0, marginBottom:30, opacity:0.8}}>Vs Double Zero</h2>
          <p style={{fontSize:12, lineHeight:1.7, opacity:0.7, maxWidth:280, marginBottom:28}}>
            Aligne <em>I → ❤ → you → $ → 🍆</em> en horizontal, vertical ou diagonal — toujours dans cet ordre, de gauche à droite. 11 missives à traverser.
          </p>
          <button onClick={startGame} style={{
            background:C.black, color:'#fff', padding:'14px 40px',
            fontFamily:"'Oswald', sans-serif", fontSize:11, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
          }}>Commencer</button>
        </div>
      )}

      {/* LEVEL INTRO */}
      {screen === 'intro' && (
        <div className="overlay" style={{background: palette.bg, opacity:1}}>
          <div style={{textAlign:'center', padding:30, maxWidth:340, animation:'slideUp 0.6s ease-out'}}>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:5, opacity:0.6, textTransform:'uppercase', marginBottom:14, color:palette.text}}>Missive {level.n} sur 11</div>
            <h2 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:30, margin:0, marginBottom:22, color:palette.text}}>{level.title}</h2>
            <div style={{width:40, height:1, background:palette.text, opacity:0.3, margin:'0 auto 22px'}}/>
            <p style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:15, lineHeight:1.7, marginBottom:24, opacity:0.85, color:palette.text}}>« {level.phrase} »</p>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:3, opacity:0.5, textTransform:'uppercase', marginBottom:28, color:palette.text}}>
              Objectif · {level.target} alignements
              {level.tinted && ' · teinte'}
              {level.intruders > 0 && ' · intrus'}
              {level.twins && ' · jumelles'}
              {level.pride && ' · pride'}
            </div>
            <button onClick={startLevel} style={{
              background: palette.text, color: palette.bg,
              padding:'12px 36px', fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
            }}>Lire la missive</button>
          </div>
        </div>
      )}

      {/* LEVEL DONE */}
      {screen === 'levelDone' && (
        <div className="overlay" style={{background:palette.bg}}>
          <div style={{textAlign:'center', padding:30, maxWidth:320, animation:'slideUp 0.6s ease-out'}}>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:5, opacity:0.6, textTransform:'uppercase', marginBottom:14, color:palette.text}}>Fin de la missive {level.n}</div>
            <h2 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:26, margin:0, marginBottom:20, color:palette.text}}>{level.title}</h2>
            <div style={{width:30, height:1, background:palette.text, opacity:0.3, margin:'0 auto 22px'}}/>
            <div style={{fontFamily:"'Libre Baskerville', serif", fontSize:22, fontStyle:'italic', marginBottom:6, color:palette.text}}>{Math.floor(score)}</div>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:8, letterSpacing:3, opacity:0.5, textTransform:'uppercase', marginBottom:28, color:palette.text}}>Score cumulé</div>
            <button onClick={nextLevel} style={{
              background: palette.text, color: palette.bg,
              padding:'12px 36px', fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
            }}>{levelIdx >= LEVELS.length - 1 ? 'Voir la fin' : 'Missive suivante'}</button>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {screen === 'gameOver' && (
        <div className="overlay" style={{background:palette.bg}}>
          <div style={{textAlign:'center', padding:30, maxWidth:320, animation:'slideUp 0.6s ease-out'}}>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:5, opacity:0.6, textTransform:'uppercase', marginBottom:14, color:palette.text}}>Missive interrompue</div>
            <h2 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:26, margin:0, marginBottom:18, color:palette.text}}>Le silence</h2>
            <div style={{width:30, height:1, background:palette.text, opacity:0.3, margin:'0 auto 22px'}}/>
            <p style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:13, lineHeight:1.7, marginBottom:22, opacity:0.7, color:palette.text}}>
              La page s'est remplie avant la fin. Une réponse qui ne viendra pas.
            </p>
            <div style={{fontFamily:"'Libre Baskerville', serif", fontSize:18, fontStyle:'italic', marginBottom:4, color:palette.text}}>{Math.floor(score)}</div>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:8, letterSpacing:3, opacity:0.5, textTransform:'uppercase', marginBottom:24, color:palette.text}}>Missive {level.n} sur 11</div>
            <button onClick={restart} style={{
              background: palette.text, color: palette.bg,
              padding:'12px 36px', fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
            }}>Recommencer</button>
          </div>
        </div>
      )}

      {/* FINAL */}
      {screen === 'final' && (
        <div className="overlay" style={{background:'#0a0a0a', color:'#fff'}}>
          <div style={{textAlign:'center', padding:30, maxWidth:360, animation:'slideUp 1s ease-out'}}>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:6, color:'#888', textTransform:'uppercase', marginBottom:32}}>Fin</div>
            <p style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontWeight:400, fontSize:17, lineHeight:1.9, color:'#e8e0d0', marginBottom:36}}>
              Je t'aime à en accepter l'impossible, à imaginer que tu t'adresses à moi.<br/><br/>
              <span style={{color:C.pink}}>I love you Moneypenis</span>… voilà tout.
            </p>
            <div style={{width:30, height:1, background:'#444', margin:'0 auto 30px'}}/>
            <div style={{fontFamily:"'Libre Baskerville', serif", fontSize:26, fontStyle:'italic', color:'#fff', marginBottom:4}}>{Math.floor(score)}</div>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:3, color:'#888', textTransform:'uppercase', marginBottom:32}}>11 missives · Score final</div>
            <button onClick={restart} style={{
              background:'transparent', color:'#fff', border:'1px solid #fff',
              padding:'12px 36px', fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
            }}>Rejouer</button>
          </div>
        </div>
      )}

      {/* SUPER CHAMPION */}
      {screen === 'super' && (
        <div className="overlay" style={{background:'#0a0a0a', overflow:'hidden'}}>
          {Array.from({length:30}).map((_, i) => (
            <div key={i} style={{
              position:'absolute', top:'-5%', left:`${Math.random()*100}%`,
              width:8, height:16,
              background:[C.pr1, C.pr2, C.pr3, C.pr4, C.pr5, C.pr6][i%6],
              animation:`confetti ${2 + Math.random()*2}s linear ${Math.random()*1.5}s forwards`,
            }}/>
          ))}
          <div style={{textAlign:'center', padding:30, maxWidth:340, animation:'slideUp 0.6s ease-out', position:'relative', zIndex:2}}>
            <div style={{fontFamily:"'Oswald', sans-serif", fontSize:9, letterSpacing:6, color:'#aaa', textTransform:'uppercase', marginBottom:18}}>Très rare</div>
            <div style={{display:'flex', justifyContent:'center', gap:2, marginBottom:22, animation:'rainbowShift 3s linear infinite'}}>
              {['L','G','B','T','Q','I','A','+'].map((c, i)=>(
                <div key={i} style={{
                  fontFamily:"'Alfa Slab One', serif", fontSize:22,
                  color:[C.pr1, C.pr2, C.pr3, C.pr4, C.pr5, C.pr6, C.pg3, C.pg4][i],
                  WebkitTextStroke:'1px #000',
                }}>{c}</div>
              ))}
            </div>
            <h2 style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:26, color:'#fff', margin:0, marginBottom:16}}>Super Champion</h2>
            <p style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:13, lineHeight:1.7, color:'#ccc', marginBottom:24}}>
              Tu as aligné les huit. Un instant suspendu — bonus dix mille points.
            </p>
            <button onClick={continueFromSuper} style={{
              background:'transparent', color:'#fff', border:'1px solid #fff',
              padding:'12px 36px', fontFamily:"'Oswald', sans-serif", fontSize:10, letterSpacing:4, textTransform:'uppercase', fontWeight:300,
            }}>Poursuivre</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{textAlign:'center', flex:1}}>
      <div style={{fontFamily:"'Oswald', sans-serif", fontSize:8, letterSpacing:2, opacity:0.5, textTransform:'uppercase'}}>{label}</div>
      <div style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:15, fontWeight:700}}>{value}</div>
    </div>
  );
}

function NextBox({ next, palette }) {
  return (
    <div style={{textAlign:'center', flex:1}}>
      <div style={{fontFamily:"'Oswald', sans-serif", fontSize:8, letterSpacing:2, opacity:0.5, textTransform:'uppercase'}}>Suite</div>
      <div style={{width:22, height:22, margin:'2px auto 0', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {next && <CellContent cell={next} palette={palette} uid="next" smallY/>}
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick, palette, big }) {
  return (
    <button onClick={onClick} style={{
      padding: big ? '13px 0' : '11px 0',
      background: palette.text,
      color: palette.bg,
      fontFamily: big ? "'Oswald', sans-serif" : 'serif',
      fontSize: big ? 11 : 18,
      letterSpacing: big ? 4 : 0,
      fontWeight: big ? 300 : 400,
      textTransform: big ? 'uppercase' : 'none',
      transition:'all 0.15s',
    }}>{children}</button>
  );
}
