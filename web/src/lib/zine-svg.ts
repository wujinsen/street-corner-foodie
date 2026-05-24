/** SVG placeholder pages for Tokyo preview zines (ported from prototype). */



export interface ZinePageOpts {

  title: string;

  subtitle: string;

  panels: string[];

  bg?: string;

  fg?: string;

  sub?: string;

  panelBg?: string;

  footer?: string;

}



export function makeZinePageSvg(opts: ZinePageOpts): string {

  const panels = opts.panels.length >= 4 ? opts.panels : ["🥢", "🍳", "🍲", "😋"];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 540' preserveAspectRatio='xMidYMid slice'>

    <rect width='400' height='540' fill='${opts.bg ?? "#f5ede0"}'/>

    <text x='200' y='38' font-size='20' text-anchor='middle' font-family='Noto Serif JP, serif' font-weight='900' fill='${opts.fg ?? "#2b2b2b"}'>${opts.title}</text>

    <text x='200' y='62' font-size='11' text-anchor='middle' font-family='monospace' letter-spacing='3px' fill='${opts.sub ?? "#7a6e55"}'>${opts.subtitle.toUpperCase()}</text>

    <g transform='translate(28,84)'>

      <rect width='160' height='200' rx='6' fill='${opts.panelBg ?? "#fff"}' stroke='rgba(0,0,0,.12)'/>

      <text x='80' y='115' font-size='80' text-anchor='middle' dominant-baseline='middle'>${panels[0]}</text>

      <text x='80' y='180' font-size='10' font-family='monospace' text-anchor='middle' fill='#888'>01</text>

      <rect x='184' width='160' height='200' rx='6' fill='${opts.panelBg ?? "#fff"}' stroke='rgba(0,0,0,.12)'/>

      <text x='264' y='115' font-size='80' text-anchor='middle' dominant-baseline='middle'>${panels[1]}</text>

      <text x='264' y='180' font-size='10' font-family='monospace' text-anchor='middle' fill='#888'>02</text>

      <rect y='216' width='160' height='200' rx='6' fill='${opts.panelBg ?? "#fff"}' stroke='rgba(0,0,0,.12)'/>

      <text x='80' y='331' font-size='80' text-anchor='middle' dominant-baseline='middle'>${panels[2]}</text>

      <text x='80' y='396' font-size='10' font-family='monospace' text-anchor='middle' fill='#888'>03</text>

      <rect x='184' y='216' width='160' height='200' rx='6' fill='${opts.panelBg ?? "#fff"}' stroke='rgba(0,0,0,.12)'/>

      <text x='264' y='331' font-size='80' text-anchor='middle' dominant-baseline='middle'>${panels[3]}</text>

      <text x='264' y='396' font-size='10' font-family='monospace' text-anchor='middle' fill='#888'>04</text>

    </g>

    <text x='200' y='500' font-size='11' text-anchor='middle' font-family='monospace' letter-spacing='4px' fill='${opts.sub ?? "#7a6e55"}'>${opts.footer ?? "PREVIEW · MINI-ZINE"}</text>

  </svg>`;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);

}



const TOKYO_PANELS: Record<string, { panels: string[]; bg: string; fg: string; sub: string; panelBg: string }> = {

  ramen: { panels: ["🍥", "🍜", "🥢", "😋"], bg: "#1a0c0c", fg: "#FFE0CC", sub: "#FF6B9D", panelBg: "#241818" },

  sushi: { panels: ["🐟", "🔪", "🍣", "🍵"], bg: "#0a1a13", fg: "#CFEED9", sub: "#7DD3C0", panelBg: "#13241e" },

  tempura: { panels: ["🍤", "🥣", "🔥", "🍱"], bg: "#1a1408", fg: "#FFE9B3", sub: "#FFCB66", panelBg: "#241d10" },

  takoyaki: { panels: ["🐙", "🥣", "🔥", "🍡"], bg: "#1f0a05", fg: "#FFD4B0", sub: "#FF8C5A", panelBg: "#2a120a" },

};



const PAGE_PANELS: string[][] = [

  ["🍥", "🍜", "🥢", "😋"],

  ["🔥", "🍲", "🥡", "�"],

  ["🍱", "🍵", "📖", "😋"],

  ["🌙", "🏮", "🎌", "💫"],

];



export function placeholderZinePageUrl(

  slug: string,

  mode: "story" | "recipe",

  page: number,

  titleJa: string,

): string {

  const theme = TOKYO_PANELS[slug] ?? TOKYO_PANELS.ramen!;

  const panels = PAGE_PANELS[page % PAGE_PANELS.length]!;

  return makeZinePageSvg({

    title: titleJa,

    subtitle: mode === "story" ? "STORY · EATING" : "RECIPE · HOW TO",

    panels,

    bg: theme.bg,

    fg: theme.fg,

    sub: theme.sub,

    panelBg: theme.panelBg,

    footer: `PREVIEW · PAGE ${page + 1}/4`,

  });

}

