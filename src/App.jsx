import { useState, useRef, useEffect } from "react";

// ─── MAHJONG TILE SVG COMPONENT ───────────────────────────────────────────────
// Clean, consistent SVG tiles. Ivory face, coloured artwork, English labels.
// All 34 tile types share identical dimensions and border styling.

function Tile({ suit, n, size = 44 }) {
  const W = size;
  const H = Math.round(size * 1.48);
  const R = size * 0.1;   // corner radius
  const shadow = "drop-shadow(0 2px 5px rgba(0,0,0,0.55))";

  // Colours per suit
  const C = {
    man:"#C62828", pin:"#1565C0", bam:"#2E7D32",
    wind:"#4527A0", dragon_R:"#C62828", dragon_G:"#2E7D32", dragon_W:"#455A64",
    flower:"#AD1457"
  };

  // ── Shared tile shell ──────────────────────────────────────────────────────
  // Bevel: light top-left edge, dark bottom-right for 3D feel
  const Shell = ({ col, children }) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{display:"inline-block",verticalAlign:"middle",filter:shadow}}>
      {/* Shadow base */}
      <rect x={1} y={2} width={W-2} height={H-2} rx={R+1} fill="rgba(0,0,0,0.3)"/>
      {/* Bottom-right dark bevel */}
      <rect x={1} y={1} width={W-2} height={H-2} rx={R} fill="#B8A898"/>
      {/* Top-left light bevel */}
      <rect x={1} y={1} width={W-2} height={(H-2)*0.55} rx={R} fill="#EDE0CC"/>
      {/* Main face */}
      <rect x={W*0.07} y={H*0.05} width={W*0.86} height={H*0.9} rx={R*0.7} fill="#F5EDD8"/>
      {/* Subtle inner shadow */}
      <rect x={W*0.07} y={H*0.05} width={W*0.86} height={H*0.9} rx={R*0.7}
        fill="none" stroke={col} strokeWidth={size*0.02} strokeOpacity="0.15"/>
      {children}
    </svg>
  );

  // ── Circle (Dot) pip layouts ───────────────────────────────────────────────
  const pipLayouts = {
    1:[[.5,.5]],
    2:[[.5,.28],[.5,.72]],
    3:[[.5,.21],[.5,.5],[.5,.79]],
    4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],
    5:[[.28,.21],[.72,.21],[.5,.5],[.28,.79],[.72,.79]],
    6:[[.28,.2],[.72,.2],[.28,.5],[.72,.5],[.28,.8],[.72,.8]],
    7:[[.28,.18],[.72,.18],[.28,.47],[.72,.47],[.5,.32],[.28,.77],[.72,.77]],
    8:[[.25,.16],[.5,.16],[.75,.16],[.25,.44],[.75,.44],[.25,.72],[.5,.72],[.75,.72]],
    9:[[.22,.16],[.5,.16],[.78,.16],[.22,.44],[.5,.44],[.78,.44],[.22,.72],[.5,.72],[.78,.72]],
  };

  // ── CIRCLES (Dots) ─────────────────────────────────────────────────────────
  if (suit === "pin") {
    const col = C.pin;
    const pips = pipLayouts[n] || [];
    const fx = W*0.1, fy = H*0.07;
    const fw = W*0.8, fh = H*0.79;
    const r = n >= 8 ? fw*0.13 : n >= 6 ? fw*0.14 : n >= 4 ? fw*0.15 : fw*0.17;
    return (
      <Shell col={col}>
        {/* Number label top-left */}
        <text x={W*0.17} y={H*0.095} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.19} fontWeight="900" fontFamily="Arial,sans-serif">{n}</text>
        {/* Pips */}
        {pips.map(([px,py],i) => (
          <g key={i}>
            <circle cx={fx+px*fw} cy={fy+py*fh} r={r} fill={i===4&&n===5?"#C62828":col}/>
            <circle cx={fx+px*fw-r*0.28} cy={fy+py*fh-r*0.32} r={r*0.35} fill="rgba(255,255,255,0.4)"/>
          </g>
        ))}
        {/* "DOT" label bottom */}
        <text x={W*0.5} y={H*0.935} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.14} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.8" opacity="0.7">DOT</text>
      </Shell>
    );
  }

  // ── BAMBOO ─────────────────────────────────────────────────────────────────
  if (suit === "bam") {
    const col = C.bam;
    // Stalk grid positions
    const stalkLayouts = {
      1:[[.5,.5]], 2:[[.32,.5],[.68,.5]], 3:[[.5,.26],[.5,.5],[.5,.74]],
      4:[[.32,.26],[.68,.26],[.32,.74],[.68,.74]],
      5:[[.32,.18],[.68,.18],[.5,.5],[.32,.82],[.68,.82]],
      6:[[.32,.18],[.68,.18],[.32,.5],[.68,.5],[.32,.82],[.68,.82]],
      7:[[.5,.12],[.32,.32],[.68,.32],[.32,.55],[.68,.55],[.32,.78],[.68,.78]],
      8:[[.32,.12],[.68,.12],[.32,.35],[.68,.35],[.32,.58],[.68,.58],[.32,.81],[.68,.81]],
      9:[[.2,.12],[.5,.12],[.8,.12],[.2,.43],[.5,.43],[.8,.43],[.2,.74],[.5,.74],[.8,.74]],
    };
    const pos = stalkLayouts[n] || [];
    const fx = W*0.1, fy = H*0.1;
    const fw = W*0.8, fh = H*0.74;
    const sw = n >= 7 ? fw*0.18 : fw*0.22;
    const sh = n >= 7 ? fh*0.17 : fh*0.22;
    return (
      <Shell col={col}>
        <text x={W*0.17} y={H*0.095} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.19} fontWeight="900" fontFamily="Arial,sans-serif">{n}</text>
        {pos.map(([px,py],i) => {
          const cx = fx+px*fw, cy = fy+py*fh;
          const stalkCol = i===2&&n===5?"#C62828":col;
          return (
            <g key={i}>
              <rect x={cx-sw/2} y={cy-sh/2} width={sw} height={sh} rx={sw*0.38} fill={stalkCol}/>
              {/* Joint ring */}
              <rect x={cx-sw/2-0.5} y={cy-sh*0.06} width={sw+1} height={sh*0.18}
                rx={sw*0.3} fill="rgba(0,0,0,0.18)"/>
              {/* Highlight */}
              <rect x={cx-sw*0.3} y={cy-sh*0.35} width={sw*0.22} height={sh*0.45}
                rx={sw*0.12} fill="rgba(255,255,255,0.35)"/>
            </g>
          );
        })}
        <text x={W*0.5} y={H*0.935} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.14} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.8" opacity="0.7">BAM</text>
      </Shell>
    );
  }

  // ── CHARACTERS ─────────────────────────────────────────────────────────────
  if (suit === "man") {
    const col = C.man;
    const nums = ["一","二","三","四","五","六","七","八","九"];
    return (
      <Shell col={col}>
        {/* English number top */}
        <text x={W*0.5} y={H*0.26} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.45} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif"
          letterSpacing="-1">{n}</text>
        {/* CHR label */}
        <text x={W*0.5} y={H*0.935} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.14} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.8" opacity="0.7">CHR</text>
        {/* Decorative divider line */}
        <line x1={W*0.15} y1={H*0.43} x2={W*0.85} y2={H*0.43}
          stroke={col} strokeWidth={size*0.02} strokeOpacity="0.2"/>
        {/* Chinese character below divider — decorative */}
        <text x={W*0.5} y={H*0.67} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.3} fontWeight="700" opacity="0.55">{nums[n-1]}</text>
      </Shell>
    );
  }

  // ── WINDS ──────────────────────────────────────────────────────────────────
  if (suit === "wind") {
    const configs = {
      E:{ col:C.wind,    bg:"#EDE7F6", letter:"E", full:"EAST",  char:"東" },
      S:{ col:"#0277BD", bg:"#E1F5FE", letter:"S", full:"SOUTH", char:"南" },
      W:{ col:"#4E342E", bg:"#EFEBE9", letter:"W", full:"WEST",  char:"西" },
      N:{ col:"#1B5E20", bg:"#E8F5E9", letter:"N", full:"NORTH", char:"北" },
    };
    const cfg = configs[n] || configs.E;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{display:"inline-block",verticalAlign:"middle",filter:shadow}}>
        <rect x={1} y={2} width={W-2} height={H-2} rx={R+1} fill="rgba(0,0,0,0.3)"/>
        <rect x={1} y={1} width={W-2} height={H-2} rx={R} fill="#B8A898"/>
        <rect x={1} y={1} width={W-2} height={(H-2)*0.55} rx={R} fill="#EDE0CC"/>
        <rect x={W*0.07} y={H*0.05} width={W*0.86} height={H*0.9} rx={R*0.7} fill={cfg.bg}/>
        {/* Coloured band */}
        <rect x={W*0.07} y={H*0.22} width={W*0.86} height={H*0.52} rx={0} fill={cfg.col} opacity="0.1"/>
        {/* Large letter */}
        <text x={W*0.5} y={H*0.46} textAnchor="middle" dominantBaseline="middle"
          fill={cfg.col} fontSize={size*0.52} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">{cfg.letter}</text>
        {/* Full name */}
        <text x={W*0.5} y={H*0.78} textAnchor="middle" dominantBaseline="middle"
          fill={cfg.col} fontSize={size*0.14} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.5">{cfg.full}</text>
        {/* WIND label */}
        <text x={W*0.5} y={H*0.935} textAnchor="middle" dominantBaseline="middle"
          fill={cfg.col} fontSize={size*0.13} fontWeight="700" fontFamily="Arial,sans-serif"
          opacity="0.6">WIND</text>
      </svg>
    );
  }

  // ── DRAGONS ────────────────────────────────────────────────────────────────
  if (suit === "dragon") {
    const configs = {
      R:{ col:C.dragon_R, bg:"#FFEBEE", label:"RED",   symbol:"中", symCol:"#C62828" },
      G:{ col:C.dragon_G, bg:"#E8F5E9", label:"GREEN", symbol:"發", symCol:"#2E7D32" },
      W:{ col:C.dragon_W, bg:"#ECEFF1", label:"WHITE", symbol:"□", symCol:"#455A64" },
    };
    const cfg = configs[n] || configs.R;
    const isW = n === "W";
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{display:"inline-block",verticalAlign:"middle",filter:shadow}}>
        <rect x={1} y={2} width={W-2} height={H-2} rx={R+1} fill="rgba(0,0,0,0.3)"/>
        <rect x={1} y={1} width={W-2} height={H-2} rx={R} fill="#B8A898"/>
        <rect x={1} y={1} width={W-2} height={(H-2)*0.55} rx={R} fill="#EDE0CC"/>
        <rect x={W*0.07} y={H*0.05} width={W*0.86} height={H*0.9} rx={R*0.7} fill={cfg.bg}/>
        {/* Coloured top stripe */}
        <rect x={W*0.07} y={H*0.05} width={W*0.86} height={H*0.14} rx={R*0.7} fill={cfg.col}/>
        {/* Label in stripe */}
        <text x={W*0.5} y={H*0.12} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={size*0.15} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.5">{cfg.label}</text>
        {/* Symbol - large */}
        {isW ? (
          <rect x={W*0.2} y={H*0.26} width={W*0.6} height={H*0.45}
            rx={size*0.06} fill="none" stroke={cfg.symCol} strokeWidth={size*0.06}/>
        ) : (
          <text x={W*0.5} y={H*0.54} textAnchor="middle" dominantBaseline="middle"
            fill={cfg.symCol} fontSize={size*0.5} fontWeight="900">{cfg.symbol}</text>
        )}
        {/* DRAGON label */}
        <text x={W*0.5} y={H*0.935} textAnchor="middle" dominantBaseline="middle"
          fill={cfg.col} fontSize={size*0.13} fontWeight="700" fontFamily="Arial,sans-serif"
          opacity="0.7">DRAGON</text>
      </svg>
    );
  }

  // ── FLOWERS ────────────────────────────────────────────────────────────────
  if (suit === "flower") {
    const col = C.flower;
    const emojis = ["🌸","🌺","🌼","🌻","🍀","🌿","🎋","🌱"];
    const e = typeof n === "number" ? emojis[(n-1)%8] : "🌸";
    return (
      <Shell col={col}>
        <text x={W*0.5} y={H*0.46} textAnchor="middle" dominantBaseline="middle"
          fontSize={size*0.38}>{e}</text>
        <text x={W*0.5} y={H*0.78} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.14} fontWeight="800" fontFamily="Arial,sans-serif"
          letterSpacing="0.5">FLOWER</text>
        {typeof n==="number"&&(
          <text x={W*0.5} y={H*0.93} textAnchor="middle" dominantBaseline="middle"
            fill={col} fontSize={size*0.13} fontFamily="Arial,sans-serif" opacity="0.55">#{n}</text>
        )}
      </Shell>
    );
  }

  // ── FACE DOWN ──────────────────────────────────────────────────────────────
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{display:"inline-block",verticalAlign:"middle",filter:shadow}}>
      <rect x={1} y={2} width={W-2} height={H-2} rx={R+1} fill="rgba(0,0,0,0.3)"/>
      <rect x={1} y={1} width={W-2} height={H-2} rx={R} fill="#1A237E"/>
      {/* Diamond cross-hatch pattern */}
      {[0.3,0.5,0.7].flatMap(fy=>[0.3,0.5,0.7].map(fx=>(
        <circle key={`${fx}${fy}`} cx={fx*W} cy={fy*H} r={size*0.055} fill="#3949AB" opacity="0.6"/>
      )))}
      <rect x={W*0.1} y={H*0.07} width={W*0.8} height={H*0.86} rx={R*0.6}
        fill="none" stroke="#5C6BC0" strokeWidth={size*0.04}/>
    </svg>
  );
}

// SUIT_COLORS referenced in scoring wizard chip colours
const SUIT_COLORS = {
  man:"#C62828", pin:"#1565C0", bam:"#2E7D32",
  wind:"#4527A0", dragon:"#E65100", flower:"#AD1457"
};

function MeldGroup({ tiles, label, tileSize, accentColor }) {
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
    <div style={{display:"flex",gap:tileSize*.05,flexWrap:"wrap",justifyContent:"center"}}>
      {tiles.map((t,i)=><Tile key={i} suit={t.suit} n={t.n} size={tileSize}/>)}
    </div>
    {label&&<div style={{fontSize:Math.max(9,tileSize*.22),color:accentColor||"rgba(200,180,160,0.6)",letterSpacing:.6,textTransform:"uppercase",fontWeight:700,background:"rgba(0,0,0,0.25)",borderRadius:4,padding:"1px 6px"}}>{label}</div>}
  </div>;
}

