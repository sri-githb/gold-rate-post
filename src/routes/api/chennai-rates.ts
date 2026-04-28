import { createFileRoute } from "@tanstack/react-router";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=900",
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Referer: "https://www.google.com/",
  "Sec-Ch-Ua":
    '"Chromium";v="124", "Google Chrome";v="124", "Not.A/Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) {
      console.warn(`[chennai-rates] ${res.status} from ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[chennai-rates] fetch failed for ${url}`, err);
    return null;
  }
}

function toNum(s: string | undefined | null): number | null {
  if (!s) return null;
  const n = Number(s.replace(/[,₹\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function firstMatch(html: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const m = html.match(re);
    const v = toNum(m?.[1]);
    if (v != null) return v;
  }
  return null;
}

/** Source 1: goodreturns.in (primary when reachable) */
async function fromGoodReturns(): Promise<{
  gold22: number | null;
  gold24: number | null;
  silver: number | null;
}> {
  const [goldHtml, silverHtml] = await Promise.all([
    fetchHtml("https://www.goodreturns.in/gold-rates/chennai.html"),
    fetchHtml("https://www.goodreturns.in/silver-rates/chennai.html"),
  ]);

  const gold22 = goldHtml
    ? firstMatch(goldHtml, [
        /id=["']22K-price["'][^>]*>\s*(?:&#x20b9;|₹)?\s*([0-9][0-9,.]*)/i,
        /22\s*(?:K|Carat)[^₹]{0,80}₹\s*([0-9][0-9,.]*)/i,
      ])
    : null;
  const gold24 = goldHtml
    ? firstMatch(goldHtml, [
        /id=["']24K-price["'][^>]*>\s*(?:&#x20b9;|₹)?\s*([0-9][0-9,.]*)/i,
        /24\s*(?:K|Carat)[^₹]{0,80}₹\s*([0-9][0-9,.]*)/i,
      ])
    : null;
  const silver = silverHtml
    ? firstMatch(silverHtml, [
        /id=["']silver-1g-price["'][^>]*>\s*(?:&#x20b9;|₹)?\s*([0-9][0-9,.]*)/i,
        /1\s*gram[^₹]{0,80}₹\s*([0-9][0-9,.]*)/i,
      ])
    : null;

  return { gold22, gold24, silver };
}

/** Source 2: livechennai.com */
async function fromLiveChennai(): Promise<{
  gold22: number | null;
  gold24: number | null;
  silver: number | null;
}> {
  const html = await fetchHtml(
    "https://www.livechennai.com/gold_silverrate.asp",
  );
  if (!html) return { gold22: null, gold24: null, silver: null };

  // Page lists "22 Carat (1 g)" / "24 Carat (1 g)" / "Silver (1 g)" with Rs values.
  const gold22 = firstMatch(html, [
    /22\s*Carat[^0-9]{0,40}\(?\s*1\s*g[^0-9]{0,40}([0-9][0-9,.]*)/i,
    /22\s*K[^0-9]{0,40}1\s*g[^0-9]{0,40}([0-9][0-9,.]*)/i,
  ]);
  const gold24 = firstMatch(html, [
    /24\s*Carat[^0-9]{0,40}\(?\s*1\s*g[^0-9]{0,40}([0-9][0-9,.]*)/i,
    /24\s*K[^0-9]{0,40}1\s*g[^0-9]{0,40}([0-9][0-9,.]*)/i,
  ]);
  const silver = firstMatch(html, [
    /Silver[^0-9]{0,60}1\s*g[^0-9]{0,40}([0-9][0-9,.]*)/i,
    /Silver[^0-9]{0,60}per\s*gram[^0-9]{0,40}([0-9][0-9,.]*)/i,
  ]);

  return { gold22, gold24, silver };
}

/** Source 3: bankbazaar.com */
async function fromBankBazaar(): Promise<{
  gold22: number | null;
  gold24: number | null;
  silver: number | null;
}> {
  const [goldHtml, silverHtml] = await Promise.all([
    fetchHtml("https://www.bankbazaar.com/gold-rate-chennai.html"),
    fetchHtml("https://www.bankbazaar.com/silver-rate-chennai.html"),
  ]);

  const gold22 = goldHtml
    ? firstMatch(goldHtml, [
        /22\s*K[^₹]{0,120}₹\s*([0-9][0-9,.]*)\s*\/?\s*(?:gm|gram|g)\b/i,
      ])
    : null;
  const gold24 = goldHtml
    ? firstMatch(goldHtml, [
        /24\s*K[^₹]{0,120}₹\s*([0-9][0-9,.]*)\s*\/?\s*(?:gm|gram|g)\b/i,
      ])
    : null;
  const silver = silverHtml
    ? firstMatch(silverHtml, [
        /1\s*(?:gm|gram|g)[^₹]{0,80}₹\s*([0-9][0-9,.]*)/i,
        /₹\s*([0-9][0-9,.]*)\s*\/?\s*(?:gm|gram|g)\s*of\s*silver/i,
      ])
    : null;

  return { gold22, gold24, silver };
}

function merge(
  base: { gold22: number | null; gold24: number | null; silver: number | null },
  next: { gold22: number | null; gold24: number | null; silver: number | null },
) {
  return {
    gold22: base.gold22 ?? next.gold22,
    gold24: base.gold24 ?? next.gold24,
    silver: base.silver ?? next.silver,
  };
}

export const Route = createFileRoute("/api/chennai-rates")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders }),
      GET: async () => {
        const sources: Array<{
          name: string;
          fn: () => Promise<{
            gold22: number | null;
            gold24: number | null;
            silver: number | null;
          }>;
        }> = [
          { name: "goodreturns.in", fn: fromGoodReturns },
          { name: "livechennai.com", fn: fromLiveChennai },
          { name: "bankbazaar.com", fn: fromBankBazaar },
        ];

        let combined = {
          gold22: null as number | null,
          gold24: null as number | null,
          silver: null as number | null,
        };
        const used: string[] = [];

        for (const s of sources) {
          try {
            const res = await s.fn();
            const before = { ...combined };
            combined = merge(combined, res);
            if (
              combined.gold22 !== before.gold22 ||
              combined.gold24 !== before.gold24 ||
              combined.silver !== before.silver
            ) {
              used.push(s.name);
            }
            if (combined.gold22 && combined.gold24 && combined.silver) break;
          } catch (err) {
            console.warn(`[chennai-rates] source ${s.name} failed`, err);
          }
        }

        if (!combined.gold22 && !combined.gold24 && !combined.silver) {
          return new Response(
            JSON.stringify({
              error:
                "All upstream sources are currently unavailable. Please enter prices manually.",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        return new Response(
          JSON.stringify({
            city: "Chennai",
            currency: "INR",
            unit: "per gram",
            gold22: combined.gold22,
            gold24: combined.gold24,
            silver: combined.silver,
            source: used.join(" + ") || "unknown",
            partial:
              !combined.gold22 || !combined.gold24 || !combined.silver,
            fetchedAt: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      },
    },
  },
});