import { MENU_ITEMS, type MenuItem } from "../data/menu";

type ScoreMap = Record<string, number>;

function normalizeName(s: string) {
  return s
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .trim();
}

function computePopularity(): ScoreMap {
  const counts: ScoreMap = {};
  try {
    // Try to load orders data from public folder at runtime
    // Falls back gracefully if not available
    const ordersData = require("../../data/orders.json");
    if (!ordersData || !Array.isArray(ordersData.orders)) return counts;

    for (const o of ordersData.orders) {
      if (!Array.isArray(o.items)) continue;
      for (const it of o.items) {
        const name = normalizeName(String(it.name ?? ""));
        if (!name) continue;
        counts[name] = (counts[name] || 0) + 1;
      }
    }
  } catch (e) {
    // If orders.json can't be loaded, return empty scores
    // Menu will still work, just without popularity ranking
    console.warn("Could not load orders data for suggestions:", e);
  }
  return counts;
}

const POPULARITY = computePopularity();

function nameScore(itemName: string, query: string) {
  const name = normalizeName(itemName);
  const q = normalizeName(query);
  if (!q) return 0;
  if (name === q) return 100;
  if (name.startsWith(q)) return 60;
  if (name.includes(q)) return 30;
  // partial word matches
  const qWords = q.split(" ");
  let score = 0;
  for (const w of qWords) if (w && name.includes(w)) score += 5;
  return score;
}

export function useSuggestions() {
  function suggestByText(query: string, limit = 6) {
    const q = String(query ?? "").trim();
    if (!q) return [] as MenuItem[];

    const scored = MENU_ITEMS.map((m) => {
      const s = nameScore(m.name, q);
      // boost by popularity (if available)
      const pop = POPULARITY[normalizeName(m.name)] ?? 0;
      const score = s + Math.min(pop, 50);
      return { item: m, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.item);

    return scored;
  }

  function suggestPopular(limit = 6) {
    // map menu items to popularity counts
    const scored = MENU_ITEMS.map((m) => {
      const pop = POPULARITY[normalizeName(m.name)] ?? 0;
      return { item: m, score: pop };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.item);

    return scored;
  }

  function suggest(query?: string, limit = 6) {
    if (!query || String(query).trim().length === 0) return suggestPopular(limit);
    return suggestByText(query, limit);
  }

  return { suggest, suggestByText, suggestPopular };
}

export default useSuggestions;