function HandDiagram({ groups, accentColor, tileSize=42 }) {
  if(!groups||groups.length===0) return null;
  return <div style={{padding:"16px 14px 12px",background:"#0D0B08",borderRadius:12,marginTop:10,overflowX:"auto"}}>
    <div style={{display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap",minWidth:"min-content"}}>
      {groups.map((g,i)=><MeldGroup key={i} tiles={g.tiles} label={g.label} tileSize={tileSize} accentColor={accentColor}/>)}
    </div>
  </div>;
}

// ─── DUBAI SCORING DATA ───────────────────────────────────────────────────────
// All points from the Dubai Mah Jong 2025 rulebook + Scoring Booklet

const DXB_SCORE = {
  // STEP 1 — always first
  mahjong: 5,
  closing: 5,
  // STEP 2 — winning tile type
  east_dealer: 1,
  self_pick: 5,
  self_pick_flower_wall: 10,
  concealed_discard: 10,
  concealed_self_pick: 15,
  fully_exposed_discard: 10,
  fully_exposed_self_pick: 15,
  win_within_7: 50,
  seabed: 20,
  earthly: 90,
  heavenly: 100,
  // STEP 3 — flowers
  per_flower: 1,
  flower_of_seat: 1,   // bonus +1 per matching seat flower
  mixed_bouquet: 5,
  pure_bouquet: 10,
  seven_flowers: 20,
  eight_flowers: 40,
  no_flowers: 1,
  no_honours: 1,
  no_flowers_no_honours: 5,
  no_flowers_no_honours_all_sheung: 15,
  // STEP 4 — pair/eyes
  good_eye: 2,
  calling_by_pairs: 2,
  true_single_wait: 2,
  // STEP 5 — suit hands
  two_suit: 8,
  two_suit_no_honour_no_flower: 15,
  semi_pure: 30,
  pure_suit: 90,
  all_five_suits: 10,
  // STEP 6 — sheung hands
  all_sheung: 5,
  all_sheung_no_honours_no_flowers: 15,
  step_up: 5,
  all_step_up: 20,
  all_step_up_same_suit: 90,
  // STEP 7 — dragon runs
  mix_dragon_exposed: 8,
  mix_dragon_concealed: 10,
  pure_dragon_exposed: 15,
  pure_dragon_concealed: 20,
  // STEP 8 — brothers/sisters
  brother_2: 5, brother_3: 15, brother_4: 30,
  sister_2: 5, sister_3: 15, sister_4: 30, sister_5: 50,
  // STEP 9 — pong hand
  all_pong: 25,
  pong_wind: 1, pong_wind_seat: 1, pong_wind_round: 1,
  little_3_winds: 15, big_3_winds: 30, little_4_winds: 60, big_4_winds: 80,
  pong_dragon: 2, little_dragon: 20, big_dragon: 40,
  sister_pong_2: 5, sister_pong_3: 15,
  uncle_pong_2: 5, uncle_pong_3: 15, uncle_pong_4: 30, uncle_pong_5: 60, uncle_pong_6: 80,
  // STEP 10 — concealed pongs
  concealed_pong_2: 5, concealed_pong_3: 15, concealed_pong_4: 30,
  concealed_pong_5: 80, concealed_pong_5_self_no_gong: 100,
  // STEP 11 — gong
  open_gong: 1, concealed_gong: 1,
  rob_gong: 10,
  self_draw_gong: 30,
  four_in_2: 5, four_in_3: 15, four_in_4: 20,
  // STEP 12 — terminals
  no_terminals: 5, no_terminals_no_honours: 8,
  all_terminals_with_honours: 20, all_terminals_no_honours: 40,
  terminal_pong_pure: 5, terminal_pong_mix_2: 20,
  terminal_sheung_pure: 5, terminal_sheung_mix_2: 20,
  // STEP 13 — special hands
  nico_nico: 40, nico_nico_1gong: 10, nico_nico_2gong: 25,
  orphan_13: 90, orphan_16: 50, orphan_16_19: 10,
  jade: 20, ruby: 20, diamond: 20,
  // PENALTIES
  false_mahjong: 25,
  chasing_wind_dragon: 5, chasing_suit: 10,
};

// ─── DUBAI SCORING WIZARD QUESTIONS ──────────────────────────────────────────
// Redesigned: fewer steps, grouped logically, each option has tiles shown inline

const DXB_QUESTIONS = [

  // ── STEP 1: Win type + concealed in one question ──
  { id:"win_type", cat:"🏆 How did you win?",
    q:"Pick your win type",
    hint:"This determines your base points",
    type:"single",
    opts:[
      { id:"discard",          label:"Discard Win",          sub:"Only discarder pays",         emoji:"♟️",
        tiles:[{suit:"bam",n:5}] },
      { id:"self_pick",        label:"Self Pick",            sub:"All 3 others pay",            emoji:"🤲",
        tiles:[{suit:"pin",n:3}] },
      { id:"self_pick_flower", label:"Self Pick (Flower Wall)", sub:"+10 pts · All 3 pay",    emoji:"🌸",
        tiles:[{suit:"flower",n:1}] },
      { id:"seabed",           label:"Last Tile from Wall",  sub:"Seabed +20 pts",             emoji:"🌊",
        tiles:[{suit:"man",n:9}] },
      { id:"within_7",         label:"Win within 7 tiles",   sub:"+50 pts",                    emoji:"⚡",
        tiles:[] },
      { id:"earthly",          label:"Earthly Hand",         sub:"First East discard · 90 pts", emoji:"🌍",
        tiles:[] },
      { id:"heavenly",         label:"Heavenly Hand",        sub:"Dealer wins on deal · 100 pts", emoji:"☁️",
        tiles:[] },
    ]
  },

  // ── STEP 2: Concealed / Exposed ──
  { id:"exposed", cat:"🙈 Hand visibility",
    q:"Was your hand concealed or exposed?",
    hint:"Concealed = no tiles shown to others (except flowers & gongs)",
    type:"single",
    skip:(ans)=>["earthly","heavenly","within_7"].includes(ans.win_type),
    opts:[
      { id:"normal",         label:"Normal",          sub:"Mix of shown & hidden tiles", emoji:"🃏",
        tiles:[{suit:"bam",n:2},{suit:"back",n:""},{suit:"back",n:""}] },
      { id:"fully_concealed",label:"Fully Concealed", sub:"+10 pts (discard) / +15 pts (self pick)", emoji:"🙈",
        tiles:[{suit:"back",n:""},{suit:"back",n:""},{suit:"back",n:""}] },
      { id:"fully_exposed",  label:"Fully Exposed",   sub:"Last Man Standing · No Closing", emoji:"👁️",
        tiles:[{suit:"pin",n:4},{suit:"pin",n:5},{suit:"pin",n:6}] },
    ]
  },

  // ── STEP 3: Closing + East in one screen ──
  { id:"closing", cat:"📣 Closing & Dealer",
    q:"Did you Close your hand? Is winner East?",
    hint:"Close = turning tiles face-down to declare tenpai",
    type:"dual_bool",
    skip:(ans)=>["earthly","heavenly"].includes(ans.win_type)||ans.exposed==="fully_exposed",
    fields:[
      { id:"closing", label:"Hand was Closed / Called", sub:"+5 pts", emoji:"📣" },
      { id:"east",    label:"Winner is East (Dealer)", sub:"+1 pt",  emoji:"🀀" },
    ]
  },

  // ── STEP 4: Flowers ──
  { id:"flower_count", cat:"🌸 Flowers",
    q:"How many Flower tiles?",
    hint:"Each flower = 1 pt. Matching seat flower = +1 extra",
    type:"number", min:0, max:8,
    tiles:[{suit:"flower",n:1},{suit:"flower",n:2}]
  },
  { id:"seat_flowers", cat:"🌸 Flowers",
    q:"How many match your seat number?",
    hint:"E.g. East player = flowers #1. Matching seat = +1 bonus each",
    type:"number", min:0, max:4,
    skip:(ans)=>Number(ans.flower_count)===0,
    tiles:[{suit:"flower",n:1}]
  },
  { id:"bouquet", cat:"🌸 Flowers",
    q:"Bouquet bonus?",
    hint:"Mixed = one red + one blue 1-4. Pure = full set same colour",
    type:"single",
    skip:(ans)=>Number(ans.flower_count)<2,
    opts:[
      { id:"none",  label:"No Bouquet",                          emoji:"❌", tiles:[] },
      { id:"mixed", label:"Mixed Bouquet",   sub:"Red+Blue 1-4 · All pay 5 pts immediately", emoji:"💐",
        tiles:[{suit:"flower",n:1},{suit:"flower",n:3}] },
      { id:"pure",  label:"Pure Bouquet",    sub:"Full set same colour · All pay 10 pts",    emoji:"🌺",
        tiles:[{suit:"flower",n:1},{suit:"flower",n:2}] },
      { id:"both",  label:"Both Bouquets",   sub:"Mixed + Pure",                             emoji:"🌸",
        tiles:[{suit:"flower",n:1},{suit:"flower",n:2},{suit:"flower",n:3}] },
    ]
  },

  // ── STEP 5: Eyes + Wait together ──
  { id:"eyes_wait", cat:"👀 Eyes & Wait",
    q:"Pair (Eyes) and waiting type",
    hint:"Good Eye = pair of 2s, 5s or 8s. True Single = only 1 tile can win",
    type:"dual_choice",
    fields:[
      { id:"good_eye",  label:"Good Eye?",   sub:"Pair of 2s, 5s or 8s = +2 pts", emoji:"👀",
        type:"bool", tiles:[{suit:"pin",n:2},{suit:"pin",n:2}] },
      { id:"wait_type", label:"Wait type",   emoji:"⏳",
        type:"select", opts:[
          {id:"normal", label:"Normal wait",      emoji:"✅"},
          {id:"single", label:"True Single Wait", emoji:"🎯", sub:"+2 pts"},
          {id:"pairs",  label:"Calling by Pairs", emoji:"👥", sub:"+2 pts"},
        ]
      },
    ]
  },

  // ── STEP 6: Hand type ──
  { id:"hand_type", cat:"🀄 Hand type",
    q:"What kind of hand?",
    hint:"Look at your 5 melds — are they all sequences, all triplets, or mixed?",
    type:"single",
    opts:[
      { id:"all_sheung", label:"All Sheung",   sub:"All 5 melds are sequences · +5 pts", emoji:"〰️",
        tiles:[{suit:"man",n:1},{suit:"man",n:2},{suit:"man",n:3}] },
      { id:"all_pong",   label:"All Pong",     sub:"All 5 melds are triplets · +25 pts", emoji:"🎲",
        tiles:[{suit:"pin",n:7},{suit:"pin",n:7},{suit:"pin",n:7}] },
      { id:"special",    label:"Special Hand", sub:"Nico Nico / Orphans / Jade / Ruby / Diamond", emoji:"⭐",
        tiles:[] },
      { id:"mixed",      label:"Mixed",        sub:"Mix of sequences and triplets", emoji:"🃏",
        tiles:[{suit:"bam",n:3},{suit:"bam",n:4},{suit:"bam",n:5},{suit:"man",n:9},{suit:"man",n:9},{suit:"man",n:9}] },
    ]
  },

  // ── STEP 7: Special hand (only if special selected) ──
  { id:"special_hand", cat:"⭐ Special Hand",
    q:"Which special hand?",
    type:"single",
    skip:(ans)=>ans.hand_type!=="special",
    opts:[
      { id:"nico",     label:"Nico Nico",    sub:"7 pairs + 1 pong · 40 pts · No Closing",  emoji:"🎭",
        tiles:[{suit:"man",n:2},{suit:"man",n:2},{suit:"pin",n:4},{suit:"pin",n:4},{suit:"bam",n:9},{suit:"bam",n:9},{suit:"bam",n:9}] },
      { id:"orphan13", label:"13 Orphans",   sub:"90 pts · No Closing",                     emoji:"🃏",
        tiles:[{suit:"man",n:1},{suit:"man",n:9},{suit:"wind",n:"E"},{suit:"dragon",n:"G"}] },
      { id:"orphan16", label:"16 Orphans",   sub:"50 pts · No Closing",                     emoji:"🃏",
        tiles:[{suit:"man",n:1},{suit:"pin",n:9},{suit:"wind",n:"S"},{suit:"dragon",n:"W"}] },
      { id:"jade",     label:"Jade Hand",    sub:"Green Dragon pong + all Bamboo · 20 pts", emoji:"💚",
        tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"bam",n:3},{suit:"bam",n:4},{suit:"bam",n:5}] },
      { id:"ruby",     label:"Ruby Hand",    sub:"Red Dragon pong + all Characters · 20 pts",emoji:"❤️",
        tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}] },
      { id:"diamond",  label:"Diamond Hand", sub:"White Dragon pong + all Circles · 20 pts",emoji:"💎",
        tiles:[{suit:"dragon",n:"W"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"},{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}] },
    ]
  },

  // ── STEP 8: Suit ──
  { id:"suit_type", cat:"🎨 Suit pattern",
    q:"What suits are in the hand?",
    type:"single",
    skip:(ans)=>ans.hand_type==="special",
    opts:[
      { id:"mixed",        label:"Mixed suits",        sub:"All 3 suits + honours",              emoji:"🌈",
        tiles:[{suit:"man",n:3},{suit:"pin",n:5},{suit:"bam",n:7}] },
      { id:"two_suit",     label:"Two suits + honours",sub:"+8 pts",                             emoji:"🔵",
        tiles:[{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6},{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}] },
      { id:"two_suit_clean",label:"Two suits only",    sub:"No honours or flowers · +15 pts",    emoji:"⚪",
        tiles:[{suit:"man",n:7},{suit:"man",n:8},{suit:"man",n:9},{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}] },
      { id:"semi_pure",    label:"Semi Pure",          sub:"One suit + honours · +30 pts",       emoji:"🟡",
        tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6},{suit:"wind",n:"E"},{suit:"dragon",n:"G"}] },
      { id:"pure",         label:"Pure Suit",          sub:"One suit only · +90 pts",            emoji:"🟢",
        tiles:[{suit:"pin",n:1},{suit:"pin",n:3},{suit:"pin",n:5},{suit:"pin",n:7},{suit:"pin",n:9}] },
      { id:"all_five",     label:"All 5 Suits",        sub:"3 suits + winds + dragons · +10 pts",emoji:"🌈",
        tiles:[{suit:"man",n:1},{suit:"pin",n:1},{suit:"bam",n:1},{suit:"wind",n:"E"},{suit:"dragon",n:"G"}] },
    ]
  },

  // ── STEP 9: Honours (dragons + winds) ──
  { id:"pong_dragon", cat:"🐉 Dragons",
    q:"How many Dragon Pongs/Gongs?",
    hint:"Red 中, Green 發, White 白 — 2 pts each",
    type:"number", min:0, max:3,
    skip:(ans)=>ans.suit_type==="pure"||ans.hand_type==="special",
    tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]
  },
  { id:"dragon_combo", cat:"🐉 Dragons",
    q:"Dragon combination?",
    type:"single",
    skip:(ans)=>Number(ans.pong_dragon)<2,
    opts:[
      { id:"none",  label:"No combo",      emoji:"❌", tiles:[] },
      { id:"little",label:"Little Dragon", sub:"2 pongs + dragon pair · +20 pts", emoji:"🐉",
        tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}] },
      { id:"big",   label:"Big Dragon",    sub:"All 3 pongs · +40 pts", emoji:"🔥",
        tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}] },
    ]
  },
  { id:"pong_wind", cat:"💨 Winds",
    q:"How many Wind Pongs/Gongs?",
    hint:"1 pt each + 1 bonus if it's your seat wind + 1 bonus if it's the round wind",
    type:"number", min:0, max:4,
    skip:(ans)=>ans.suit_type==="pure"||ans.hand_type==="special",
    tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]
  },
  { id:"wind_seat", cat:"💨 Winds",
    q:"Does a wind pong match the winner's seat?",
    hint:"+1 pt bonus if your seat wind tile is in a pong",
    type:"boolean",
    skip:(ans)=>Number(ans.pong_wind)===0,
    tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]
  },
  { id:"wind_round", cat:"💨 Winds",
    q:"Does a wind pong match the round wind?",
    hint:"+1 pt bonus if the current round wind tile is in a pong",
    type:"boolean",
    skip:(ans)=>Number(ans.pong_wind)===0,
    tiles:[{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"}]
  },
  { id:"wind_combo", cat:"💨 Winds",
    q:"Wind combination?",
    type:"single",
    skip:(ans)=>Number(ans.pong_wind)<2,
    opts:[
      { id:"none",   label:"No combo",       emoji:"❌", tiles:[] },
      { id:"little3",label:"Little 3 Winds", sub:"2 pongs + wind pair · +15 pts",       emoji:"💨",
        tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"W"}] },
      { id:"big3",   label:"Big 3 Winds",    sub:"3 wind pongs · +30 pts",             emoji:"🌪️",
        tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"}] },
      { id:"little4",label:"Little 4 Winds", sub:"3 pongs + wind pair · +60 pts",       emoji:"🌬️",
        tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"N"},{suit:"wind",n:"N"}] },
      { id:"big4",   label:"Big 4 Winds",    sub:"All 4 wind pongs · +80 pts",          emoji:"⚡",
        tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"N"},{suit:"wind",n:"N"},{suit:"wind",n:"N"}] },
    ]
  },

  // ── STEP 10: Concealed pongs + Gongs together ──
  { id:"concealed_pongs", cat:"🔒 Concealed sets",
    q:"How many Concealed Pongs?",
    hint:"Hidden triplets in your hand. Each Open Gong = 1 Concealed Pong",
    type:"number", min:0, max:5,
    tiles:[{suit:"back",n:""},{suit:"pin",n:5},{suit:"pin",n:5},{suit:"back",n:""}]
  },
  { id:"open_gongs", cat:"🔒 Concealed sets",
    q:"How many Open Gongs?",
    hint:"4 of same tile, declared face-up · +1 pt each",
    type:"number", min:0, max:4,
    tiles:[{suit:"bam",n:7},{suit:"bam",n:7},{suit:"bam",n:7},{suit:"bam",n:7}]
  },
  { id:"concealed_gongs", cat:"🔒 Concealed sets",
    q:"How many Concealed Gongs?",
    hint:"4 of same tile, kept hidden · +1 pt + collect 5 pts from each player immediately",
    type:"number", min:0, max:4,
    tiles:[{suit:"back",n:""},{suit:"man",n:3},{suit:"man",n:3},{suit:"back",n:""}]
  },

  // ── STEP 11: Bonus patterns ──
  { id:"dragon_run", cat:"🐲 Dragon Run",
    q:"Any Dragon Run? (1–9 complete sequence)",
    hint:"Three sheungs forming 1-2-3, 4-5-6, 7-8-9",
    type:"single",
    skip:(ans)=>ans.hand_type==="all_pong"||ans.hand_type==="special",
    opts:[
      { id:"none",     label:"No Dragon Run",         emoji:"❌", tiles:[] },
      { id:"mix_exp",  label:"Mixed Dragon — Exposed", sub:"All 3 suits · +8 pts",       emoji:"🐲",
        tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3},{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6},{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}] },
      { id:"mix_con",  label:"Mixed Dragon — Concealed",sub:"All 3 suits · +10 pts",     emoji:"🀫",
        tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3},{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6},{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}] },
      { id:"pure_exp", label:"Pure Dragon — Exposed",  sub:"Same suit · +15 pts",        emoji:"🔥",
        tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6},{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}] },
      { id:"pure_con", label:"Pure Dragon — Concealed",sub:"Same suit · +20 pts",        emoji:"💎",
        tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6},{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}] },
    ]
  },
  { id:"step_up", cat:"📈 Step Up",
    q:"Step-Up Sheung?",
    hint:"3+ sequences each stepping 1 number higher than the previous",
    type:"single",
    skip:(ans)=>ans.hand_type==="all_pong"||ans.hand_type==="special",
    opts:[
      { id:"none",          label:"No Step Up", emoji:"❌", tiles:[] },
      { id:"step",          label:"Step Up",    sub:"3 stepping sheungs · +5 pts",       emoji:"📈",
        tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4},{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5},{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}] },
      { id:"all_step",      label:"All Step Up",sub:"All 5 sheungs step up · +20 pts",  emoji:"🚀",
        tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4},{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}] },
      { id:"all_step_pure", label:"All Step Up Same Suit",sub:"+90 pts",                emoji:"💯",
        tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4}] },
    ]
  },
  { id:"terminals", cat:"🔢 Terminals",
    q:"Terminal tiles (1s and 9s)?",
    hint:"Terminals = tiles numbered 1 or 9 in any suit",
    type:"single",
    opts:[
      { id:"none",          label:"Normal mix",              sub:"No bonus",                         emoji:"—",  tiles:[] },
      { id:"no_term",       label:"No Terminals",            sub:"No 1s or 9s (honours OK) · +5 pts",emoji:"🚫",
        tiles:[{suit:"man",n:3},{suit:"pin",n:5},{suit:"bam",n:7}] },
      { id:"no_term_no_hon",label:"No Terminals, No Honours",sub:"Clean hand · +8 pts",             emoji:"⛔",
        tiles:[{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6}] },
      { id:"all_term_hon",  label:"All Terminals + Honours", sub:"+20 pts",                         emoji:"🔢",
        tiles:[{suit:"man",n:1},{suit:"man",n:9},{suit:"wind",n:"E"},{suit:"dragon",n:"G"}] },
      { id:"all_term_pure", label:"All Terminals, No Honours",sub:"+40 pts",                       emoji:"💯",
        tiles:[{suit:"man",n:1},{suit:"man",n:9},{suit:"pin",n:1},{suit:"pin",n:9},{suit:"bam",n:1}] },
    ]
  },
];

function calcDxbScore(ans) {
  let pts = 0;
  const breakdown = [];
  const add = (n, label) => { if(n>0){pts+=n; breakdown.push({pts:n,label});} };

  // Extract dual-field answers
  const closing   = ans.closing   ?? ans["closing.closing"]   ?? false;
  const east      = ans.east      ?? ans["closing.east"]      ?? false;
  const good_eye  = ans.good_eye  ?? ans["eyes_wait.good_eye"]?? false;
  const wait_type = ans.wait_type ?? ans["eyes_wait.wait_type"]?? "normal";

  // Always
  add(DXB_SCORE.mahjong, "Mahjong/Winning");
  if(closing) add(DXB_SCORE.closing, "Closing/Calling");

  // Win type
  if(ans.win_type==="heavenly") { add(DXB_SCORE.heavenly,"Heavenly Hand"); return {pts,breakdown}; }
  if(ans.win_type==="earthly") { add(DXB_SCORE.earthly,"Earthly Hand"); return {pts,breakdown}; }
  if(ans.win_type==="within_7") add(DXB_SCORE.win_within_7,"Win within 7 tiles");
  if(ans.win_type==="seabed") add(DXB_SCORE.seabed,"Seabed — last tile from wall");
  if(ans.win_type==="self_pick") add(DXB_SCORE.self_pick,"Self Pick");
  if(ans.win_type==="self_pick_flower") add(DXB_SCORE.self_pick_flower_wall,"Self Pick from Flower Wall");

  // Concealed/exposed
  if(ans.exposed==="fully_concealed"){
    if(ans.win_type==="self_pick"||ans.win_type==="self_pick_flower") add(DXB_SCORE.concealed_self_pick,"Concealed Hand — Self Pick");
    else add(DXB_SCORE.concealed_discard,"Concealed Hand — Discard");
  }
  if(ans.exposed==="fully_exposed"){
    if(ans.win_type==="self_pick"||ans.win_type==="self_pick_flower") add(DXB_SCORE.fully_exposed_self_pick,"Fully Exposed — Self Pick");
    else add(DXB_SCORE.fully_exposed_discard,"Fully Exposed — Discard");
  }
  if(east) add(DXB_SCORE.east_dealer,"East/Dealer bonus");

  // Flowers
  const fc = Number(ans.flower_count||0);
  if(fc===7){ add(DXB_SCORE.seven_flowers,"7 Flowers — instant win"); return {pts,breakdown}; }
  if(fc===8){ add(DXB_SCORE.eight_flowers,"8 Flowers — instant win"); return {pts,breakdown}; }
  if(fc>0){ add(fc,"Flowers (×"+fc+")"); }
  if(fc>0&&Number(ans.seat_flowers||0)>0) add(Number(ans.seat_flowers),"Seat flower bonus");
  if(fc===0) add(DXB_SCORE.no_flowers,"No Flowers");
  if(ans.bouquet==="mixed") add(DXB_SCORE.mixed_bouquet,"Mixed Bouquet");
  if(ans.bouquet==="pure") add(DXB_SCORE.pure_bouquet,"Pure Bouquet");
  if(ans.bouquet==="both"){ add(DXB_SCORE.mixed_bouquet,"Mixed Bouquet"); add(DXB_SCORE.pure_bouquet,"Pure Bouquet"); }

  // Miscellaneous
  if(ans.suit_type==="pure"||ans.suit_type==="semi_pure"){ /* no honours, handled in suit */ }
  else if(fc===0&&(!ans.pong_dragon||ans.pong_dragon===0)&&(!ans.pong_wind||ans.pong_wind===0)) add(DXB_SCORE.no_honours,"No Honour tiles");

  // Good eye / pair
  if(good_eye===true) add(DXB_SCORE.good_eye,"Good Eyes (2, 5 or 8 pair)");
  if(wait_type==="single") add(DXB_SCORE.true_single_wait,"True Single Wait");
  if(wait_type==="pairs") add(DXB_SCORE.calling_by_pairs,"Calling by Pairs");

  // Suit
  if(ans.suit_type==="pure") add(DXB_SCORE.pure_suit,"Pure Suit (one suit only)");
  else if(ans.suit_type==="semi_pure") add(DXB_SCORE.semi_pure,"Semi Pure (one suit + honours)");
  else if(ans.suit_type==="two_suit_clean") add(DXB_SCORE.two_suit_no_honour_no_flower,"Two Suits, No Honours/Flowers");
  else if(ans.suit_type==="two_suit") add(DXB_SCORE.two_suit,"Two Suits");
  else if(ans.suit_type==="all_five") add(DXB_SCORE.all_five_suits,"All 5 Suits");

  // Sheung type
  if(ans.hand_type==="all_sheung"){
    if(ans.suit_type==="mixed"||!ans.suit_type) add(DXB_SCORE.all_sheung,"All Sheung");
    else add(DXB_SCORE.all_sheung_no_honours_no_flowers,"All Sheung — No Honours/Flowers");
  }

  // Step up
  if(ans.step_up==="step") add(DXB_SCORE.step_up,"Step Up");
  if(ans.step_up==="all_step") add(DXB_SCORE.all_step_up,"All Step Up");
  if(ans.step_up==="all_step_pure") add(DXB_SCORE.all_step_up_same_suit,"All Step Up Same Suit");

  // Dragon run
  if(ans.dragon_run==="mix_exp") add(DXB_SCORE.mix_dragon_exposed,"Mixed Dragon Run — Exposed");
  if(ans.dragon_run==="mix_con") add(DXB_SCORE.mix_dragon_concealed,"Mixed Dragon Run — Concealed");
  if(ans.dragon_run==="pure_exp") add(DXB_SCORE.pure_dragon_exposed,"Pure Dragon Run — Exposed");
  if(ans.dragon_run==="pure_con") add(DXB_SCORE.pure_dragon_concealed,"Pure Dragon Run — Concealed");

  // Pong hand
  if(ans.hand_type==="all_pong") add(DXB_SCORE.all_pong,"All Pong Hand");

  // Dragons
  const pd = Number(ans.pong_dragon||0);
  if(pd>0) add(pd*DXB_SCORE.pong_dragon, `Dragon Pong ×${pd}`);
  if(ans.dragon_combo==="little") add(DXB_SCORE.little_dragon,"Little Dragons");
  if(ans.dragon_combo==="big") add(DXB_SCORE.big_dragon,"Big Dragons");

  // Winds
  const pw = Number(ans.pong_wind||0);
  if(pw>0) add(pw*DXB_SCORE.pong_wind, `Wind Pong ×${pw}`);
  if(ans.wind_seat) add(DXB_SCORE.pong_wind_seat,"Wind of Seat bonus");
  if(ans.wind_round) add(DXB_SCORE.pong_wind_round,"Wind of Round bonus");
  if(ans.wind_combo==="little3") add(DXB_SCORE.little_3_winds,"Little 3 Winds");
  if(ans.wind_combo==="big3") add(DXB_SCORE.big_3_winds,"Big 3 Winds");
  if(ans.wind_combo==="little4") add(DXB_SCORE.little_4_winds,"Little 4 Winds");
  if(ans.wind_combo==="big4") add(DXB_SCORE.big_4_winds,"Big 4 Winds");

  // Concealed pongs
  const cp = Number(ans.concealed_pongs||0);
  if(cp===2) add(DXB_SCORE.concealed_pong_2,"2 Concealed Pongs");
  if(cp===3) add(DXB_SCORE.concealed_pong_3,"3 Concealed Pongs");
  if(cp===4) add(DXB_SCORE.concealed_pong_4,"4 Concealed Pongs");
  if(cp===5) add(DXB_SCORE.concealed_pong_5,"5 Concealed Pongs");

  // Gongs
  const og=Number(ans.open_gongs||0), cg=Number(ans.concealed_gongs||0);
  if(og>0) add(og*DXB_SCORE.open_gong,`Open Gong ×${og}`);
  if(cg>0) add(cg*DXB_SCORE.concealed_gong,`Concealed Gong ×${cg} (+5 pts each from others)`);

  // Terminals
  if(ans.terminals==="no_term") add(DXB_SCORE.no_terminals,"No Terminal tiles");
  if(ans.terminals==="no_term_no_hon") add(DXB_SCORE.no_terminals_no_honours,"No Terminals, No Honours");
  if(ans.terminals==="all_term_hon") add(DXB_SCORE.all_terminals_with_honours,"All Terminals with Honours");
  if(ans.terminals==="all_term_pure") add(DXB_SCORE.all_terminals_no_honours,"All Terminals, No Honours");

  // Special hand
  if(ans.special_hand==="nico") add(DXB_SCORE.nico_nico,"Nico Nico Hand");
  if(ans.special_hand==="orphan13") add(DXB_SCORE.orphan_13,"13 Orphans");
  if(ans.special_hand==="orphan16") add(DXB_SCORE.orphan_16,"16 Orphans");
  if(ans.special_hand==="jade") add(DXB_SCORE.jade,"Jade Hand");
  if(ans.special_hand==="ruby") add(DXB_SCORE.ruby,"Ruby Hand");
  if(ans.special_hand==="diamond") add(DXB_SCORE.diamond,"Diamond Hand");

  return {pts, breakdown};
}

