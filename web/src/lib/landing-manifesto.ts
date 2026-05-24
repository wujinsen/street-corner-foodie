import type { Lang } from "./types";

export interface ManifestoLines {
  line1: string;
  line2: string;
}

/** Split brand tagline into two display lines per language. */
export function splitManifestoTagline(lang: Lang, text: string): ManifestoLines {
  if (lang === "zh") {
    const i = text.indexOf("，");
    if (i >= 0) {
      return { line1: text.slice(0, i + 1), line2: text.slice(i + 1).trim() };
    }
  }
  if (lang === "en") {
    const i = text.indexOf(" — ");
    if (i >= 0) {
      return { line1: text.slice(0, i).trim(), line2: text.slice(i + 3).trim() };
    }
  }
  if (lang === "ja") {
    const i = text.indexOf("、");
    if (i >= 0) {
      return { line1: text.slice(0, i + 1), line2: text.slice(i + 1).trim() };
    }
  }
  const mid = Math.ceil(text.length / 2);
  const space = text.lastIndexOf(" ", mid);
  const cut = space > 0 ? space : mid;
  return { line1: text.slice(0, cut).trim(), line2: text.slice(cut).trim() };
}

/** Accent phrases inside tagline lines (display only). */
export function manifestoHighlights(lang: Lang): { line1: string[]; line2: string[] } {
  if (lang === "zh") return { line1: ["街角"], line2: ["呼吸"] };
  if (lang === "en") return { line1: ["street corner"], line2: ["bite"] };
  return { line1: ["街角"], line2: ["立ち上がる"] };
}

export function highlightManifestoLine(line: string, phrases: string[]): string[] {
  if (phrases.length === 0) return [line];
  const pattern = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(${pattern})`, "gi");
  const parts: string[] = [];
  let last = 0;
  for (const match of line.matchAll(re)) {
    const idx = match.index ?? 0;
    if (idx > last) parts.push(line.slice(last, idx));
    parts.push(`\0${match[0]}\0`);
    last = idx + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts.length > 0 ? parts : [line];
}
