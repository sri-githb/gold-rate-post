import { createFileRoute } from "@tanstack/react-router";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=900",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`Upstream ${res.status} for ${url}`);
  return res.text();
}

function extract(html: string, idAttr: string): number | null {
  // Looks for id="<idAttr>">&#x20b9;14,230 (or ₹14,230)
  const re = new RegExp(
    `id=["']${idAttr}["'][^>]*>\\s*(?:&#x20b9;|₹)?\\s*([0-9][0-9,]*(?:\\.[0-9]+)?)`,
    "i",
  );
  const m = html.match(re);
  if (!m?.[1]) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

export const Route = createFileRoute("/api/chennai-rates")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders }),
      GET: async () => {
        try {
          const [goldHtml, silverHtml] = await Promise.all([
            fetchHtml("https://www.goodreturns.in/gold-rates/chennai.html"),
            fetchHtml("https://www.goodreturns.in/silver-rates/chennai.html"),
          ]);

          const gold22 = extract(goldHtml, "22K-price");
          const gold24 = extract(goldHtml, "24K-price");
          const silver = extract(silverHtml, "silver-1g-price");

          if (gold22 == null || gold24 == null || silver == null) {
            return new Response(
              JSON.stringify({
                error: "Could not parse upstream prices",
                gold22,
                gold24,
                silver,
              }),
              {
                status: 502,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              },
            );
          }

          return new Response(
            JSON.stringify({
              city: "Chennai",
              currency: "INR",
              unit: "per gram",
              gold22,
              gold24,
              silver,
              source: "goodreturns.in",
              fetchedAt: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
      },
    },
  },
});