// ─── DUBAI SCORING WIZARD COMPONENT ──────────────────────────────────────────

function DxbWizard({ accentColor, accent, onDone, prefilled = {}, aiResult = null }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(prefilled);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  // For dual_bool / dual_choice — track partial answers
  const [dualState, setDualState] = useState({});

  const AI_AUTO_SKIP = aiResult && aiResult.confidence === "high" ? Object.keys(prefilled) : [];

  const activeQs = DXB_QUESTIONS.filter(q => {
    if (q.skip && q.skip(answers)) return false;
    if (AI_AUTO_SKIP.includes(q.id)) return false;
    return true;
  });
  const current = activeQs[step];

  const commitAnswer = (id, val) => {
    const newAns = { ...answers, [id]: val };
    setAnswers(newAns);
    setDualState({});
    if (step + 1 >= activeQs.length) {
      const r = calcDxbScore(newAns);
      setResult(r); setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const reset = () => { setStep(0); setAnswers(prefilled); setDone(false); setResult(null); setDualState({}); };

  // ── DONE SCREEN ──
  if (done && result) {
    return (
      <div>
        <div style={{background:`${accentColor}18`,border:`1.5px solid ${accentColor}55`,borderRadius:16,padding:20,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:11,color:accentColor,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>✓ Score calculated</div>
          <div style={{fontSize:64,fontWeight:900,color:accent,lineHeight:1}}>{result.pts}</div>
          <div style={{fontSize:14,color:"rgba(200,180,160,0.6)",marginTop:6}}>points total</div>
        </div>
        <div style={{background:"#1A1712",borderRadius:12,border:"0.5px solid rgba(255,255,255,0.08)",padding:14,marginBottom:16}}>
          <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Breakdown</div>
          {result.breakdown.map((b,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"0.5px solid rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:13,color:"rgba(200,180,160,0.8)"}}>{b.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:accent}}>+{b.pts}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:4}}>
            <span style={{fontSize:14,fontWeight:700,color:"#F0E8DC"}}>TOTAL</span>
            <span style={{fontSize:22,fontWeight:900,color:accent}}>{result.pts} pts</span>
          </div>
        </div>
        <div style={{fontSize:12,color:`${accentColor}99`,background:`${accentColor}10`,borderRadius:10,padding:"10px 14px",marginBottom:12,lineHeight:1.6}}>
          Tap below to go to Players and calculate who pays what.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={reset} style={{flex:1,padding:11,background:"none",border:`0.5px solid ${accentColor}50`,borderRadius:10,color:accent,fontSize:13,fontWeight:600,cursor:"pointer"}}>New hand</button>
          <button onClick={()=>{ if(onDone) onDone(result.pts); }}
            style={{flex:2,padding:11,background:accentColor,border:"none",borderRadius:10,color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            Calculate who pays →
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;
  const progress = Math.round(((step) / activeQs.length) * 100);
  const isAI = prefilled[current.id] !== undefined;

  // Mini tile strip for question context
  const QuestionTiles = ({tiles=[]}) => {
    if(!tiles||tiles.length===0) return null;
    return (
      <div style={{display:"flex",gap:3,flexWrap:"wrap",margin:"8px 0 4px"}}>
        {tiles.slice(0,8).map((t,i)=><Tile key={i} suit={t.suit} n={t.n} size={30}/>)}
      </div>
    );
  };

  return (
    <div>
      {/* Progress bar */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div style={{flex:1,height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
          <div style={{width:`${progress}%`,height:"100%",background:accentColor,borderRadius:3,transition:"width 0.25s"}}/>
        </div>
        <span style={{fontSize:11,color:"rgba(200,180,160,0.4)",whiteSpace:"nowrap"}}>{step+1}/{activeQs.length}</span>
      </div>

      {/* Category badge */}
      {current.cat && (
        <div style={{fontSize:12,fontWeight:700,color:accentColor,background:`${accentColor}15`,
          borderRadius:20,padding:"4px 12px",display:"inline-block",marginBottom:10}}>
          {current.cat}
        </div>
      )}

      {/* Question + AI badge */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
        <div style={{fontSize:17,fontWeight:700,color:"#F0E8DC"}}>{current.q}</div>
        {isAI && <div style={{flexShrink:0,fontSize:10,fontWeight:700,color:accentColor,
          background:`${accentColor}18`,border:`0.5px solid ${accentColor}40`,
          borderRadius:10,padding:"2px 8px",marginTop:2}}>🤖 AI</div>}
      </div>

      {/* Hint */}
      {current.hint && (
        <div style={{fontSize:12,color:"rgba(200,180,160,0.45)",marginBottom:8,lineHeight:1.5}}>{current.hint}</div>
      )}

      {/* Question tiles */}
      <QuestionTiles tiles={current.tiles}/>

      {/* Back button */}
      {step > 0 && (
        <button onClick={()=>{ setStep(s=>s-1); setDualState({}); }}
          style={{background:"none",border:"none",color:"rgba(200,180,160,0.4)",fontSize:12,
            cursor:"pointer",padding:"6px 0 12px",display:"block"}}>← Back</button>
      )}

      {/* ── SINGLE SELECT ── */}
      {current.type === "single" && (
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          {current.opts.map(opt => {
            const isPre = prefilled[current.id] === opt.id;
            return (
              <button key={opt.id} onClick={()=>commitAnswer(current.id, opt.id)}
                style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",
                  background:isPre?`${accentColor}18`:"#1A1712",
                  border:`1px solid ${isPre?accentColor:"rgba(255,255,255,0.08)"}`,
                  borderRadius:12,cursor:"pointer",textAlign:"left",width:"100%"}}>
                <span style={{fontSize:24,flexShrink:0,marginTop:1}}>{opt.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:isPre?"#F0E8DC":"#E8E0D5",fontWeight:isPre?700:500}}>
                    {opt.label}
                    {isPre&&<span style={{fontSize:10,color:accentColor,fontWeight:700,marginLeft:6}}>🤖</span>}
                  </div>
                  {opt.sub && <div style={{fontSize:11,color:"rgba(200,180,160,0.45)",marginTop:2}}>{opt.sub}</div>}
                  {/* Tile preview */}
                  {opt.tiles && opt.tiles.length > 0 && (
                    <div style={{display:"flex",gap:2,marginTop:6,flexWrap:"wrap"}}>
                      {opt.tiles.slice(0,9).map((t,i)=><Tile key={i} suit={t.suit} n={t.n} size={26}/>)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── BOOLEAN ── */}
      {current.type === "boolean" && (
        <div style={{display:"flex",gap:10,marginTop:8}}>
          {[{id:true,label:"Yes",emoji:"✅"},{id:false,label:"No",emoji:"❌"}].map(opt => {
            const isPre = prefilled[current.id] === opt.id;
            return (
              <button key={String(opt.id)} onClick={()=>commitAnswer(current.id, opt.id)}
                style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,
                  padding:"20px 12px",
                  background:isPre?`${accentColor}18`:"#1A1712",
                  border:`1px solid ${isPre?accentColor:"rgba(255,255,255,0.08)"}`,
                  borderRadius:12,cursor:"pointer"}}>
                <span style={{fontSize:30}}>{opt.emoji}</span>
                <span style={{fontSize:15,color:isPre?"#F0E8DC":"#E8E0D5",fontWeight:600}}>{opt.label}</span>
                {isPre&&<span style={{fontSize:10,color:accentColor,fontWeight:700}}>🤖 AI</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── NUMBER ── */}
      {current.type === "number" && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
          {Array.from({length:(current.max-current.min+1)},(_,i)=>i+current.min).map(n => {
            const isPre = prefilled[current.id] === n;
            return (
              <button key={n} onClick={()=>commitAnswer(current.id, n)}
                style={{width:54,height:54,
                  background:isPre?`${accentColor}25`:"#1A1712",
                  border:`1px solid ${isPre?accentColor:"rgba(255,255,255,0.1)"}`,
                  borderRadius:12,cursor:"pointer",
                  fontSize:20,fontWeight:700,
                  color:isPre?accentColor:"#E8E0D5",position:"relative"}}>
                {n}
                {isPre&&<div style={{position:"absolute",top:-3,right:-3,width:9,height:9,borderRadius:"50%",background:accentColor}}/>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── DUAL BOOL — two yes/no toggles on one screen ── */}
      {current.type === "dual_bool" && (
        <div style={{marginTop:8}}>
          {current.fields.map(f => (
            <div key={f.id} style={{background:"#1A1712",borderRadius:12,padding:"12px 14px",marginBottom:8,
              border:"0.5px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:18}}>{f.emoji}</span>
                    <span style={{fontSize:14,fontWeight:600,color:"#F0E8DC"}}>{f.label}</span>
                  </div>
                  {f.sub&&<div style={{fontSize:11,color:"rgba(200,180,160,0.45)",marginTop:2,marginLeft:24}}>{f.sub}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  {[{v:true,l:"Yes"},{v:false,l:"No"}].map(opt=>(
                    <button key={String(opt.v)} onClick={()=>setDualState(s=>({...s,[f.id]:opt.v}))}
                      style={{padding:"6px 12px",borderRadius:8,
                        background:dualState[f.id]===opt.v?`${accentColor}25`:"#0E0C0A",
                        border:`1px solid ${dualState[f.id]===opt.v?accentColor:"rgba(255,255,255,0.1)"}`,
                        color:dualState[f.id]===opt.v?accentColor:"rgba(200,180,160,0.5)",
                        fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Confirm when all fields answered */}
          {current.fields.every(f=>dualState[f.id]!==undefined) && (
            <button onClick={()=>{
              const merged = {...answers};
              current.fields.forEach(f=>{ merged[f.id]=dualState[f.id]; });
              setAnswers(merged);
              setDualState({});
              if(step+1>=activeQs.length){ setResult(calcDxbScore(merged)); setDone(true); }
              else setStep(s=>s+1);
            }} style={{width:"100%",padding:12,background:accentColor,border:"none",borderRadius:10,
              color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:4}}>
              Next →
            </button>
          )}
        </div>
      )}

      {/* ── DUAL CHOICE — one bool + one select on one screen ── */}
      {current.type === "dual_choice" && (
        <div style={{marginTop:8}}>
          {current.fields.map(f => (
            <div key={f.id} style={{background:"#1A1712",borderRadius:12,padding:"12px 14px",marginBottom:8,
              border:"0.5px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#F0E8DC",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:16}}>{f.emoji}</span>{f.label}
              </div>
              {f.type==="bool" && (
                <div>
                  {f.tiles && f.tiles.length>0 && (
                    <div style={{display:"flex",gap:3,marginBottom:8}}>
                      {f.tiles.map((t,i)=><Tile key={i} suit={t.suit} n={t.n} size={28}/>)}
                    </div>
                  )}
                  <div style={{display:"flex",gap:6}}>
                    {[{v:true,l:"Yes ✅"},{v:false,l:"No ❌"}].map(opt=>(
                      <button key={String(opt.v)} onClick={()=>setDualState(s=>({...s,[f.id]:opt.v}))}
                        style={{flex:1,padding:"8px",borderRadius:8,
                          background:dualState[f.id]===opt.v?`${accentColor}25`:"#0E0C0A",
                          border:`1px solid ${dualState[f.id]===opt.v?accentColor:"rgba(255,255,255,0.1)"}`,
                          color:dualState[f.id]===opt.v?accentColor:"rgba(200,180,160,0.5)",
                          fontSize:13,fontWeight:600,cursor:"pointer"}}>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                  {f.sub&&<div style={{fontSize:11,color:"rgba(200,180,160,0.4)",marginTop:4}}>{f.sub}</div>}
                </div>
              )}
              {f.type==="select" && (
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {f.opts.map(opt=>(
                    <button key={opt.id} onClick={()=>setDualState(s=>({...s,[f.id]:opt.id}))}
                      style={{padding:"6px 12px",borderRadius:8,
                        background:dualState[f.id]===opt.id?`${accentColor}25`:"#0E0C0A",
                        border:`1px solid ${dualState[f.id]===opt.id?accentColor:"rgba(255,255,255,0.1)"}`,
                        cursor:"pointer",textAlign:"left"}}>
                      <div style={{fontSize:12,fontWeight:600,color:dualState[f.id]===opt.id?accentColor:"rgba(200,180,160,0.6)"}}>{opt.emoji} {opt.label}</div>
                      {opt.sub&&<div style={{fontSize:10,color:"rgba(200,180,160,0.35)",marginTop:1}}>{opt.sub}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {current.fields.every(f=>dualState[f.id]!==undefined) && (
            <button onClick={()=>{
              const merged = {...answers};
              current.fields.forEach(f=>{ merged[f.id]=dualState[f.id]; });
              setAnswers(merged);
              setDualState({});
              if(step+1>=activeQs.length){ setResult(calcDxbScore(merged)); setDone(true); }
              else setStep(s=>s+1);
            }} style={{width:"100%",padding:12,background:accentColor,border:"none",borderRadius:10,
              color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:4}}>
              Next →
            </button>
          )}
        </div>
      )}

    </div>
  );
}


// ─── AI VISION — calls secure Netlify proxy (API key never exposed to browser) ──

async function analyseHandPhoto(base64Image) {
  // Netlify functions are always at /.netlify/functions/<name>
  const response = await fetch("/.netlify/functions/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    let errMsg = `Server error ${response.status}`;
    try {
      const errData = await response.json();
      errMsg = errData.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  return await response.json();
}

// Convert video frame to base64 JPEG — crops to match the 220px preview window
function captureFrameAsBase64(videoEl) {
  const canvas = document.createElement("canvas");
  const vw = videoEl.videoWidth  || 640;
  const vh = videoEl.videoHeight || 480;

  // The video is displayed at full width with height:220px objectFit:cover
  // We need to crop the same region that's visible in the preview
  const displayW = videoEl.offsetWidth  || 375;
  const displayH = 220; // matches CSS height

  // Calculate the cropped source region (same math as CSS objectFit:cover)
  const scale = Math.max(displayW / vw, displayH / vh);
  const srcW = displayW / scale;
  const srcH = displayH / scale;
  const srcX = (vw - srcW) / 2;
  const srcY = (vh - srcH) / 2;

  // Output at 2× display size for quality
  canvas.width  = displayW * 2;
  canvas.height = displayH * 2;
  canvas.getContext("2d").drawImage(
    videoEl,
    srcX, srcY, srcW, srcH,       // source crop
    0, 0, canvas.width, canvas.height  // dest
  );
  return canvas.toDataURL("image/jpeg", 0.88).split(",")[1];
}

// ─── DUBAI SCORING CAMERA TAB ─────────────────────────────────────────────────

function DxbCameraTab({ game, onScore, players = [], roundWind = "E" }) {
  const [mode, setMode] = useState("home");
  const [cameraActive, setCameraActive] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [prefilledAnswers, setPrefilledAnswers] = useState({});
  const [capturedThumb, setCapturedThumb] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [selectedWinType, setSelectedWinType] = useState(null);
  const [selectedDiscarder, setSelectedDiscarder] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const finishScore = (score) => {
    if (onScore) onScore(score, {
      winnerId: selectedWinner,
      winType: selectedWinType,
      discarderId: selectedDiscarder,
    });
  };

  // Merge AI prefill with wind-aware answers for selected winner
  const buildWindPrefill = (base, winnerId) => {
    const winner = players.find(p => p.id === winnerId);
    if (!winner) return base;
    return {
      ...base,
      east: winner.windId === "E",
      wind_seat: winner.windId === roundWind,
      wind_round: winner.windId === roundWind,
      _winnerName: winner.name,
      _winnerSeat: winner.windId,
      _roundWind: roundWind,
    };
  };

  const startCamera = async () => {
    setAnalysisError(null);
    setCameraActive(false);

    // iOS Safari requires explicit permission check and simple constraints
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAnalysisError("Camera not supported on this browser. Please use Safari on iPhone.");
      return;
    }

    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      // Simple constraints work best on iOS Safari
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
      // srcObject assigned via useEffect once video element mounts
    } catch (err) {
      const msg = err.name === "NotAllowedError"
        ? "Camera permission denied. Go to Settings → Safari → Camera and set to Allow."
        : err.name === "NotFoundError"
        ? "No camera found on this device."
        : `Camera error: ${err.message}`;
      setAnalysisError(msg);
    }
  };

  // Assign stream to video element as soon as both are ready
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      // iOS Safari needs explicit play() call
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const takePhotoAndAnalyse = async () => {
    if (!videoRef.current) return;

    // Capture frame
    const b64 = captureFrameAsBase64(videoRef.current);

    // Save thumbnail for display
    const thumb = "data:image/jpeg;base64," + b64;
    setCapturedThumb(thumb);
    stopCamera();
    setAnalysing(true);
    setMode("analysing");

    try {
      const result = await analyseHandPhoto(b64);
      setAiResult(result);

      // Map AI result → wizard pre-filled answers
      const prefill = {};
      if (result.flower_count !== undefined) prefill.flower_count = result.flower_count;
      if (result.flower_count === 0) prefill.seat_flowers = 0;
      if (result.suit_type) prefill.suit_type = result.suit_type;
      if (result.hand_type) prefill.hand_type = result.hand_type;
      if (result.pong_dragon !== undefined) prefill.pong_dragon = result.pong_dragon;
      if (result.pong_wind !== undefined) prefill.pong_wind = result.pong_wind;
      if (result.open_gongs !== undefined) prefill.open_gongs = result.open_gongs;
      if (result.concealed_gongs !== undefined) prefill.concealed_gongs = result.concealed_gongs;
      if (result.concealed_pongs !== undefined) prefill.concealed_pongs = result.concealed_pongs;
      if (result.good_eye !== undefined) prefill.good_eye = result.good_eye;
      if (result.dragon_run) prefill.dragon_run = result.dragon_run;
      if (result.step_up) prefill.step_up = result.step_up;
      if (result.terminals) prefill.terminals = result.terminals;
      if (result.dragon_combo) prefill.dragon_combo = result.dragon_combo;
      if (result.wind_combo) prefill.wind_combo = result.wind_combo;
      if (result.special_hand && result.special_hand !== "none") {
        prefill.special_hand = result.special_hand;
        prefill.hand_type = "special";
      }

      setPrefilledAnswers(prefill);
      setAnalysisDone(true);
      setMode("review");
    } catch (err) {
      // Show the actual error — don't silently reset
      const msg = err.message || "Analysis failed";
      setAnalysisError(
        msg.includes("API key not configured")
          ? "⚠️ API key not set up yet — see setup instructions below."
          : msg.includes("401") || msg.includes("403")
          ? "⚠️ Invalid API key. Check your Netlify environment variable."
          : `⚠️ Analysis failed: ${msg}. You can still score manually.`
      );
      setMode("home"); // go back to home with error shown, not camera
    } finally {
      setAnalysing(false);
    }
  };

  const WINDS_MAP = {E:"🀀",S:"🀁",W:"🀂",N:"🀃"};

  const winnerBlock = players.length > 0 && (
    <div style={{background:"#1A1712",borderRadius:16,border:"0.5px solid rgba(255,255,255,0.08)",padding:16,marginBottom:12}}>
      <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Who won?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {players.map(p=>{
          const isSel = selectedWinner===p.id;
          return (
            <button key={p.id} onClick={()=>{ setSelectedWinner(p.id); if(selectedDiscarder===p.id) setSelectedDiscarder(null); }}
              style={{padding:"12px 10px",borderRadius:12,border:`1.5px solid ${isSel?p.color:"rgba(255,255,255,0.1)"}`,
                background:isSel?`${p.color}25`:"transparent",cursor:"pointer",textAlign:"left"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:16}}>{WINDS_MAP[p.windId]||"🀀"}</span>
                <span style={{fontSize:14,fontWeight:700,color:isSel?p.color:"#F0E8DC"}}>{p.name}</span>
              </div>
              <div style={{fontSize:10,color:"rgba(200,180,160,0.45)"}}>
                {p.windId==="E"?"East · Dealer":p.windId==="S"?"South":p.windId==="W"?"West":"North"}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>How did they win?</div>
      <div style={{display:"flex",gap:8,marginBottom: selectedWinType==="discard"?12:0}}>
        {[
          {id:"self_pick", label:"Self pick", sub:"All 3 pay. East seat +1"},
          {id:"discard", label:"Discard", sub:"Only discarder pays. East ×2"},
        ].map(wt=>{
          const sel = selectedWinType===wt.id;
          return (
            <button key={wt.id} onClick={()=>{ setSelectedWinType(wt.id); if(wt.id!=="discard") setSelectedDiscarder(null); }}
              style={{flex:1,padding:"12px 10px",borderRadius:12,textAlign:"left",cursor:"pointer",
                border:`1.5px solid ${sel?game.color:"rgba(255,255,255,0.1)"}`,
                background:sel?`${game.color}20`:"transparent"}}>
              <div style={{fontSize:14,fontWeight:700,color:sel?game.accent:"#F0E8DC",marginBottom:3}}>{wt.label}</div>
              <div style={{fontSize:10,color:"rgba(200,180,160,0.45)",lineHeight:1.4}}>{wt.sub}</div>
            </button>
          );
        })}
      </div>
      {selectedWinType==="discard" && (
        <div>
          <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Who discarded?</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {players.filter(p=>p.id!==selectedWinner).map(p=>{
              const sel = selectedDiscarder===p.id;
              return (
                <button key={p.id} onClick={()=>setSelectedDiscarder(p.id)}
                  style={{padding:"7px 12px",borderRadius:20,cursor:"pointer",
                    border:`1.5px solid ${sel?p.color:"rgba(255,255,255,0.12)"}`,
                    background:sel?`${p.color}25`:"transparent",
                    display:"flex",alignItems:"center",gap:5}}>
                  <span>{WINDS_MAP[p.windId]||"🀀"}</span>
                  <span style={{fontSize:12,fontWeight:600,color:sel?p.color:"rgba(200,180,160,0.7)"}}>{p.name}</span>
                  {p.windId==="E"&&<span style={{fontSize:10,color:"#F5C97A"}}>×2</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── HOME ──
  if (mode === "home") return (
    <div>
      {winnerBlock}

      <div style={{background:"#1A1712",borderRadius:16,border:`1.5px solid ${game.color}50`,padding:20,marginBottom:12}}>
        <div style={{fontSize:15,fontWeight:700,color:"#F0E8DC",marginBottom:4}}>Photo of the hand</div>
        <div style={{fontSize:12,color:game.accent,fontWeight:600,marginBottom:8}}>Optional · Claude fills the checklist</div>
        <div style={{fontSize:13,color:"rgba(200,180,160,0.55)",lineHeight:1.6,marginBottom:16}}>
          Photograph the winning tiles. You can still change every answer before the total is calculated.
        </div>
        {analysisError && (
          <div style={{background:"rgba(220,80,80,0.12)",border:"0.5px solid rgba(220,80,80,0.3)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#E05050"}}>{analysisError}</div>
        )}
        <button onClick={()=>{ setMode("camera"); setTimeout(startCamera,100); }}
          style={{width:"100%",padding:13,background:game.color,border:"none",borderRadius:12,color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Open camera
        </button>
      </div>

      <div style={{background:"#1A1712",borderRadius:16,border:"0.5px solid rgba(255,255,255,0.08)",padding:20}}>
        <div style={{fontSize:15,fontWeight:700,color:"#F0E8DC",marginBottom:6}}>Answer the questions</div>
        <div style={{fontSize:13,color:"rgba(200,180,160,0.55)",lineHeight:1.6,marginBottom:12}}>Skip the photo and score the hand yourself.</div>
        <button onClick={()=>{ setPrefilledAnswers(buildWindPrefill({}, selectedWinner)); setAiResult(null); setMode("wizard"); }}
          style={{width:"100%",padding:12,background:"transparent",border:`1px solid ${game.color}55`,borderRadius:12,color:game.accent,fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Start wizard
        </button>
      </div>
    </div>
  );

  // ── CAMERA ──
  if (mode === "camera") return (
    <div>
      <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Photograph the winning hand</div>
      <div style={{background:"#1A1712",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:"rgba(200,180,160,0.5)",lineHeight:1.6}}>
        💡 <strong style={{color:"rgba(200,180,160,0.7)"}}>Tips:</strong> Good lighting · All 17 tiles face-up · Flowers visible · Avoid glare
      </div>
      {cameraActive && (
        <div>
          <div style={{position:"relative",borderRadius:14,overflow:"hidden",marginBottom:12}}>
            <video ref={videoRef} autoPlay playsInline muted
              style={{width:"100%",height:"220px",objectFit:"cover",display:"block",borderRadius:14,background:"#000"}}
            />
            <div style={{position:"absolute",inset:0,border:`2px solid ${game.color}`,borderRadius:14,pointerEvents:"none"}}/>
            {/* Corner guides */}
            {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i)=>(
              <div key={i} style={{position:"absolute",width:20,height:20,
                top:x===0?8:"auto",bottom:x===1?8:"auto",
                left:y===0?8:"auto",right:y===1?8:"auto",
                borderTop:x===0?`3px solid ${game.color}`:"none",
                borderBottom:x===1?`3px solid ${game.color}`:"none",
                borderLeft:y===0?`3px solid ${game.color}`:"none",
                borderRight:y===1?`3px solid ${game.color}`:"none",
              }}/>
            ))}
            <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.7)",borderRadius:20,padding:"5px 14px",fontSize:12,color:game.accent,whiteSpace:"nowrap"}}>
              Show all 17 tiles clearly
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{stopCamera();setMode("home");}}
              style={{flex:1,padding:11,background:"none",border:"0.5px solid rgba(220,80,80,0.4)",borderRadius:10,color:"#E05050",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
            <button onClick={takePhotoAndAnalyse}
              style={{flex:2,padding:11,background:game.color,border:"none",borderRadius:10,color:"#0E0C0A",fontSize:15,fontWeight:700,cursor:"pointer"}}>
              📸 Capture & Analyse
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── ANALYSING ──
  if (mode === "analysing") return (
    <div style={{textAlign:"center",padding:"32px 16px"}}>
      {capturedThumb && (
        <div style={{marginBottom:20,borderRadius:12,overflow:"hidden",
          border:`1px solid ${game.color}40`,height:220}}>
          <img src={capturedThumb} alt="captured hand"
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",opacity:0.7}}/>
        </div>
      )}
      <div style={{fontSize:32,marginBottom:12}}>🀄</div>
      <div style={{fontSize:16,fontWeight:700,color:"#F0E8DC",marginBottom:6}}>Analysing tiles…</div>
      <div style={{fontSize:13,color:"rgba(200,180,160,0.5)",lineHeight:1.7}}>
        Claude is identifying your tiles,<br/>detecting flowers, dragons, and hand patterns.
      </div>
      {/* Animated dots */}
      <div style={{marginTop:20,display:"flex",justifyContent:"center",gap:8}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:game.color,opacity:0.4,animation:`pulse${i} 1.2s ${i*0.4}s ease-in-out infinite`}}/>
        ))}
      </div>
      <style>{`
        @keyframes pulse0{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes pulse1{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes pulse2{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        div[style*="pulse0"]{animation:pulse0 1.2s 0s ease-in-out infinite}
        div[style*="pulse1"]{animation:pulse1 1.2s 0.4s ease-in-out infinite}
        div[style*="pulse2"]{animation:pulse2 1.2s 0.8s ease-in-out infinite}
      `}</style>
    </div>
  );

    // ── REVIEW AI RESULT ──
  if (mode === "review" && aiResult) {
    const confColor = aiResult.confidence==="high"?"#8FBC8F":aiResult.confidence==="medium"?game.accent:"#E05050";
    const confLabel = aiResult.confidence==="high"?"High confidence":aiResult.confidence==="medium"?"Medium — review answers":"Low confidence — check carefully";
    const tilesOk = aiResult.tiles_visible !== false;

    return (
      <div>
        {/* Thumbnail — cropped to same 220px height as preview */}
        {capturedThumb && (
          <div style={{borderRadius:12,overflow:"hidden",
            border:`1px solid ${game.color}40`,marginBottom:14,height:220}}>
            <img src={capturedThumb} alt="captured hand"
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          </div>
        )}

        {/* ── NOT ENOUGH TILES warning ── */}
        {tilesOk && aiResult.tile_count !== undefined && aiResult.tile_count < 17 && (
          <div style={{background:"rgba(220,80,80,0.12)",border:"1px solid rgba(220,80,80,0.4)",
            borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:700,color:"#E05050",marginBottom:6}}>
              ⚠️ Only {aiResult.tile_count} tiles detected — need 17
            </div>
            <div style={{fontSize:13,color:"rgba(220,160,160,0.85)",lineHeight:1.6,marginBottom:6}}>
              This would be a <strong style={{color:"#E05050"}}>False Mahjong</strong> — a valid winning hand requires exactly 17 tiles (16 hand tiles + winning tile, plus any flower tiles).
            </div>
            <div style={{fontSize:12,color:"rgba(200,160,160,0.65)",lineHeight:1.7,marginBottom:12}}>
              Make sure all tiles are visible in the photo, including:
              {"\n"}• The winning tile (placed horizontally)
              {"\n"}• All flower tiles (placed to the side)
              {"\n"}• No tiles are hidden behind others
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{ setMode("camera"); setTimeout(startCamera,100); setCapturedThumb(null); setAiResult(null); }}
                style={{flex:1,padding:10,background:game.color,border:"none",borderRadius:8,
                  color:"#0E0C0A",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                📷 Retake photo
              </button>
              <button onClick={()=>{ setPrefilledAnswers(buildWindPrefill({}, selectedWinner)); setMode("wizard"); }}
                style={{flex:1,padding:10,background:"none",border:`0.5px solid ${game.color}50`,
                  borderRadius:8,color:game.accent,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                Score manually
              </button>
            </div>
          </div>
        )}

        {/* Tiles not visible warning */}
        {!tilesOk && (
          <div style={{background:"rgba(220,80,80,0.12)",border:"1px solid rgba(220,80,80,0.4)",
            borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:700,color:"#E05050",marginBottom:4}}>⚠️ Tiles not clearly visible</div>
            <div style={{fontSize:12,color:"rgba(220,160,160,0.8)",lineHeight:1.6,marginBottom:10}}>
              The photo didn't show enough tiles to analyse. Try again with:
            </div>
            <div style={{fontSize:12,color:"rgba(220,160,160,0.7)",lineHeight:1.8}}>
              • All 17 tiles laid flat and face-up{"\n"}
              • Good lighting, no shadows{"\n"}
              • Camera closer to the tiles{"\n"}
              • Avoid glare on the tile surface
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={()=>{ setMode("camera"); setTimeout(startCamera,100); setCapturedThumb(null); setAiResult(null); }}
                style={{flex:1,padding:10,background:game.color,border:"none",borderRadius:8,
                  color:"#0E0C0A",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                📷 Retake photo
              </button>
              <button onClick={()=>{ setPrefilledAnswers(buildWindPrefill({}, selectedWinner)); setMode("wizard"); }}
                style={{flex:1,padding:10,background:"none",border:`0.5px solid ${game.color}50`,borderRadius:8,
                  color:game.accent,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                Score manually
              </button>
            </div>
          </div>
        )}

        {/* AI summary — only if tiles visible AND count is valid */}
        {tilesOk && (aiResult.tile_count === undefined || aiResult.tile_count >= 17) && (
          <div>
            <div style={{background:"#1A1712",borderRadius:12,border:`1px solid ${game.color}40`,padding:14,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700,color:"#F0E8DC"}}>🤖 AI Analysis</div>
                <div style={{fontSize:11,fontWeight:700,color:confColor,background:`${confColor}18`,padding:"2px 8px",borderRadius:10}}>{confLabel}</div>
              </div>
              <div style={{fontSize:13,color:"rgba(200,180,160,0.7)",lineHeight:1.6,marginBottom:12}}>{aiResult.ai_notes}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {aiResult.flower_count>0&&<Chip label={`🌸 ${aiResult.flower_count} flower${aiResult.flower_count>1?"s":""}`} color={game.color}/>}
                {aiResult.flower_count===0&&<Chip label="No flowers" color="#5A8A6A"/>}
                {aiResult.suit_type&&<Chip label={{"pure":"Pure Suit","semi_pure":"Semi Pure","two_suit":"2 Suits","two_suit_clean":"2 Suits Clean","all_five":"All 5 Suits","mixed":"Mixed"}[aiResult.suit_type]||aiResult.suit_type} color={game.color}/>}
                {aiResult.hand_type&&<Chip label={{"all_sheung":"All Sheung","all_pong":"All Pong","special":"Special Hand","mixed":"Mixed"}[aiResult.hand_type]||aiResult.hand_type} color={game.color}/>}
                {aiResult.pong_dragon>0&&<Chip label={`${aiResult.pong_dragon} Dragon Pong`} color="#C8923A"/>}
                {aiResult.pong_wind>0&&<Chip label={`${aiResult.pong_wind} Wind Pong`} color="#5B4A9E"/>}
                {aiResult.good_eye&&<Chip label="Good Eye (2/5/8)" color="#8FBC8F"/>}
                {aiResult.special_hand&&aiResult.special_hand!=="none"&&<Chip label={aiResult.special_hand.toUpperCase()} color="#E05050"/>}
                {aiResult.dragon_run&&aiResult.dragon_run!=="none"&&<Chip label="Dragon Run" color="#C8923A"/>}
              </div>
            </div>

            <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginBottom:12,lineHeight:1.6}}>
              Pre-filled from photo. Review and adjust any answers in the wizard.
            </div>

            {/* Winner picker */}
            {players.length > 0 && (
              <div style={{background:"#1A1712",borderRadius:10,border:"0.5px solid rgba(255,255,255,0.08)",padding:12,marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Who won?</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {players.map(p=>{
                    const WINDS_MAP = {E:"🀀",S:"🀁",W:"🀂",N:"🀃"};
                    const isSelected = selectedWinner===p.id;
                    return (
                      <button key={p.id} onClick={()=>setSelectedWinner(p.id)}
                        style={{padding:"6px 12px",borderRadius:20,
                          border:`1.5px solid ${isSelected?p.color:"rgba(255,255,255,0.1)"}`,
                          background:isSelected?`${p.color}25`:"transparent",
                          cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontSize:13}}>{WINDS_MAP[p.windId]||"🀀"}</span>
                        <span style={{fontSize:12,fontWeight:isSelected?700:500,
                          color:isSelected?p.color:"rgba(200,180,160,0.6)"}}>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <button onClick={()=>{ setMode("camera"); setTimeout(startCamera,100); setCapturedThumb(null); setAiResult(null); }}
                style={{flex:1,padding:10,background:"none",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:10,color:"rgba(200,180,160,0.5)",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                Retake
              </button>
              <button onClick={()=>{ setPrefilledAnswers(buildWindPrefill(prefilledAnswers, selectedWinner)); setMode("wizard"); }}
                style={{flex:2,padding:10,background:game.color,border:"none",borderRadius:10,color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Continue to scoring →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── WIZARD ──
  if (mode === "wizard") return (
    <div>
      {aiResult && (
        <div style={{background:`${game.color}12`,border:`0.5px solid ${game.color}40`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontSize:11,color:game.accent,fontWeight:600,marginBottom:4}}>🤖 AI pre-filled answers from your photo</div>
          <div style={{fontSize:12,color:"rgba(200,180,160,0.55)"}}>Questions already answered by AI are marked. You can change any answer.</div>
        </div>
      )}
      <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Dubai Scoring Wizard</div>
      <DxbWizard
        accentColor={game.color}
        accent={game.accent}
        prefilled={prefilledAnswers}
        aiResult={aiResult}
        onDone={(score)=>{
          finishScore(score);
          setMode("home");
          setAiResult(null);
          setCapturedThumb(null);
          setPrefilledAnswers({});
        }}
      />
      <button onClick={()=>setMode("home")}
        style={{marginTop:12,width:"100%",padding:10,background:"none",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(200,180,160,0.5)",fontSize:12,cursor:"pointer"}}>
        ← Back
      </button>
    </div>
  );

  return null;
}

// Small chip component for AI summary
function Chip({ label, color }) {
  return (
    <div style={{fontSize:11,fontWeight:600,color:color,background:`${color}18`,border:`0.5px solid ${color}40`,borderRadius:12,padding:"3px 9px"}}>
      {label}
    </div>
  );
}

// ─── GAMES DATA ───────────────────────────────────────────────────────────────

const GAMES = [
  {
    id:"dubai", name:"Dubai Style", sub:"16-tile · Taiwanese variant",
    tiles:144, tileHand:16, winHand:17, unit:"Points",
    color:"#C8923A", accent:"#F5C97A",
    description:"Dubai community Taiwanese Mahjong. 16 tiles (17 to win). Additive point scoring from the Dubai 2025 Rulebook. Uses Sheung/Pong/Gong terminology. Includes Closing, Chasing, Nico Nico, Jade/Ruby/Diamond and more.",
  },
  {
    id:"taiwanese", name:"Taiwanese", sub:"16-tile · 台灣麻將",
    tiles:144, tileHand:16, winHand:17, unit:"Tai (台)",
    color:"#4A7FA5", accent:"#88C0D0",
    description:"Standard Taiwanese Mahjong. 16-tile hand (17 to win). Linear tai scoring — additive, no minimum required. Self-draw pays 3× from all opponents.",
  },
  {
    id:"hk", name:"Hong Kong", sub:"13-tile · 粵語",
    tiles:144, tileHand:13, winHand:14, unit:"Faan",
    color:"#7A5C8C", accent:"#B794C4",
    description:"Most widely played. 13-tile hand (14 to win). Exponential faan scoring — doubles per faan, minimum 3 faan to win.",
  },
  {
    id:"riichi", name:"Japanese Riichi", sub:"13-tile · RCR",
    tiles:136, tileHand:13, winHand:14, unit:"Han + Fu",
    color:"#5A8A6A", accent:"#8FBC8F",
    description:"Competitive variant. 13-tile hand. Requires ≥1 yaku. Features Riichi bet, Dora tiles, Furiten rule.",
  },
];

// ─── DUBAI SCORING REFERENCE ─────────────────────────────────────────────────
const DXB_REF = [
  { section:"Always Add First", items:[{name:"Mahjong / Winning",pts:5},{name:"Closing / Calling your hand",pts:5}] },
  { section:"Winning Tile", items:[{name:"East / Dealer wins (or East discards)",pts:1},{name:"Self Pick from Wall",pts:5},{name:"Self Pick from Flower Wall",pts:10},{name:"Concealed Hand — Discard win",pts:10},{name:"Concealed Hand — Self Pick",pts:15},{name:"Fully Exposed — Discard win",pts:10},{name:"Fully Exposed — Self Pick",pts:15},{name:"Win within 7 tiles in the sea",pts:50},{name:"Seabed — last tile from wall",pts:20},{name:"Earthly — first discard by East",pts:90},{name:"Heavenly — dealer on deal",pts:100}] },
  { section:"Flowers", items:[{name:"Each Flower tile",pts:1},{name:"Flower of player's seat (+1 bonus each)",pts:"+1"},{name:"Mixed Bouquet (red+blue 1-4)",pts:5},{name:"Pure Bouquet (full set same colour)",pts:10},{name:"7 Flowers — Instant Win",pts:20},{name:"8 Flowers — Instant Win",pts:40},{name:"No Flowers",pts:1},{name:"No Honour tiles",pts:1},{name:"No Flowers AND No Honours",pts:5},{name:"No Flowers/Honours in All Sheung",pts:15}] },
  { section:"Pair / Eyes", items:[{name:"Good Eyes — pair of 2s, 5s, or 8s (any suit)",pts:2},{name:"True Single Wait",pts:2},{name:"Calling by Pairs",pts:2}] },
  { section:"Suit Hands", items:[{name:"Two Suit Hand (with flowers allowed)",pts:8},{name:"Two Suit — No Honours, No Flowers",pts:15},{name:"Semi Pure — One Suit + Honours",pts:30},{name:"Pure Suit — One Suit Only",pts:90},{name:"All 5 Suits (3 suits + winds + dragons)",pts:10}] },
  { section:"Sheung (Sequence) Hands", items:[{name:"All Sheung Hand",pts:5},{name:"All Sheung — No Honours, No Flowers",pts:15},{name:"Step Up (3 sequential sheungs, any suit)",pts:5},{name:"All Step Up (5 sheungs)",pts:20},{name:"All Step Up — Same Suit",pts:90}] },
  { section:"Dragon Run (1-9 complete run)", items:[{name:"Mixed Dragon — Exposed/Partial",pts:8},{name:"Mixed Dragon — Concealed",pts:10},{name:"Pure Dragon — Exposed/Partial",pts:15},{name:"Pure Dragon — Concealed",pts:20}] },
  { section:"Brothers (Same Suit Sheungs)", items:[{name:"2 Sets Brother Sheungs",pts:5},{name:"3 Sets Brother Sheungs",pts:15},{name:"4 Sets Brother Sheungs",pts:30}] },
  { section:"Sisters (Diff Suit Same Sheungs)", items:[{name:"2 Sets Sister Sheungs",pts:5},{name:"3 Sets Sister Sheungs",pts:15},{name:"4 Sets Sister Sheungs",pts:30},{name:"5 Sets Sister Sheungs",pts:50}] },
  { section:"Pong (Triplet) Hands", items:[{name:"All Pong Hand (5 pongs + pair)",pts:25}] },
  { section:"Winds (per Pong)", items:[{name:"Pong of any Wind",pts:1},{name:"+1 if it's your Seat Wind",pts:"+1"},{name:"+1 if it's the Round Wind",pts:"+1"},{name:"Little 3 Winds (2 pongs + pair)",pts:15},{name:"Big 3 Winds (3 pongs)",pts:30},{name:"Little 4 Winds (3 pongs + pair)",pts:60},{name:"Big 4 Winds (4 pongs)",pts:80}] },
  { section:"Dragons (per Pong)", items:[{name:"Pong of any Dragon",pts:2},{name:"Little Dragon (2 pongs + pair)",pts:20},{name:"Big Dragon (3 pongs)",pts:40}] },
  { section:"Sister Pongs (Diff Suit)", items:[{name:"2 Sets Sister Pongs",pts:5},{name:"3 Sets Sister Pongs",pts:15}] },
  { section:"Uncle Pongs (Same Suit Sequential)", items:[{name:"111+222 (2 sets)",pts:5},{name:"111+222+333 (3 sets)",pts:15},{name:"...+444 (4 sets)",pts:30},{name:"...+555 (5 sets)",pts:60},{name:"...+55+66 pair (5+pair)",pts:80}] },
  { section:"Concealed Pongs", items:[{name:"2 Concealed Pongs",pts:5},{name:"3 Concealed Pongs",pts:15},{name:"4 Concealed Pongs",pts:30},{name:"5 Concealed Pongs",pts:80},{name:"5 Concealed Pongs — Self Draw, No Gong",pts:100}] },
  { section:"Gong (Kong = 4 of same)", items:[{name:"Open Gong (counts as 1 Concealed Pong)",pts:1},{name:"Concealed Gong (+collect 5 pts each immediately)",pts:1},{name:"Win by Robbing a Gong",pts:10},{name:"Win by Self Drawing a Gong",pts:30},{name:"Four in 2 Ways (same 4 tiles = Sheung+Pong)",pts:5},{name:"Four in 3 Ways (2 Sheungs + pair)",pts:15},{name:"Four in 4 Ways (4 Sheungs)",pts:20}] },
  { section:"Terminals (1s and 9s)", items:[{name:"No Terminal Tiles (with honours OK)",pts:5},{name:"No Terminals AND No Honours",pts:8},{name:"All Terminals WITH Honours",pts:20},{name:"All Terminals — No Honours",pts:40},{name:"1×Terminal Pong Set (111+999 same suit)",pts:5},{name:"2×Terminal Pong Sets (mix)",pts:20},{name:"1×Terminal Sheung (123+789 same suit)",pts:5},{name:"2×Terminal Pure Sheung Sets",pts:20}] },
  { section:"Special Hands", items:[{name:"Nico Nico (7 pairs + 1 pong) — No Closing",pts:40},{name:"Nico Nico + 1 Gong",pts:"+10"},{name:"Nico Nico + 2 Gongs",pts:"+25"},{name:"13 Orphans — No Closing",pts:90},{name:"16 Orphans — No Closing",pts:50},{name:"16 Orphans with 1s & 9s in all suits",pts:"+10"},{name:"Jade Hand (Green Dragon pong + all Bamboo)",pts:20},{name:"Ruby Hand (Red Dragon pong + all Characters)",pts:20},{name:"Diamond Hand (White Dragon pong + all Circles)",pts:20}] },
  { section:"Penalties", items:[{name:"False Mahjong (game ends, same dealer)",pts:-25},{name:"Chasing Wind/Dragon Tiles",pts:-5},{name:"Chasing Suit Tiles",pts:-10}] },
];

// ─── HANDS DATA ───────────────────────────────────────────────────────────────

const DXB_HANDS = [
  { name:"Sheung (Sequence)", pts:"—", cat:"basic", desc:"3 consecutive tiles in the same suit. Can only claim from the player to your right.",
    groups:[{label:"sheung",tiles:[{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}]},{label:"sheung",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"sheung",tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}]},{label:"sheung",tiles:[{suit:"man",n:7},{suit:"man",n:8},{suit:"man",n:9}]},{label:"sheung",tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}]},{label:"pair",tiles:[{suit:"bam",n:7},{suit:"bam",n:7}]}]},
  { name:"Pong (Triplet)", pts:"—", cat:"basic", desc:"3 identical tiles. Can be claimed from any player's discard.",
    groups:[{label:"pong",tiles:[{suit:"man",n:4},{suit:"man",n:4},{suit:"man",n:4}]},{label:"sheung",tiles:[{suit:"pin",n:5},{suit:"pin",n:6},{suit:"pin",n:7}]},{label:"sheung",tiles:[{suit:"bam",n:3},{suit:"bam",n:4},{suit:"bam",n:5}]},{label:"sheung",tiles:[{suit:"man",n:1},{suit:"man",n:2},{suit:"man",n:3}]},{label:"sheung",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"pair",tiles:[{suit:"bam",n:9},{suit:"bam",n:9}]}]},
  { name:"Gong (Kong = 4 tiles)", pts:1, cat:"basic", desc:"4 identical tiles. Open Gong = 1 Concealed Pong. Immediately draw replacement tile.",
    groups:[{label:"open gong +1pt",tiles:[{suit:"bam",n:7},{suit:"bam",n:7},{suit:"bam",n:7},{suit:"bam",n:7}]},{label:"sheung",tiles:[{suit:"man",n:2},{suit:"man",n:3},{suit:"man",n:4}]},{label:"sheung",tiles:[{suit:"pin",n:5},{suit:"pin",n:6},{suit:"pin",n:7}]},{label:"sheung",tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}]},{label:"sheung",tiles:[{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}]},{label:"pair",tiles:[{suit:"pin",n:1},{suit:"pin",n:1}]}]},
  { name:"All Sheung (All Sequences)", pts:5, cat:"sheung", desc:"All 5 melds are sheungs (sequences). Honours and flowers allowed.",
    groups:[{label:"sheung",tiles:[{suit:"man",n:1},{suit:"man",n:2},{suit:"man",n:3}]},{label:"sheung",tiles:[{suit:"pin",n:4},{suit:"pin",n:5},{suit:"pin",n:6}]},{label:"sheung",tiles:[{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4}]},{label:"sheung",tiles:[{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}]},{label:"sheung",tiles:[{suit:"pin",n:7},{suit:"pin",n:8},{suit:"pin",n:9}]},{label:"pair",tiles:[{suit:"bam",n:6},{suit:"bam",n:6}]}]},
  { name:"Step-Up Sheung", pts:5, cat:"sheung", desc:"3 sheungs each stepping 1 number up. Any suit combo. Claim once only per hand.",
    groups:[{label:"sheung 1",tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}]},{label:"sheung 2 (+1)",tiles:[{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}]},{label:"sheung 3 (+1)",tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}]},{label:"sheung",tiles:[{suit:"man",n:7},{suit:"man",n:8},{suit:"man",n:9}]},{label:"sheung",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"pair",tiles:[{suit:"bam",n:8},{suit:"bam",n:8}]}]},
  { name:"All Step-Up Hand", pts:20, cat:"sheung", desc:"All 5 melds are sheungs stepping up in order. Can be exposed or concealed.",
    groups:[{label:"step 1",tiles:[{suit:"man",n:2},{suit:"man",n:3},{suit:"man",n:4}]},{label:"step 2",tiles:[{suit:"pin",n:3},{suit:"pin",n:4},{suit:"pin",n:5}]},{label:"step 3",tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}]},{label:"step 4",tiles:[{suit:"man",n:5},{suit:"man",n:6},{suit:"man",n:7}]},{label:"step 5",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"pair",tiles:[{suit:"bam",n:9},{suit:"bam",n:9}]}]},
  { name:"Mixed Dragon Run", pts:8, cat:"dragon", desc:"Complete 1-9 run across ALL three suits. Exposed or partially concealed.",
    groups:[{label:"1-3 (pin)",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"4-6 (man)",tiles:[{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6}]},{label:"7-9 (bam)",tiles:[{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}]},{label:"sheung",tiles:[{suit:"man",n:2},{suit:"man",n:3},{suit:"man",n:4}]},{label:"sheung",tiles:[{suit:"pin",n:5},{suit:"pin",n:6},{suit:"pin",n:7}]},{label:"pair",tiles:[{suit:"bam",n:5},{suit:"bam",n:5}]}]},
  { name:"Pure Dragon Run — Concealed", pts:20, cat:"dragon", desc:"Complete 1-9 run all in the same suit. Fully concealed = 20 pts.",
    groups:[{label:"1-2-3",tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}]},{label:"4-5-6",tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}]},{label:"7-8-9",tiles:[{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}]},{label:"sheung",tiles:[{suit:"pin",n:3},{suit:"pin",n:4},{suit:"pin",n:5}]},{label:"sheung",tiles:[{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}]},{label:"pair",tiles:[{suit:"bam",n:5},{suit:"bam",n:5}]}]},
  { name:"Sister Sheungs (2 sets)", pts:5, cat:"sisters", desc:"Two sheungs with the same numbers but different suits.",
    groups:[{label:"678 pin",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"678 man",tiles:[{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}]},{label:"sheung",tiles:[{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4}]},{label:"sheung",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"sheung",tiles:[{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}]},{label:"pair",tiles:[{suit:"bam",n:9},{suit:"bam",n:9}]}]},
  { name:"Sister Sheungs (5 sets)", pts:50, cat:"sisters", desc:"ALL five melds are the same sheung in different suits. Very rare!",
    groups:[{label:"678 bam",tiles:[{suit:"bam",n:6},{suit:"bam",n:7},{suit:"bam",n:8}]},{label:"678 pin",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"678 man",tiles:[{suit:"man",n:6},{suit:"man",n:7},{suit:"man",n:8}]},{label:"678 bam",tiles:[{suit:"bam",n:6},{suit:"bam",n:7},{suit:"bam",n:8}]},{label:"678 pin",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"pair",tiles:[{suit:"bam",n:1},{suit:"bam",n:1}]}]},
  { name:"All Pong Hand", pts:25, cat:"pong", desc:"All 5 melds are Pongs (triplets). No sheungs allowed.",
    groups:[{label:"pong",tiles:[{suit:"man",n:3},{suit:"man",n:3},{suit:"man",n:3}]},{label:"pong",tiles:[{suit:"pin",n:7},{suit:"pin",n:7},{suit:"pin",n:7}]},{label:"pong",tiles:[{suit:"bam",n:2},{suit:"bam",n:2},{suit:"bam",n:2}]},{label:"pong",tiles:[{suit:"man",n:9},{suit:"man",n:9},{suit:"man",n:9}]},{label:"pong",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]},{label:"pair",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"}]}]},
  { name:"Little Dragon (小三元)", pts:20, cat:"dragon_hon", desc:"Two dragon pongs + one dragon pair.",
    groups:[{label:"pong 發 +2",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]},{label:"pong 中 +2",tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"}]},{label:"sheung",tiles:[{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}]},{label:"sheung",tiles:[{suit:"bam",n:6},{suit:"bam",n:7},{suit:"bam",n:8}]},{label:"sheung",tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}]},{label:"pair 白",tiles:[{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}]}]},
  { name:"Big Dragon (大三元)", pts:40, cat:"dragon_hon", desc:"All three dragon pongs. Plus 2 pts each = 6 pts dragon bonus.",
    groups:[{label:"pong 發 +2",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]},{label:"pong 中 +2",tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"}]},{label:"pong 白 +2",tiles:[{suit:"dragon",n:"W"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}]},{label:"sheung",tiles:[{suit:"man",n:3},{suit:"man",n:4},{suit:"man",n:5}]},{label:"sheung",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"pair",tiles:[{suit:"bam",n:4},{suit:"bam",n:4}]}]},
  { name:"Little 4 Winds (小四喜)", pts:60, cat:"wind_hon", desc:"Three wind pongs + one wind pair.",
    groups:[{label:"pong 東 +1",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]},{label:"pong 南 +1",tiles:[{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"}]},{label:"pong 西 +1",tiles:[{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"}]},{label:"sheung",tiles:[{suit:"man",n:2},{suit:"man",n:3},{suit:"man",n:4}]},{label:"sheung",tiles:[{suit:"bam",n:5},{suit:"bam",n:6},{suit:"bam",n:7}]},{label:"pair 北",tiles:[{suit:"wind",n:"N"},{suit:"wind",n:"N"}]}]},
  { name:"Big 4 Winds (大四喜)", pts:80, cat:"wind_hon", desc:"All four wind pongs. The biggest wind hand.",
    groups:[{label:"pong 東",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]},{label:"pong 南",tiles:[{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"}]},{label:"pong 西",tiles:[{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"}]},{label:"pong 北",tiles:[{suit:"wind",n:"N"},{suit:"wind",n:"N"},{suit:"wind",n:"N"}]},{label:"sheung",tiles:[{suit:"man",n:5},{suit:"man",n:6},{suit:"man",n:7}]},{label:"pair",tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"}]}]},
  { name:"Pure Suit (清一色)", pts:90, cat:"suit", desc:"All tiles in one suit only. No winds, no dragons, no flowers.",
    groups:[{label:"sheung pin",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"pong pin",tiles:[{suit:"pin",n:5},{suit:"pin",n:5},{suit:"pin",n:5}]},{label:"sheung pin",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"sheung pin",tiles:[{suit:"pin",n:3},{suit:"pin",n:4},{suit:"pin",n:5}]},{label:"sheung pin",tiles:[{suit:"pin",n:7},{suit:"pin",n:8},{suit:"pin",n:9}]},{label:"pair",tiles:[{suit:"pin",n:2},{suit:"pin",n:2}]}]},
  { name:"Semi Pure (半色)", pts:30, cat:"suit", desc:"One suit + honour tiles (winds/dragons). Add 30 pts on top of hand.",
    groups:[{label:"sheung bam",tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}]},{label:"pong bam",tiles:[{suit:"bam",n:5},{suit:"bam",n:5},{suit:"bam",n:5}]},{label:"sheung bam",tiles:[{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}]},{label:"pong 發 +2",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]},{label:"sheung bam",tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}]},{label:"pair wind",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"}]}]},
  { name:"Nico Nico (7 pairs + pong)", pts:40, cat:"special", desc:"7 pairs + 1 pong. Fully concealed. All tiles self-drawn except mahjong tile. No Closing allowed.",
    groups:[{label:"7 pairs",tiles:[{suit:"man",n:2},{suit:"man",n:2},{suit:"pin",n:4},{suit:"pin",n:4},{suit:"bam",n:6},{suit:"bam",n:6},{suit:"man",n:8},{suit:"man",n:8},{suit:"pin",n:1},{suit:"pin",n:1},{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}]},{label:"pong",tiles:[{suit:"bam",n:9},{suit:"bam",n:9},{suit:"bam",n:9}]}]},
  { name:"13 Orphans", pts:90, cat:"special", desc:"1&9 all suits + all winds + all dragons + Pong/Sheung + 1 honour as pair. Fully concealed, no closing.",
    groups:[{label:"terminals",tiles:[{suit:"pin",n:1},{suit:"pin",n:9},{suit:"man",n:1},{suit:"man",n:9},{suit:"bam",n:1},{suit:"bam",n:9}]},{label:"all winds",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"N"}]},{label:"all dragons",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"R"},{suit:"dragon",n:"W"}]}]},
  { name:"Jade Hand", pts:20, cat:"special", desc:"Pong of Green Dragons + ALL other tiles must be Bamboo. Add Semi Pure (30 pts) too!",
    groups:[{label:"pong 發",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]},{label:"sheung bam",tiles:[{suit:"bam",n:1},{suit:"bam",n:2},{suit:"bam",n:3}]},{label:"sheung bam",tiles:[{suit:"bam",n:4},{suit:"bam",n:5},{suit:"bam",n:6}]},{label:"pong bam",tiles:[{suit:"bam",n:8},{suit:"bam",n:8},{suit:"bam",n:8}]},{label:"sheung bam",tiles:[{suit:"bam",n:7},{suit:"bam",n:8},{suit:"bam",n:9}]},{label:"pair bam",tiles:[{suit:"bam",n:2},{suit:"bam",n:2}]}]},
  { name:"Ruby Hand", pts:20, cat:"special", desc:"Pong of Red Dragons + ALL other tiles must be Characters. Add Semi Pure (30 pts) too!",
    groups:[{label:"pong 中",tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"},{suit:"dragon",n:"R"}]},{label:"sheung man",tiles:[{suit:"man",n:1},{suit:"man",n:2},{suit:"man",n:3}]},{label:"sheung man",tiles:[{suit:"man",n:4},{suit:"man",n:5},{suit:"man",n:6}]},{label:"pong man",tiles:[{suit:"man",n:9},{suit:"man",n:9},{suit:"man",n:9}]},{label:"sheung man",tiles:[{suit:"man",n:7},{suit:"man",n:8},{suit:"man",n:9}]},{label:"pair man",tiles:[{suit:"man",n:5},{suit:"man",n:5}]}]},
  { name:"Diamond Hand", pts:20, cat:"special", desc:"Pong of White Dragons + ALL other tiles must be Circles. Add Semi Pure (30 pts) too!",
    groups:[{label:"pong 白",tiles:[{suit:"dragon",n:"W"},{suit:"dragon",n:"W"},{suit:"dragon",n:"W"}]},{label:"sheung pin",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"sheung pin",tiles:[{suit:"pin",n:4},{suit:"pin",n:5},{suit:"pin",n:6}]},{label:"sheung pin",tiles:[{suit:"pin",n:7},{suit:"pin",n:8},{suit:"pin",n:9}]},{label:"pong pin",tiles:[{suit:"pin",n:5},{suit:"pin",n:5},{suit:"pin",n:5}]},{label:"pair pin",tiles:[{suit:"pin",n:2},{suit:"pin",n:2}]}]},
];

const DXB_CATS = [
  {id:"all",label:"All"},{id:"basic",label:"Basic"},{id:"sheung",label:"Sheung"},
  {id:"dragon",label:"Dragon Run"},{id:"sisters",label:"Sisters"},{id:"pong",label:"Pong"},
  {id:"dragon_hon",label:"Dragons"},{id:"wind_hon",label:"Winds"},{id:"suit",label:"Suit"},
  {id:"special",label:"Special"},
];

const TW_HANDS_SHORT = [
  { name:"Self-Draw (自摸)", tai:"1 tai", desc:"Win by drawing tile from wall.",
    groups:[{label:"self pick",tiles:[{suit:"man",n:5},{suit:"man",n:6},{suit:"man",n:7}]},{label:"chow",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"pung",tiles:[{suit:"bam",n:3},{suit:"bam",n:3},{suit:"bam",n:3}]},{label:"chow",tiles:[{suit:"man",n:2},{suit:"man",n:3},{suit:"man",n:4}]},{label:"chow",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"pair",tiles:[{suit:"bam",n:8},{suit:"bam",n:8}]}]},
  { name:"All Pungs (碰碰胡)", tai:"10 tai", desc:"All melds are pungs/kongs.",
    groups:[{label:"pung",tiles:[{suit:"man",n:4},{suit:"man",n:4},{suit:"man",n:4}]},{label:"pung",tiles:[{suit:"pin",n:7},{suit:"pin",n:7},{suit:"pin",n:7}]},{label:"pung",tiles:[{suit:"bam",n:2},{suit:"bam",n:2},{suit:"bam",n:2}]},{label:"pung",tiles:[{suit:"man",n:9},{suit:"man",n:9},{suit:"man",n:9}]},{label:"pung",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]},{label:"pair",tiles:[{suit:"dragon",n:"G"},{suit:"dragon",n:"G"}]}]},
  { name:"Full Flush (清一色)", tai:"40 tai", desc:"All tiles one suit, no honours.",
    groups:[{label:"chow",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"chow",tiles:[{suit:"pin",n:4},{suit:"pin",n:5},{suit:"pin",n:6}]},{label:"pung",tiles:[{suit:"pin",n:7},{suit:"pin",n:7},{suit:"pin",n:7}]},{label:"chow",tiles:[{suit:"pin",n:7},{suit:"pin",n:8},{suit:"pin",n:9}]},{label:"chow",tiles:[{suit:"pin",n:2},{suit:"pin",n:3},{suit:"pin",n:4}]},{label:"pair",tiles:[{suit:"pin",n:9},{suit:"pin",n:9}]}]},
  { name:"Big Four Winds (大四喜)", tai:"40 tai", desc:"Pungs of all four winds.",
    groups:[{label:"pung 東",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"E"},{suit:"wind",n:"E"}]},{label:"pung 南",tiles:[{suit:"wind",n:"S"},{suit:"wind",n:"S"},{suit:"wind",n:"S"}]},{label:"pung 西",tiles:[{suit:"wind",n:"W"},{suit:"wind",n:"W"},{suit:"wind",n:"W"}]},{label:"pung 北",tiles:[{suit:"wind",n:"N"},{suit:"wind",n:"N"},{suit:"wind",n:"N"}]},{label:"chow",tiles:[{suit:"man",n:5},{suit:"man",n:6},{suit:"man",n:7}]},{label:"pair",tiles:[{suit:"dragon",n:"R"},{suit:"dragon",n:"R"}]}]},
];

const HK_HANDS_SHORT = [
  { name:"Common Hand (平糊)", faan:"1 faan", desc:"All chows, no pungs.",
    groups:[{label:"chow",tiles:[{suit:"man",n:1},{suit:"man",n:2},{suit:"man",n:3}]},{label:"chow",tiles:[{suit:"pin",n:4},{suit:"pin",n:5},{suit:"pin",n:6}]},{label:"chow",tiles:[{suit:"bam",n:2},{suit:"bam",n:3},{suit:"bam",n:4}]},{label:"chow",tiles:[{suit:"man",n:7},{suit:"man",n:8},{suit:"man",n:9}]},{label:"pair",tiles:[{suit:"pin",n:8},{suit:"pin",n:8}]}]},
  { name:"All One Suit (清一色)", faan:"7 faan", desc:"All tiles in one suit.",
    groups:[{label:"chow",tiles:[{suit:"pin",n:1},{suit:"pin",n:2},{suit:"pin",n:3}]},{label:"pung",tiles:[{suit:"pin",n:5},{suit:"pin",n:5},{suit:"pin",n:5}]},{label:"chow",tiles:[{suit:"pin",n:6},{suit:"pin",n:7},{suit:"pin",n:8}]},{label:"chow",tiles:[{suit:"pin",n:7},{suit:"pin",n:8},{suit:"pin",n:9}]},{label:"pair",tiles:[{suit:"pin",n:2},{suit:"pin",n:2}]}]},
  { name:"Thirteen Orphans (十三么)", faan:"Limit", desc:"One of each terminal and honour.",
    groups:[{label:"terminals",tiles:[{suit:"man",n:1},{suit:"man",n:9},{suit:"pin",n:1},{suit:"pin",n:9},{suit:"bam",n:1},{suit:"bam",n:9}]},{label:"honours",tiles:[{suit:"wind",n:"E"},{suit:"wind",n:"S"},{suit:"wind",n:"W"},{suit:"wind",n:"N"},{suit:"dragon",n:"G"},{suit:"dragon",n:"R"},{suit:"dragon",n:"W"}]}]},
];

const GAME_HANDS = { dubai:DXB_HANDS, taiwanese:TW_HANDS_SHORT, hk:HK_HANDS_SHORT, riichi:[] };
const GAME_CATS = { dubai:DXB_CATS, taiwanese:[{id:"all",label:"All"},{id:"high",label:"High"},{id:"limit",label:"Limit"}], hk:[{id:"all",label:"All"},{id:"limit",label:"Limit"}], riichi:[] };

// ─── PERSISTENCE HELPERS ──────────────────────────────────────────────────────
const STORAGE_KEY = "mahjong_companion_v2";
const WINDS = [
  { id:"E", label:"East",  emoji:"🀀", char:"東" },
  { id:"S", label:"South", emoji:"🀁", char:"南" },
  { id:"W", label:"West",  emoji:"🀂", char:"西" },
  { id:"N", label:"North", emoji:"🀃", char:"北" },
];
const ROUND_WINDS = WINDS;
const PLAYER_COLORS = ["#C8923A","#4A7FA5","#7A5C8C","#5A8A6A"];

const DEFAULT_PLAYERS = [
  {id:1,name:"Player 1",windId:"E",score:0,color:"#C8923A"},
  {id:2,name:"Player 2",windId:"S",score:0,color:"#4A7FA5"},
  {id:3,name:"Player 3",windId:"W",score:0,color:"#7A5C8C"},
  {id:4,name:"Player 4",windId:"N",score:0,color:"#5A8A6A"},
];

function loadState() {
  try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null; } catch{return null;}
}
function saveState(s) {
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch{}
}

// ─── ROOM API HELPERS ─────────────────────────────────────────────────────────
async function apiCreateRoom(gameState) {
  const res = await fetch("/.netlify/functions/room", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ game_state: gameState })
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to create room");
  return (await res.json()).room;
}

async function apiFetchRoom(code) {
  const res = await fetch(`/.netlify/functions/room?code=${code.toUpperCase()}`);
  if (res.status===404) throw new Error("Room not found. Check the code and try again.");
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch room");
  return (await res.json()).room;
}

async function apiUpdateRoom(code, gameState) {
  const res = await fetch("/.netlify/functions/room", {
    method:"PUT", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ code, game_state: gameState })
  });
  if (!res.ok) throw new Error("Failed to sync room");
}

// ─── LANDING SCREEN ───────────────────────────────────────────────────────────
function LandingScreen({ onContinueLocal, onNewLocal, onCreateRoom, onJoinRoom }) {
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  const handleJoin = async () => {
    if (joinCode.length < 4) { setError("Enter a 4-character room code"); return; }
    setJoining(true); setError("");
    try {
      const room = await apiFetchRoom(joinCode.trim());
      onJoinRoom(room);
    } catch(e) {
      setError(e.message);
    } finally { setJoining(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0E0C0A",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"32px 20px",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      {/* Logo */}
      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:8}}>🀄</div>
        <div style={{fontSize:26,fontWeight:900,color:"#F0E8DC",letterSpacing:"-0.5px"}}>MahjongCompanion</div>
        <div style={{fontSize:13,color:"#C8923A",marginTop:4,fontWeight:600,letterSpacing:0.4}}>Dubai Style</div>
      </div>

      {/* Options */}
      <div style={{width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:12}}>

        {/* Continue local game — only if saved state exists */}
        {loadState() && (
          <button onClick={onContinueLocal}
            style={{width:"100%",padding:"18px 20px",background:"linear-gradient(135deg,#C8923A28,#F5C97A12)",
              border:"1.5px solid #C8923A80",borderRadius:14,cursor:"pointer",
              display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
            <span style={{fontSize:28}}>📱</span>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#F5C97A"}}>Continue game</div>
              <div style={{fontSize:12,color:"rgba(200,180,160,0.65)",marginTop:2}}>
                Round {loadState().round || 1} · {(loadState().players||[]).map(x=>x.name).filter(n=>n && !/^Player \d+$/.test(n)).join(" · ") || "Saved on this phone"}
              </div>
            </div>
          </button>
        )}

        {/* New local game — always shown */}
        <button onClick={onNewLocal}
          style={{width:"100%",padding:"16px 20px",background:"#1A1712",
            border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:14,cursor:"pointer",
            display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
          <span style={{fontSize:28}}>🎲</span>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#F0E8DC"}}>New game</div>
              <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginTop:2}}>Fresh local game on this device</div>
          </div>
        </button>

        {/* Create shared room — resets everything */}
        <button onClick={onCreateRoom}
          style={{width:"100%",padding:"16px 20px",background:"linear-gradient(135deg,#C8923A22,#F5C97A11)",
            border:"1.5px solid #C8923A60",borderRadius:14,cursor:"pointer",
            display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
          <span style={{fontSize:28}}>🔗</span>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#F5C97A"}}>Create shared room</div>
            <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginTop:2}}>Friends watch the scoreboard live</div>
          </div>
        </button>

        {/* Join room */}
        {!showJoin ? (
          <button onClick={()=>setShowJoin(true)}
            style={{width:"100%",padding:"16px 20px",background:"linear-gradient(135deg,#4A7FA522,#88C0D011)",
              border:"1.5px solid #4A7FA560",borderRadius:14,cursor:"pointer",
              display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
            <span style={{fontSize:28}}>👁️</span>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#88C0D0"}}>Join a room</div>
              <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginTop:2}}>Read-only · enter a code</div>
            </div>
          </button>
        ) : (
          <div style={{background:"#1A1712",border:"1.5px solid #4A7FA560",borderRadius:14,padding:16}}>
            <div style={{fontSize:13,fontWeight:600,color:"#88C0D0",marginBottom:10}}>Enter Room Code</div>
            <input
              value={joinCode}
              onChange={e=>setJoinCode(e.target.value.toUpperCase().slice(0,4))}
              onKeyDown={e=>e.key==="Enter"&&handleJoin()}
              placeholder="e.g. MJ7X"
              maxLength={4}
              style={{width:"100%",padding:"12px 14px",background:"#0E0C0A",
                border:`1.5px solid ${error?"#E05050":"rgba(255,255,255,0.15)"}`,
                borderRadius:10,color:"#F0E8DC",fontSize:22,fontWeight:900,
                letterSpacing:6,textAlign:"center",outline:"none",
                fontFamily:"'DM Sans',sans-serif",marginBottom:8}}
            />
            {error&&<div style={{fontSize:12,color:"#E05050",marginBottom:8}}>{error}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setShowJoin(false);setJoinCode("");setError("");}}
                style={{flex:1,padding:10,background:"none",border:"0.5px solid rgba(255,255,255,0.1)",
                  borderRadius:8,color:"rgba(200,180,160,0.5)",fontSize:13,cursor:"pointer"}}>Cancel</button>
              <button onClick={handleJoin} disabled={joining}
                style={{flex:2,padding:10,background:"#4A7FA5",border:"none",
                  borderRadius:8,color:"white",fontSize:14,fontWeight:700,cursor:"pointer",
                  opacity:joining?0.6:1}}>
                {joining?"Joining…":"Join Room →"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{marginTop:32,fontSize:11,color:"rgba(200,180,160,0.25)",textAlign:"center"}}>
        Saved on this phone
      </div>
    </div>
  );
}

// ─── GUEST VIEW ───────────────────────────────────────────────────────────────
function GuestView({ room, onLeave }) {
  const [gameState, setGameState] = useState(room.game_state || {});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tab, setTab] = useState("players");
  const [handFilter, setHandFilter] = useState("all");
  const [expandedHand, setExpandedHand] = useState(null);

  const game = GAMES[0]; // Dubai by default; could read from gameState.gameId
  const gameColor = game.color;
  const gameAccent = game.accent;

  // Poll every 3 seconds for live updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updated = await apiFetchRoom(room.code);
        setGameState(updated.game_state || {});
        setLastUpdate(new Date());
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [room.code]);

  const players = gameState.players || [];
  const round = gameState.round || 1;
  const roundWind = gameState.roundWind || "E";
  const roundHistory = gameState.roundHistory || [];
  const sorted = [...players].sort((a,b) => b.score - a.score);
  const dealer = players.find(p => p.windId === "E");
  const rw = WINDS.find(w => w.id === roundWind);

  // Hands + cats for Dubai
  const allHands = GAME_HANDS[game.id] || [];
  const cats = GAME_CATS[game.id] || [{id:"all",label:"All"}];
  const filteredHands = allHands.filter(h => handFilter==="all" || h.cat===handFilter);

  const tabs = [
    {id:"players", label:"Table",  icon:"🀄"},
    {id:"hands",   label:"Hands",   icon:"📖"},
    {id:"ref",     label:"Rules",   icon:"📋"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0E0C0A",fontFamily:"'DM Sans','Segoe UI',sans-serif",
      color:"#E8E0D5",maxWidth:480,margin:"0 auto"}}>

      {/* Header */}
      <div style={{padding:"14px 18px 10px",background:"#1A1410",
        borderBottom:"0.5px solid rgba(200,146,58,0.2)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <div>
            <div style={{fontSize:11,color:gameColor,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>
              👁️ Room {room.code} · Read only
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#F0E8DC",marginTop:1}}>Round {round}</div>
          </div>
          <button onClick={onLeave}
            style={{background:"none",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:8,
              color:"rgba(200,180,160,0.5)",fontSize:11,padding:"5px 12px",cursor:"pointer"}}>
            Leave
          </button>
        </div>
        {/* Live pulse + dealer */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#4CAF50",
              animation:"gpulse 2s ease-in-out infinite"}}/>
            <div style={{fontSize:10,color:"rgba(200,180,160,0.4)"}}>
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          {rw&&<div style={{fontSize:11,color:gameColor,background:`${gameColor}15`,
            borderRadius:10,padding:"1px 8px",fontWeight:600}}>
            {rw.emoji} {rw.label} Round
          </div>}
          {dealer&&<div style={{fontSize:11,color:"#F5C97A",background:"rgba(245,201,122,0.12)",
            borderRadius:10,padding:"1px 8px",fontWeight:600,marginLeft:"auto"}}>
            🎴 {dealer.name} deals
          </div>}
        </div>
        <style>{`@keyframes gpulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      </div>

      {/* Tab bar */}
      <div style={{display:"flex",background:"#121008",borderBottom:"0.5px solid rgba(255,255,255,0.07)",
        position:"sticky",top:82,zIndex:40}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"10px 4px 9px",background:"none",border:"none",
              borderBottom:tab===t.id?`2px solid ${gameColor}`:"2px solid transparent",
              color:tab===t.id?gameAccent:"rgba(200,180,160,0.4)",
              fontSize:10,fontWeight:600,letterSpacing:0.5,cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:16}}>{t.icon}</span>{t.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 16px 80px"}}>

        {/* ── SCORES TAB ── */}
        {tab==="players" && (
          <div>
            {/* Read-only banner */}
            <div style={{background:"rgba(74,127,165,0.12)",border:"0.5px solid rgba(74,127,165,0.3)",
              borderRadius:10,padding:"8px 14px",marginBottom:14,
              display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>👁️</span>
              <div style={{fontSize:12,color:"rgba(200,180,160,0.55)"}}>
                You are watching this game. Only the host can enter scores.
              </div>
            </div>

            {/* Scoreboard */}
            {sorted.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(200,180,160,0.3)"}}>
                <div style={{fontSize:40,marginBottom:12}}>⏳</div>
                <div style={{fontSize:15,color:"rgba(200,180,160,0.55)"}}>Waiting for the host to start…</div>
              </div>
            ) : sorted.map((p,i) => {
              const wInfo = WINDS.find(w=>w.id===p.windId);
              const isDealer = p.windId==="E";
              return (
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,
                  background:isDealer?`${p.color}20`:i===0?`${p.color}12`:"#1A1712",
                  border:isDealer?`1.5px solid ${p.color}60`:i===0?`1px solid ${p.color}30`:"0.5px solid rgba(255,255,255,0.07)",
                  borderRadius:12,padding:"12px 14px",marginBottom:8}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:p.color,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,fontWeight:700,color:"#0E0C0A",flexShrink:0}}>
                    {i===0?"👑":i+1}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:700,color:"#F0E8DC"}}>{p.name}</span>
                      <span style={{fontSize:11,color:p.color,background:`${p.color}20`,
                        padding:"1px 6px",borderRadius:8}}>
                        {wInfo?.emoji} {wInfo?.label}
                      </span>
                      {isDealer&&<span style={{fontSize:10,color:"#F5C97A",
                        background:"rgba(245,201,122,0.15)",padding:"1px 6px",
                        borderRadius:6,fontWeight:700}}>DEALER</span>}
                    </div>
                  </div>
                  <div style={{fontSize:24,fontWeight:900,
                    color:p.score>0?gameAccent:p.score<0?"#E05050":"rgba(200,180,160,0.4)"}}>
                    {p.score>0?"+":""}{p.score}
                  </div>
                </div>
              );
            })}

            {/* Round history */}
            {roundHistory.length>0&&(
              <div style={{marginTop:20}}>
                <div style={{fontSize:11,color:"rgba(200,180,160,0.4)",letterSpacing:1.5,
                  textTransform:"uppercase",marginBottom:10}}>
                  History · {roundHistory.length} rounds
                </div>
                {[...roundHistory].reverse().slice(0,8).map(r=>{
                  const winner = players.find(p=>p.id===r.winnerId);
                  return (
                    <div key={r.round} style={{background:"#131109",borderRadius:10,
                      border:"0.5px solid rgba(255,255,255,0.06)",padding:"10px 14px",marginBottom:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,color:"rgba(200,180,160,0.4)"}}>Round {r.round}</span>
                        {winner&&<span style={{fontSize:11,color:gameAccent,fontWeight:600}}>🏆 {winner.name}</span>}
                      </div>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        {r.entries?.map(e=>(
                          <span key={e.pid} style={{fontSize:13,
                            color:e.delta>0?"#8FBC8F":e.delta<0?"#E05050":"rgba(200,180,160,0.4)"}}>
                            {e.name}: {e.delta>0?"+":""}{e.delta}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── HANDS TAB — identical to host ── */}
        {tab==="hands"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>{game.name} · {allHands.length} hands</div>
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14,scrollbarWidth:"none"}}>
              {cats.map(f=>(
                <button key={f.id} onClick={()=>{setHandFilter(f.id);setExpandedHand(null);}}
                  style={{flexShrink:0,padding:"5px 12px",borderRadius:20,
                    background:handFilter===f.id?gameColor:"transparent",
                    border:`0.5px solid ${handFilter===f.id?gameColor:"rgba(255,255,255,0.15)"}`,
                    color:handFilter===f.id?"#0E0C0A":"rgba(200,180,160,0.5)",
                    fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {f.label}
                </button>
              ))}
            </div>
            {filteredHands.map((h,i)=>{
              const expanded = expandedHand===i;
              const val = h.pts??h.faan??h.tai;
              const lim = String(val||"").toLowerCase().includes("limit")||Number(val)>=40;
              return (
                <div key={i} style={{background:"#1A1712",
                  border:`0.5px solid ${lim?gameColor+"60":"rgba(255,255,255,0.08)"}`,
                  borderRadius:14,marginBottom:10,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedHand(expanded?null:i)}
                    style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                      padding:"13px 14px",cursor:"pointer"}}>
                    <div style={{flex:1,marginRight:10}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#F0E8DC"}}>{h.name}</div>
                      <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginTop:2}}>{h.desc}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <div style={{background:lim?`${gameColor}30`:"#0E0C0A",
                        border:`0.5px solid ${lim?gameColor:"rgba(255,255,255,0.12)"}`,
                        borderRadius:8,padding:"4px 12px",minWidth:40,textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:700,color:gameAccent}}>{val}{typeof val==="number"?" pts":""}</div>
                      </div>
                      <span style={{fontSize:14,color:"rgba(200,180,160,0.35)"}}>{expanded?"▲":"▼"}</span>
                    </div>
                  </div>
                  {expanded&&h.groups&&h.groups.length>0&&(
                    <div style={{borderTop:"0.5px solid rgba(255,255,255,0.07)"}}>
                      <div style={{padding:"8px 14px 2px",fontSize:10,color:"rgba(200,180,160,0.35)",
                        letterSpacing:1,textTransform:"uppercase"}}>Example hand</div>
                      <HandDiagram groups={h.groups} accentColor={gameColor} tileSize={40}/>
                      <div style={{height:12}}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── RULES TAB — identical to host ── */}
        {tab==="ref"&&(
          <div>
            <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,
              textTransform:"uppercase",marginBottom:14}}>Dubai 2025 Complete Scoring Reference</div>
            <div style={{background:`${gameColor}15`,border:`0.5px solid ${gameColor}40`,
              borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:gameAccent,lineHeight:1.6}}>
              📋 Points are additive — stack them all up.
            </div>
            {DXB_REF.map((sec,si)=>(
              <div key={si} style={{marginBottom:16}}>
                <div style={{fontSize:11,color:gameColor,letterSpacing:1.5,textTransform:"uppercase",
                  fontWeight:700,marginBottom:8,padding:"4px 0"}}>{sec.section}</div>
                {sec.items.map((item,ii)=>(
                  <div key={ii} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"8px 12px",background:ii%2===0?"#1A1712":"#161310",borderRadius:8,marginBottom:2}}>
                    <span style={{fontSize:13,color:"rgba(200,180,160,0.8)",flex:1,paddingRight:10}}>{item.name}</span>
                    <span style={{fontSize:14,fontWeight:700,
                      color:Number(item.pts)<0?"#E05050":gameAccent,flexShrink:0,minWidth:40,textAlign:"right"}}>
                      {Number(item.pts)>0?"+":""}{item.pts}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MahjongApp() {
  const [appMode, setAppMode] = useState("landing"); // landing | local | host | guest
  const [room, setRoom] = useState(null);
  const [freshStart, setFreshStart] = useState(false); // true = ignore saved state

  const startFreshLocal = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFreshStart(true);
    setAppMode("local");
  };

  const continueLocal = () => {
    setFreshStart(false);
    setAppMode("local");
  };

  const startFreshHost = (r) => {
    localStorage.removeItem(STORAGE_KEY);
    setFreshStart(true);
    setRoom(r);
    setAppMode("host");
  };

  // ── Landing screen ──
  if (appMode === "landing") {
    return (
      <LandingScreen
        onContinueLocal={continueLocal}
        onNewLocal={startFreshLocal}
        onCreateRoom={() => setAppMode("creating")}
        onJoinRoom={(r) => { setRoom(r); setAppMode("guest"); }}
      />
    );
  }

  // ── Creating room ──
  if (appMode === "creating") {
    return <CreatingRoomScreen
      onCreated={(r) => startFreshHost(r)}
      onCancel={() => setAppMode("landing")}
    />;
  }

  // ── Guest view ──
  if (appMode === "guest" && room) {
    return <GuestView room={room} onLeave={() => { setRoom(null); setAppMode("landing"); }}/>;
  }

  // ── Host or local game ──
  return <GameApp
    key={freshStart ? "fresh" : "saved"}  // key change forces full remount = fresh state
    isHost={appMode === "host"}
    room={room}
    freshStart={freshStart}
    onLeaveRoom={() => { setRoom(null); setFreshStart(false); setAppMode("landing"); }}
  />;
}

// ─── CREATING ROOM SCREEN ─────────────────────────────────────────────────────
function CreatingRoomScreen({ onCreated, onCancel }) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const create = async () => {
      setCreating(true);
      try {
        const room = await apiCreateRoom({});
        onCreated(room);
      } catch(e) {
        setError(e.message);
        setCreating(false);
      }
    };
    create();
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"#0E0C0A",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:32,
      fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#E8E0D5"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔗</div>
      {error ? (
        <>
          <div style={{fontSize:15,fontWeight:600,color:"#E05050",marginBottom:8}}>Failed to create room</div>
          <div style={{fontSize:13,color:"rgba(200,180,160,0.5)",marginBottom:20,textAlign:"center",maxWidth:300}}>{error}</div>
          <div style={{fontSize:12,color:"rgba(200,180,160,0.4)",marginBottom:20,textAlign:"center",maxWidth:320,lineHeight:1.6}}>
            Make sure you've set up Supabase (see setup instructions) or use Local Game instead.
          </div>
          <button onClick={onCancel}
            style={{padding:"10px 24px",background:"none",border:"0.5px solid rgba(255,255,255,0.2)",
              borderRadius:10,color:"rgba(200,180,160,0.6)",fontSize:13,cursor:"pointer"}}>← Back</button>
        </>
      ) : (
        <>
          <div style={{fontSize:16,fontWeight:600,color:"#F0E8DC",marginBottom:8}}>Creating room…</div>
          <div style={{fontSize:13,color:"rgba(200,180,160,0.4)"}}>Connecting to Supabase</div>
        </>
      )}
    </div>
  );
}

// ─── GAME APP (host or local) ─────────────────────────────────────────────────
function GameApp({ isHost = false, room = null, onLeaveRoom, freshStart = false }) {
  const saved = freshStart ? null : loadState();

  const [activeGame, setActiveGame] = useState(GAMES[0]);
  const [tab, setTab] = useState("table");
  const [players, setPlayers] = useState(saved?.players || DEFAULT_PLAYERS);
  const [round, setRound] = useState(saved?.round || 1);
  const [roundWind, setRoundWind] = useState(saved?.roundWind || "E");
  const [roundHistory, setRoundHistory] = useState(saved?.roundHistory || []);
  const [scoreInputs, setScoreInputs] = useState({});
  const [handFilter, setHandFilter] = useState("all");
  const [expandedHand, setExpandedHand] = useState(null);
  const [pendingScore, setPendingScore] = useState(null);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showSetup, setShowSetup] = useState(freshStart || !saved);
  const [showScoreSheet, setShowScoreSheet] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [shareNote, setShareNote] = useState("");

  // Persist locally
  useEffect(() => {
    saveState({ gameId:activeGame.id, players, round, roundWind, roundHistory });
  }, [activeGame.id, players, round, roundWind, roundHistory]);

  // Sync to room if host
  useEffect(() => {
    if (!isHost || !room) return;
    const gameState = { players, round, roundWind, roundHistory, gameId:activeGame.id };
    apiUpdateRoom(room.code, gameState).catch(()=>{});
  }, [players, round, roundWind, roundHistory]);

  const game = activeGame;
  const isDXB = game.id === "dubai";
  const allHands = GAME_HANDS[game.id] || [];
  const cats = GAME_CATS[game.id] || [{id:"all",label:"All"}];

  const filteredHands = allHands.filter(h => {
    if(handFilter==="all") return true;
    if(isDXB) return h.cat===handFilter;
    if(handFilter==="limit") return String(h.faan||h.tai||"").toLowerCase().includes("limit")||String(h.faan||h.tai||"")>="40";
    if(handFilter==="high") { const v=parseInt(h.faan||h.tai); return !isNaN(v)&&v>=5; }
    return true;
  });

  const addRound = () => {
    const entries = players.map(p=>({pid:p.id,name:p.name,delta:Number(scoreInputs[p.id]||0)}));
    const windsBefore = Object.fromEntries(players.map(p=>[p.id,p.windId]));
    const newHistory = [...roundHistory, {round, entries, windsBefore, roundWindBefore: roundWind}];
    const newPlayers = players.map(x=>({...x,score:x.score+Number(scoreInputs[x.id]||0)}));
    setRoundHistory(newHistory);
    setPlayers(newPlayers);
    setScoreInputs({});
    setRound(r=>r+1);
  };

  const resetScores = () => {
    if (!window.confirm("Reset all scores and history? Names and seats stay.")) return;
    const reset = players.map(x=>({...x,score:0}));
    setPlayers(reset);
    setRoundHistory([]);
    setRound(1);
    setScoreInputs({});
  };

  const fullReset = () => {
    if (!window.confirm("Start a new game? This clears names, seats, and scores.")) return;
    setPlayers(DEFAULT_PLAYERS);
    setRoundHistory([]);
    setRound(1);
    setRoundWind("E");
    setScoreInputs({});
    setShowSetup(true);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sorted = [...players].sort((a,b)=>b.score-a.score);
  const windLabel = w => WINDS.find(x=>x.id===w);

  // Build prefill hints from player seats for wizard
  const getWizardHints = (winnerId) => {
    const winner = players.find(p=>p.id===winnerId);
    if (!winner) return {};
    return {
      _winnerSeat: winner.windId,
      _roundWind: roundWind,
    };
  };

  const tabs=[
    {id:"table",label:"Table",icon:"🀄"},
    {id:"hands",label:"Hands",icon:"📖"},
    {id:"ref",label:"Rules",icon:"📋"},
  ];

  // ── PAYMENT CALCULATION ──────────────────────────────────────────────────────
  // Dubai rules:
  // - Self-pick: all 3 losers pay the full score. East SEAT pays score + 1 extra.
  //   (East here = the player sitting in East seat, NOT whether they won or discarded)
  // - Discard win: only discarder pays. If East SEAT discarded → pays double.
  // NOTE: "East pays +1 / East pays ×2" refers to the East SEAT player specifically.
  //       It does NOT mean the winner gets double — only the East seat payer is affected.

  const calcPayments = (score, winnerId, winType, discarderId) => {
    const winner = players.find(p => p.id === winnerId);
    if (!winner) return [];
    const payments = [];

    if (winType === "self_pick") {
      // All 3 losers pay full score. East seat pays +1 extra.
      players.filter(p => p.id !== winnerId).forEach(loser => {
        const amt = loser.windId === "E" ? score + 1 : score;
        payments.push({ fromId: loser.id, toId: winnerId, amount: amt });
      });
    } else {
      // Discard win — ONLY the discarder pays.
      // If discarder is in East seat → pays double.
      const discarder = players.find(p => p.id === discarderId);
      if (!discarder) return [];
      const amt = discarder.windId === "E" ? score * 2 : score;
      payments.push({ fromId: discarderId, toId: winnerId, amount: amt });
    }

    return payments;
  };

  // ── DEALER ROTATION ───────────────────────────────────────────────────────────
  // After each round:
  // - If East (dealer) WON → East keeps the deal (no rotation)
  // - If East did NOT win → deal passes to next seat (E→S→W→N→E)
  // Round wind advances one full rotation through all four players.
  const WIND_ORDER = ["E","S","W","N"];

  const rotateDealerIfNeeded = (winnerId, newPlayers) => {
    const winner = newPlayers.find(p => p.id === winnerId);
    const eastPlayer = newPlayers.find(p => p.windId === "E");
    
    // If East won — no rotation, East keeps deal
    if (winner && winner.windId === "E") return { rotatedPlayers: newPlayers, newRoundWind: roundWind };

    // Rotate all seats: E→N, S→E, W→S, N→W (anti-clockwise shift)
    const rotated = newPlayers.map(p => {
      const idx = WIND_ORDER.indexOf(p.windId);
      const nextWind = WIND_ORDER[(idx - 1 + 4) % 4];
      return { ...p, windId: nextWind };
    });

    // Check if we've completed a full round (new East was previously North)
    // i.e. the player who just became East was North before rotation
    const newEast = rotated.find(p => p.windId === "E");
    const origWind = newPlayers.find(p => p.id === newEast?.id)?.windId;
    
    // Advance round wind when we complete a full cycle (East returns to original East)
    const originalEast = players.find(p => p.windId === "E");
    const newEastIsOriginal = newEast?.id === originalEast?.id;
    // Actually: advance round wind when the ORIGINAL East seat player gets deal back
    // For simplicity: advance round wind after 4 rotations (track via round number)
    const windIdx = WIND_ORDER.indexOf(roundWind);
    // Advance round wind every 4 rounds (one full deal rotation)
    const newRoundWind = round % 4 === 0
      ? WIND_ORDER[(windIdx + 1) % 4]
      : roundWind;

    return { rotatedPlayers: rotated, newRoundWind };
  };

  const applyPayments = (payments, winnerId) => {
    const deltas = {};
    payments.forEach(({ fromId, toId, amount }) => {
      deltas[fromId] = (deltas[fromId] || 0) - amount;
      deltas[toId]   = (deltas[toId]   || 0) + amount;
    });

    const updatedPlayers = players.map(p => ({
      ...p, score: p.score + (deltas[p.id] || 0)
    }));

    const entries = players.map(p => ({
      pid: p.id, name: p.name, delta: deltas[p.id] || 0
    }));

    // Rotate dealer
    const { rotatedPlayers, newRoundWind } = rotateDealerIfNeeded(winnerId, updatedPlayers);

    const windsBefore = Object.fromEntries(players.map(p => [p.id, p.windId]));
    setRoundHistory(h => [...h, { round, entries, payments, winnerId, windsBefore, roundWindBefore: roundWind }]);
    setPlayers(rotatedPlayers);
    setRoundWind(newRoundWind);
    setRound(r => r + 1);
    setPendingPayment(null);
    setPendingScore(null);
  };

  const undoLastHand = () => {
    if (!roundHistory.length) return;
    if (!window.confirm("Undo the last hand?")) return;
    const last = roundHistory[roundHistory.length - 1];
    setPlayers(players.map(p => {
      const e = (last.entries || []).find(x => x.pid === p.id);
      const wind = last.windsBefore?.[p.id] ?? p.windId;
      return { ...p, score: p.score - (e?.delta || 0), windId: wind };
    }));
    if (last.roundWindBefore) setRoundWind(last.roundWindBefore);
    setRound(last.round || Math.max(1, round - 1));
    setRoundHistory(h => h.slice(0, -1));
    setPendingPayment(null);
    setPendingScore(null);
  };

  const handleWizardScore = (score, meta = {}) => {
    setShowScoreSheet(false);
    setPendingScore({
      pts: score,
      _winnerId: meta.winnerId ?? null,
      _winType: meta.winType ?? null,
      _discarderId: meta.discarderId ?? null,
    });
    setPendingPayment(null);
    setTab("table");
  };

  return (
    <div style={{minHeight:"100vh",background:"#0E0C0A",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#E8E0D5",maxWidth:480,margin:"0 auto"}}>

      {/* Header */}
      <div style={{padding:"16px 20px 12px",background:"linear-gradient(180deg,#1A1410 0%,#0E0C0A 100%)",borderBottom:"0.5px solid rgba(200,146,58,0.2)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11,color:game.color,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>MahjongCompanion</div>
            <div style={{fontSize:18,fontWeight:700,color:"#F0E8DC",marginTop:2}}>Round {round}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {isHost && room && (
              <button
                onClick={()=>{
                  const share = () => {
                    navigator.clipboard?.writeText(room.code);
                    setShareNote("Code copied");
                    setTimeout(()=>setShareNote(""), 1800);
                  };
                  if (navigator.share) {
                    navigator.share({ title:"Join my Mahjong game", text:`Join my game with code: ${room.code}` }).catch(share);
                  } else share();
                }}
                style={{background:`${game.color}20`,border:`1px solid ${game.color}50`,
                  borderRadius:10,padding:"5px 10px",color:game.accent,
                  fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:2}}>
                {room.code}
              </button>
            )}
            <div style={{background:`${game.color}18`,border:`1px solid ${game.color}40`,borderRadius:20,padding:"6px 12px",color:game.accent,fontSize:12,fontWeight:700}}>
              Dubai Style
            </div>
            {onLeaveRoom && (
              <button onClick={onLeaveRoom}
                style={{background:"none",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:8,
                  color:"rgba(200,180,160,0.5)",fontSize:11,padding:"5px 10px",cursor:"pointer"}}>
                Home
              </button>
            )}
          </div>
        </div>
        {shareNote && <div style={{marginTop:8,fontSize:11,color:game.accent}}>{shareNote}</div>}
      </div>

      {/* Tab Bar */}
      <div style={{display:"flex",background:"#121008",borderBottom:"0.5px solid rgba(255,255,255,0.07)",position:"sticky",top:73,zIndex:40}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 9px",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${game.color}`:"2px solid transparent",color:tab===t.id?game.accent:"rgba(200,180,160,0.4)",fontSize:10,fontWeight:600,letterSpacing:0.5,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all 0.15s"}}>
            <span style={{fontSize:16}}>{t.icon}</span>{t.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 16px 100px"}}>

        {/* ── TABLE ── */}
        {tab==="table"&&(
          <div>

            {/* ── GAME SETUP PANEL ── */}
            {showSetup && (
              <div style={{background:"#1A1712",borderRadius:16,border:`1.5px solid ${game.color}60`,padding:18,marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#F0E8DC"}}>🎲 Player Setup</div>
                  <button onClick={()=>setShowSetup(false)} style={{background:"none",border:"none",color:"rgba(200,180,160,0.4)",fontSize:20,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>✕</button>
                </div>
                <div style={{fontSize:12,color:"rgba(200,180,160,0.4)",marginBottom:16}}>Enter names and assign wind seats</div>

                {players.map(p => {
                  const wInfo = windLabel(p.windId);
                  return (
                    <div key={p.id} style={{marginBottom:14,padding:12,background:"#0E0C0A",borderRadius:12,border:`1px solid ${p.color}30`}}>
                      {/* Name input — always editable */}
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                        <div style={{width:12,height:12,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                        <input
                          value={p.name}
                          onChange={e=>setPlayers(pl=>pl.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}
                          placeholder={`Player ${p.id} name`}
                          style={{flex:1,background:"transparent",border:"none",borderBottom:`1.5px solid ${p.color}60`,
                            color:"#F0E8DC",fontSize:16,fontWeight:700,outline:"none",padding:"4px 2px",
                            fontFamily:"inherit"}}
                        />
                      </div>
                      {/* Wind seat picker */}
                      <div style={{display:"flex",gap:5}}>
                        {WINDS.map(w=>(
                          <button key={w.id} onClick={()=>setPlayers(pl=>pl.map(x=>x.id===p.id?{...x,windId:w.id}:x))}
                            style={{flex:1,padding:"7px 2px",borderRadius:8,
                              border:`1.5px solid ${p.windId===w.id?p.color:"rgba(255,255,255,0.08)"}`,
                              background:p.windId===w.id?`${p.color}30`:"transparent",
                              cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                            <span style={{fontSize:16}}>{w.emoji}</span>
                            <span style={{fontSize:9,fontWeight:700,
                              color:p.windId===w.id?p.color:"rgba(200,180,160,0.35)",
                              letterSpacing:0.5}}>{w.label.toUpperCase()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Round wind */}
                <div style={{paddingTop:12,borderTop:"0.5px solid rgba(255,255,255,0.08)"}}>
                  <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Prevailing (Round) Wind</div>
                  <div style={{display:"flex",gap:6}}>
                    {WINDS.map(w=>(
                      <button key={w.id} onClick={()=>setRoundWind(w.id)}
                        style={{flex:1,padding:"8px 4px",borderRadius:8,
                          border:`1.5px solid ${roundWind===w.id?game.color:"rgba(255,255,255,0.1)"}`,
                          background:roundWind===w.id?`${game.color}25`:"transparent",cursor:"pointer",
                          display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <span style={{fontSize:16}}>{w.emoji}</span>
                        <span style={{fontSize:10,fontWeight:700,color:roundWind===w.id?game.color:"rgba(200,180,160,0.4)"}}>{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={()=>setShowSetup(false)}
                  style={{marginTop:14,width:"100%",padding:13,background:game.color,border:"none",
                    borderRadius:10,color:"#0E0C0A",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                  Start Game ✓
                </button>
              </div>
            )}

            {/* ── PAYMENT FLOW — shown after wizard calculates score ── */}
            {pendingScore !== null && pendingPayment === null && typeof pendingScore === "object" && (
              <div style={{background:"#1A1712",borderRadius:14,border:`1.5px solid ${game.color}50`,padding:16,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:700,color:game.accent,marginBottom:4}}>
                  🀄 Score: <span style={{fontSize:22,fontWeight:900}}>{pendingScore?.pts ?? pendingScore}</span> pts
                </div>
                <div style={{fontSize:12,color:"rgba(200,180,160,0.5)",marginBottom:14}}>Select winner and how they won to calculate payments</div>

                {/* Winner picker */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:7}}>Who won?</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {players.map(p => {
                      const WEMOJI = {E:"🀀",S:"🀁",W:"🀂",N:"🀃"};
                      const sel = pendingScore?._winnerId === p.id;
                      return (
                        <button key={p.id}
                          onClick={()=>setPendingScore(s=>({...s,_winnerId:p.id,_discarderId:null,_winType:null}))}
                          style={{padding:"7px 13px",borderRadius:20,
                            border:`1.5px solid ${pendingScore._winnerId===p.id?p.color:"rgba(255,255,255,0.12)"}`,
                            background:pendingScore._winnerId===p.id?`${p.color}25`:"transparent",
                            cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                          <span style={{fontSize:14}}>{WEMOJI[p.windId]||"🀀"}</span>
                          <span style={{fontSize:13,fontWeight:700,color:pendingScore._winnerId===p.id?p.color:"rgba(200,180,160,0.7)"}}>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Win type */}
                {pendingScore._winnerId && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:7}}>How did they win?</div>
                    <div style={{display:"flex",gap:8}}>
                      {[
                        {id:"self_pick", label:"Self Pick",    emoji:"🤲", sub:"All 3 pay full score. East pays +1 extra."},
                        {id:"discard",   label:"Discard Win",  emoji:"♟️", sub:"Only discarder pays. East discarder pays ×2."},
                      ].map(wt=>(
                        <button key={wt.id}
                          onClick={()=>setPendingScore(s=>({...s,_winType:wt.id,_discarderId:null}))}
                          style={{flex:1,padding:"10px 8px",borderRadius:12,
                            border:`1.5px solid ${pendingScore._winType===wt.id?game.color:"rgba(255,255,255,0.1)"}`,
                            background:pendingScore._winType===wt.id?`${game.color}20`:"transparent",
                            cursor:"pointer",textAlign:"center"}}>
                          <div style={{fontSize:20,marginBottom:3}}>{wt.emoji}</div>
                          <div style={{fontSize:13,fontWeight:700,color:pendingScore._winType===wt.id?game.accent:"rgba(200,180,160,0.7)"}}>{wt.label}</div>
                          <div style={{fontSize:10,color:"rgba(200,180,160,0.4)",marginTop:1}}>{wt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discarder picker */}
                {pendingScore._winType==="discard" && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>Who discarded the winning tile?</div>
                    <div style={{fontSize:11,color:"rgba(200,180,160,0.35)",marginBottom:8,lineHeight:1.5}}>
                      Only this player pays. If they are East (Dealer) they pay double.
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {players.filter(p=>p.id!==pendingScore._winnerId).map(p=>{
                        const WEMOJI = {E:"🀀",S:"🀁",W:"🀂",N:"🀃"};
                        const isEast = p.windId==="E";
                        const isSelected = pendingScore._discarderId===p.id;
                        return (
                          <button key={p.id}
                            onClick={()=>setPendingScore(s=>({...s,_discarderId:p.id}))}
                            style={{padding:"7px 12px",borderRadius:20,
                              border:`1.5px solid ${isSelected?p.color:"rgba(255,255,255,0.12)"}`,
                              background:isSelected?`${p.color}25`:"transparent",
                              cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontSize:13}}>{WEMOJI[p.windId]||"🀀"}</span>
                            <span style={{fontSize:12,fontWeight:600,color:isSelected?p.color:"rgba(200,180,160,0.6)"}}>{p.name}</span>
                            {isEast&&<span style={{fontSize:10,color:"#F5C97A",background:"rgba(245,201,122,0.15)",padding:"1px 5px",borderRadius:6,fontWeight:700}}>Dealer ×2</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Calculate button */}
                {pendingScore._winType &&
                  (pendingScore._winType==="self_pick" || pendingScore._discarderId) && (
                  <button
                    onClick={()=>{
                      const pts = Number(pendingScore?.pts ?? pendingScore);
                      const payments = calcPayments(
                        pts,
                        pendingScore._winnerId,
                        pendingScore._winType,
                        pendingScore._discarderId
                      );
                      setPendingPayment({ score: pts, payments, winnerId: pendingScore._winnerId });
                    }}
                    style={{width:"100%",padding:12,background:game.color,border:"none",borderRadius:10,color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                    Calculate payments →
                  </button>
                )}

                <button onClick={()=>setPendingScore(null)}
                  style={{marginTop:8,width:"100%",padding:8,background:"none",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(200,180,160,0.4)",fontSize:12,cursor:"pointer"}}>
                  Cancel
                </button>
              </div>
            )}

            {/* ── PAYMENT CONFIRMATION ── */}
            {pendingPayment && (
              <div style={{background:"#1A1712",borderRadius:14,border:`1.5px solid ${game.color}60`,padding:16,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:700,color:game.accent,marginBottom:12}}>💰 Payment breakdown</div>
                {pendingPayment.payments.map((pay,i)=>{
                  const from = players.find(p=>p.id===pay.fromId);
                  const to   = players.find(p=>p.id===pay.toId);
                  if(!from||!to) return null;
                  const WEMOJI = {E:"🀀",S:"🀁",W:"🀂",N:"🀃"};
                  // Explain why this amount
                  const baseScore = pendingPayment.score;
                  let reason = "";
                  if(pay.amount === baseScore * 2)      reason = "East discard ×2";
                  else if(pay.amount === baseScore + 1) reason = "East seat +1";
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                      padding:"9px 0",borderBottom:"0.5px solid rgba(255,255,255,0.06)"}}>
                      <div style={{flex:1}}>
                        <span style={{fontSize:13,color:"#E05050",fontWeight:600}}>
                          {WEMOJI[from.windId]} {from.name}
                        </span>
                        <span style={{fontSize:13,color:"rgba(200,180,160,0.4)"}}> → </span>
                        <span style={{fontSize:13,color:"#8FBC8F",fontWeight:600}}>
                          {WEMOJI[to.windId]} {to.name}
                        </span>
                        {reason&&<div style={{fontSize:10,color:"rgba(200,180,160,0.35)",marginTop:1}}>{reason}</div>}
                      </div>
                      <div style={{fontSize:18,fontWeight:900,color:game.accent,flexShrink:0}}>
                        {pay.amount} pts
                      </div>
                    </div>
                  );
                })}
                {/* Net summary */}
                <div style={{marginTop:10,padding:"8px 0"}}>
                  {(() => {
                    const deltas = {};
                    pendingPayment.payments.forEach(({fromId,toId,amount})=>{
                      deltas[fromId]=(deltas[fromId]||0)-amount;
                      deltas[toId]  =(deltas[toId]  ||0)+amount;
                    });
                    return players.map(p=>{
                      const d=deltas[p.id]||0;
                      if(d===0) return null;
                      return (
                        <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                          <span style={{fontSize:12,color:"rgba(200,180,160,0.6)"}}>{p.name}</span>
                          <span style={{fontSize:13,fontWeight:700,color:d>0?"#8FBC8F":"#E05050"}}>{d>0?"+":""}{d}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
                {/* Dealer rotation notice */}
                {(() => {
                  const winner = players.find(p=>p.id===pendingPayment.winnerId);
                  const eastWon = winner?.windId === "E";
                  return (
                    <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,
                      background:eastWon?"rgba(245,201,122,0.1)":"rgba(100,180,100,0.1)",
                      border:`0.5px solid ${eastWon?"rgba(245,201,122,0.3)":"rgba(100,180,100,0.3)"}`,
                      fontSize:12,color:eastWon?"#F5C97A":"#8FBC8F"}}>
                      {eastWon
                        ? "🎴 East won — dealer keeps the deal, seats stay the same"
                        : "🔄 Dealer passes to next seat after this round"}
                    </div>
                  );
                })()}
                <div style={{display:"flex",gap:10,marginTop:12}}>
                  <button onClick={()=>{setPendingPayment(null);setPendingScore(null);}}
                    style={{flex:1,padding:10,background:"none",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(200,180,160,0.4)",fontSize:12,cursor:"pointer"}}>Cancel</button>
                  <button onClick={()=>applyPayments(pendingPayment.payments, pendingPayment.winnerId)}
                    style={{flex:2,padding:11,background:game.color,border:"none",borderRadius:10,color:"#0E0C0A",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                    Confirm & update scores ✓
                  </button>
                </div>
              </div>
            )}

            {/* ── SCOREBOARD ── */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>Scoreboard · Round {round}</div>
                  {/* Proactive dealer + wind status */}
                  <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                    {(() => {
                      const dealer = players.find(p=>p.windId==="E");
                      const rw = WINDS.find(w=>w.id===roundWind);
                      return <>
                        <div style={{fontSize:11,color:"#F5C97A",background:"rgba(245,201,122,0.12)",
                          border:"0.5px solid rgba(245,201,122,0.3)",borderRadius:10,padding:"2px 8px",fontWeight:600}}>
                          🎴 Dealer: {dealer?.name||"?"}
                        </div>
                        <div style={{fontSize:11,color:game.color,background:`${game.color}12`,
                          border:`0.5px solid ${game.color}40`,borderRadius:10,padding:"2px 8px",fontWeight:600}}>
                          {rw?.emoji} {rw?.label} Round
                        </div>
                      </>;
                    })()}
                  </div>
                </div>
                <button onClick={()=>setShowSetup(v=>!v)}
                  style={{background:"none",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:8,
                    color:"rgba(200,180,160,0.5)",fontSize:11,padding:"4px 10px",cursor:"pointer",flexShrink:0}}>
                  ⚙️ Setup
                </button>
              </div>
              {sorted.map((p,i)=>{
                const wInfo = windLabel(p.windId);
                const isDealer = p.windId==="E";
                const isRoundWind = p.windId===roundWind;
                return (
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,
                    background:isDealer?`${p.color}20`:i===0?`${p.color}12`:"#1A1712",
                    border:isDealer?`1.5px solid ${p.color}60`:i===0?`1px solid ${p.color}30`:"0.5px solid rgba(255,255,255,0.07)",
                    borderRadius:12,padding:"11px 14px",marginBottom:8}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:p.color,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,fontWeight:700,color:"#0E0C0A",flexShrink:0}}>
                      {i===0?"👑":i+1}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        {editingPlayer===p.id ? (
                          <input autoFocus value={p.name}
                            onChange={e=>setPlayers(pl=>pl.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}
                            onBlur={()=>setEditingPlayer(null)}
                            onKeyDown={e=>e.key==="Enter"&&setEditingPlayer(null)}
                            style={{width:110,background:"transparent",border:"none",borderBottom:`1.5px solid ${p.color}`,
                              color:"#F0E8DC",fontSize:14,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>
                        ) : (
                          <span onClick={()=>setEditingPlayer(p.id)}
                            style={{fontSize:14,fontWeight:700,color:"#F0E8DC",
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:100,cursor:"pointer"}}>
                            {p.name}
                          </span>
                        )}
                        <span style={{fontSize:11,color:p.color,background:`${p.color}20`,
                          padding:"1px 6px",borderRadius:8,flexShrink:0}}>
                          {wInfo?.emoji} {wInfo?.label}
                        </span>
                        {isDealer&&<span style={{fontSize:10,color:"#F5C97A",background:"rgba(245,201,122,0.15)",
                          padding:"1px 6px",borderRadius:6,fontWeight:700,flexShrink:0}}>DEALER</span>}
                        {isRoundWind&&!isDealer&&<span style={{fontSize:10,color:game.color,
                          background:`${game.color}15`,padding:"1px 6px",borderRadius:6,
                          fontWeight:600,flexShrink:0}}>+1 wind</span>}
                      </div>
                    </div>
                    <div style={{fontSize:22,fontWeight:700,
                      color:p.score>0?game.accent:p.score<0?"#E05050":"rgba(200,180,160,0.4)",
                      flexShrink:0}}>
                      {p.score>0?"+":""}{p.score}
                    </div>
                  </div>
                );
              })}
            </div>

            {pendingScore === null && pendingPayment === null && !showSetup && (
              <div style={{marginBottom:16}}>
                <button onClick={()=>setShowScoreSheet(true)}
                  style={{width:"100%",padding:15,background:game.color,border:"none",borderRadius:14,
                    color:"#0E0C0A",fontSize:16,fontWeight:800,cursor:"pointer"}}>
                  Score this hand
                </button>
                <div style={{display:"flex",gap:10,marginTop:10}}>
                  {roundHistory.length>0 && (
                    <button onClick={undoLastHand}
                      style={{flex:1,padding:10,background:"none",border:"0.5px solid rgba(220,80,80,0.35)",
                        borderRadius:10,color:"#E05050",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      Undo last hand
                    </button>
                  )}
                  <button onClick={()=>setShowAdjust(v=>!v)}
                    style={{flex:1,padding:10,background:"none",border:"0.5px solid rgba(255,255,255,0.12)",
                      borderRadius:10,color:"rgba(200,180,160,0.55)",fontSize:13,cursor:"pointer"}}>
                    {showAdjust ? "Hide adjust" : "Adjust scores"}
                  </button>
                </div>
              </div>
            )}

            {/* ── ADD ROUND SCORES ── */}
            {showAdjust && <div style={{background:"#1A1712",borderRadius:14,border:`0.5px solid ${game.color}30`,padding:16,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,color:game.accent,marginBottom:4}}>Adjust Round {round} scores</div>
              <div style={{fontSize:11,color:"rgba(200,180,160,0.4)",marginBottom:12}}>
                Enter a score then tap <strong style={{color:"rgba(200,180,160,0.6)"}}>Pay</strong> to auto-calculate payments, or enter ± manually for each player.
              </div>
              {players.map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:"#E8E0D5",fontWeight:500}}>{p.name}</div>
                    <div style={{fontSize:10,color:"rgba(200,180,160,0.35)"}}>{windLabel(p.windId)?.emoji} {windLabel(p.windId)?.label}{p.windId===roundWind?" · round wind":""}</div>
                  </div>
                  {/* Quick Pay button — sets this player as winner and opens payment flow */}
                  <button
                    onClick={()=>{
                      const pts = Number(scoreInputs[p.id]||0);
                      if(pts<=0){ alert("Enter a score first"); return; }
                      setPendingScore({ pts, _winnerId: p.id, _winType: null, _discarderId: null });
                      setPendingPayment(null);
                      setScoreInputs({});
                    }}
                    style={{padding:"5px 10px",background:`${p.color}20`,border:`0.5px solid ${p.color}50`,borderRadius:8,color:p.color,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                    Pay
                  </button>
                  <input type="number" placeholder="±0" value={scoreInputs[p.id]||""}
                    onChange={e=>setScoreInputs(s=>({...s,[p.id]:e.target.value}))}
                    style={{width:70,padding:"7px 8px",background:"#0E0C0A",border:`1px solid ${p.color}40`,borderRadius:8,color:"#F0E8DC",fontSize:14,fontWeight:600,textAlign:"center",outline:"none"}}/>
                </div>
              ))}
              <button onClick={addRound}
                style={{width:"100%",marginTop:8,padding:"11px",background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.12)",borderRadius:10,color:"rgba(200,180,160,0.7)",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                Confirm manual scores (no payments)
              </button>
            </div>}

            {/* ── ROUND HISTORY ── */}
            {roundHistory.length>0&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>
                    History · {roundHistory.length} round{roundHistory.length!==1?"s":""}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <span style={{fontSize:10,color:"rgba(200,180,160,0.3)",alignSelf:"center"}}>💾 auto-saved</span>
                    <button onClick={resetScores} style={{background:"none",border:"0.5px solid rgba(220,80,80,0.4)",borderRadius:8,color:"#E05050",fontSize:11,padding:"3px 10px",cursor:"pointer"}}>Reset scores</button>
                    <button onClick={fullReset} style={{background:"none",border:"0.5px solid rgba(220,80,80,0.4)",borderRadius:8,color:"#E05050",fontSize:11,padding:"3px 10px",cursor:"pointer"}}>New game</button>
                  </div>
                </div>
                {[...roundHistory].reverse().map(r=>{
                  const winner = players.find(p=>p.id===r.winnerId);
                  return (
                  <div key={r.round} style={{background:"#131109",borderRadius:10,border:"0.5px solid rgba(255,255,255,0.06)",padding:"10px 14px",marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{fontSize:11,color:"rgba(200,180,160,0.4)"}}>Round {r.round}</div>
                      {winner&&<div style={{fontSize:11,color:game.accent,fontWeight:600}}>🏆 {winner.name}</div>}
                    </div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {r.entries.map(e=><span key={e.pid} style={{fontSize:13,
                        color:e.delta>0?"#8FBC8F":e.delta<0?"#E05050":"rgba(200,180,160,0.4)"}}>
                        {e.name}: {e.delta>0?"+":""}{e.delta}
                      </span>)}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* ── HANDS ── */}
        {tab==="hands"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>{game.name} · {allHands.length} hands</div>
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14,scrollbarWidth:"none"}}>
              {cats.map(f=>(
                <button key={f.id} onClick={()=>{setHandFilter(f.id);setExpandedHand(null);}} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,background:handFilter===f.id?game.color:"transparent",border:`0.5px solid ${handFilter===f.id?game.color:"rgba(255,255,255,0.15)"}`,color:handFilter===f.id?"#0E0C0A":"rgba(200,180,160,0.5)",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {f.label}
                </button>
              ))}
            </div>
            {filteredHands.map((h,i)=>{
              const expanded=expandedHand===i;
              const val=h.pts??h.faan??h.tai;
              const lim=String(val||"").toLowerCase().includes("limit")||Number(val)>=40;
              return (
                <div key={i} style={{background:"#1A1712",border:`0.5px solid ${lim?game.color+"60":"rgba(255,255,255,0.08)"}`,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedHand(expanded?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"13px 14px",cursor:"pointer"}}>
                    <div style={{flex:1,marginRight:10}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#F0E8DC"}}>{h.name}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <div style={{background:lim?`${game.color}30`:"#0E0C0A",border:`0.5px solid ${lim?game.color:"rgba(255,255,255,0.12)"}`,borderRadius:8,padding:"4px 12px",minWidth:40,textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:700,color:game.accent}}>{val}{isDXB&&typeof val==="number"?" pts":""}</div>
                      </div>
                      <span style={{fontSize:14,color:"rgba(200,180,160,0.35)"}}>{expanded?"▲":"▼"}</span>
                    </div>
                  </div>
                  <div style={{padding:"0 14px 10px",fontSize:12,color:"rgba(200,180,160,0.55)",lineHeight:1.5}}>{h.desc}</div>
                  {expanded&&h.groups&&h.groups.length>0&&(
                    <div style={{borderTop:"0.5px solid rgba(255,255,255,0.07)"}}>
                      <div style={{padding:"8px 14px 2px",fontSize:10,color:"rgba(200,180,160,0.35)",letterSpacing:1,textTransform:"uppercase"}}>Example hand</div>
                      <HandDiagram groups={h.groups} accentColor={game.color} tileSize={40}/>
                      <div style={{height:12}}/>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredHands.length===0&&<div style={{textAlign:"center",padding:40,color:"rgba(200,180,160,0.4)"}}>No hands for this filter.</div>}
          </div>
        )}

        {/* ── DUBAI RULES REFERENCE ── */}
        {tab==="ref"&&(
          <div>
            <div style={{fontSize:11,color:"rgba(200,180,160,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Dubai 2025 Complete Scoring Reference</div>
            <div style={{background:`${game.color}15`,border:`0.5px solid ${game.color}40`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:game.accent,lineHeight:1.6}}>
              📋 Source: Dubai Mah Jong 2025 Rulebook + Taiwanese Scoring Booklet. Points are additive — stack them all up.
            </div>
            {DXB_REF.map((sec,si)=>(
              <div key={si} style={{marginBottom:16}}>
                <div style={{fontSize:11,color:game.color,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,marginBottom:8,padding:"4px 0"}}>{sec.section}</div>
                {sec.items.map((item,ii)=>(
                  <div key={ii} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:ii%2===0?"#1A1712":"#161310",borderRadius:8,marginBottom:2}}>
                    <span style={{fontSize:13,color:"rgba(200,180,160,0.8)",flex:1,paddingRight:10}}>{item.name}</span>
                    <span style={{fontSize:14,fontWeight:700,color:Number(item.pts)<0?"#E05050":game.accent,flexShrink:0,minWidth:40,textAlign:"right"}}>{Number(item.pts)>0?"+":""}{item.pts}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>

      {showScoreSheet && (
        <div style={{position:"fixed",inset:0,zIndex:80,background:"#0E0C0A",maxWidth:480,margin:"0 auto",
          display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 16px 12px",borderBottom:"0.5px solid rgba(200,146,58,0.2)",
            display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div>
              <div style={{fontSize:11,color:game.color,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>Score this hand</div>
              <div style={{fontSize:13,color:"rgba(200,180,160,0.45)",marginTop:2}}>Round {round}</div>
            </div>
            <button onClick={()=>setShowScoreSheet(false)}
              style={{background:"none",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:8,
                color:"rgba(200,180,160,0.6)",fontSize:13,padding:"6px 12px",cursor:"pointer"}}>
              Close
            </button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 40px"}}>
            <DxbCameraTab game={game} onScore={handleWizardScore} players={players} roundWind={roundWind}/>
          </div>
        </div>
      )}
    </div>
  );
}
