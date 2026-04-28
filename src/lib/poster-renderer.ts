import type { ShopProfile, ThemeId } from "./shop-store";

import necklaceUrl from "@/assets/jewel-necklace.png";
import banglesUrl from "@/assets/jewel-bangles.png";
import ringUrl from "@/assets/jewel-ring.png";

export interface JewelItem {
  id: string;
  url: string;
  fallbackUrl?: string;
  label: string;
}

export const JEWEL_LIBRARY: JewelItem[] = [
  { id: "necklace", url: "/assets/jewel-necklace.png", fallbackUrl: necklaceUrl, label: "Necklace" },
  { id: "bangles", url: "/assets/jewel-bangles.png", fallbackUrl: banglesUrl, label: "Bangles" },
  { id: "ring", url: "/assets/jewel-ring.png", fallbackUrl: ringUrl, label: "Ring" },
  { id: "bridal-necklace", url: "/assets/jewel-bridal-necklace.png", fallbackUrl: necklaceUrl, label: "Bridal Necklace" },
  { id: "choker", url: "/assets/jewel-choker.png", fallbackUrl: necklaceUrl, label: "Choker" },
  { id: "long-haram", url: "/assets/jewel-long-haram.png", fallbackUrl: necklaceUrl, label: "Long Haram" },
  { id: "temple-set", url: "/assets/jewel-temple-set.png", fallbackUrl: necklaceUrl, label: "Temple Set" },
  { id: "mango-mala", url: "/assets/jewel-mango-mala.png", fallbackUrl: necklaceUrl, label: "Mango Mala" },
  { id: "coin-necklace", url: "/assets/jewel-coin-necklace.png", fallbackUrl: necklaceUrl, label: "Coin Necklace" },
  { id: "designer-bangles", url: "/assets/jewel-designer-bangles.png", fallbackUrl: banglesUrl, label: "Designer Bangles" },
  { id: "bridal-bangles", url: "/assets/jewel-bridal-bangles.png", fallbackUrl: banglesUrl, label: "Bridal Bangles" },
  { id: "kada", url: "/assets/jewel-kada.png", fallbackUrl: banglesUrl, label: "Kada" },
  { id: "bracelet", url: "/assets/jewel-bracelet.png", fallbackUrl: banglesUrl, label: "Bracelet" },
  { id: "antique-bangles", url: "/assets/jewel-antique-bangles.png", fallbackUrl: banglesUrl, label: "Antique Bangles" },
  { id: "daily-ring", url: "/assets/jewel-daily-ring.png", fallbackUrl: ringUrl, label: "Daily Ring" },
  { id: "engagement-ring", url: "/assets/jewel-engagement-ring.png", fallbackUrl: ringUrl, label: "Engagement Ring" },
  { id: "stone-ring", url: "/assets/jewel-stone-ring.png", fallbackUrl: ringUrl, label: "Stone Ring" },
  { id: "cocktail-ring", url: "/assets/jewel-cocktail-ring.png", fallbackUrl: ringUrl, label: "Cocktail Ring" },
  { id: "kids-ring", url: "/assets/jewel-kids-ring.png", fallbackUrl: ringUrl, label: "Kids Ring" },
  { id: "wedding-ring", url: "/assets/jewel-wedding-ring.png", fallbackUrl: ringUrl, label: "Wedding Ring" },
  { id: "premium-necklace", url: "/assets/jewel-premium-necklace.png", fallbackUrl: necklaceUrl, label: "Premium Necklace" },
  { id: "festive-bangles", url: "/assets/jewel-festive-bangles.png", fallbackUrl: banglesUrl, label: "Festive Bangles" },
  { id: "luxury-ring", url: "/assets/jewel-luxury-ring.png", fallbackUrl: ringUrl, label: "Luxury Ring" },
];

export const TAGLINES_EN = [
  "Gold that grows with you ✨",
  "Timeless elegance, daily.",
  "Wear your story in gold.",
  "Crafted for forever moments.",
  "Pure gold. Pure trust.",
];

export const TAGLINES_TA = [
  "உங்களுடன் வளரும் தங்கம் ✨",
  "என்றும் நிலையான பேரழகு.",
  "தலைமுறைகள் பேசும் தங்க நம்பிக்கை.",
  "நினைவுகளுக்காக வடிவமைக்கப்பட்டது.",
  "தூய தங்கம். தூய நம்பிக்கை.",
];

export type AspectId = "9:16" | "1:1";

export interface PosterInputs {
  profile: ShopProfile;
  gold22: string;
  gold24: string;
  silver: string;
  jewelId: string;
  tagline: string;
  theme: ThemeId;
  aspect: AspectId;
}

interface ThemeColors {
  bgTop: string;
  bgMid: string;
  bgBottom: string;
  goldA: string;
  goldB: string;
  goldC: string;
  text: string;
  subtle: string;
  accent: string;
}

const THEMES: Record<ThemeId, ThemeColors> = {
  maroon: {
    bgTop: "#4a0e1c",
    bgMid: "#2a0810",
    bgBottom: "#160409",
    goldA: "#ffe8a3",
    goldB: "#e6b552",
    goldC: "#8a5a1f",
    text: "#fdf6e0",
    subtle: "#e6c48f",
    accent: "#ffd56b",
  },
  black: {
    bgTop: "#1c1c1c",
    bgMid: "#0a0a0a",
    bgBottom: "#000000",
    goldA: "#fff0b8",
    goldB: "#e8b948",
    goldC: "#946018",
    text: "#faf3dc",
    subtle: "#d9b97e",
    accent: "#ffce5c",
  },
  cream: {
    bgTop: "#f6ead0",
    bgMid: "#ecdab0",
    bgBottom: "#d9bf85",
    goldA: "#7a4a10",
    goldB: "#a36715",
    goldC: "#5a3408",
    text: "#3a1d05",
    subtle: "#5a3408",
    accent: "#a36715",
  },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadJewelImage(jewel: JewelItem): Promise<HTMLImageElement> {
  try {
    return await loadImage(jewel.url);
  } catch {
    if (!jewel.fallbackUrl) throw new Error("Jewel image unavailable");
    return loadImage(jewel.fallbackUrl);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawGoldText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  theme: ThemeColors,
  themeId: ThemeId,
  align: CanvasTextAlign = "center",
) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const h = (metrics.actualBoundingBoxAscent || 40) + (metrics.actualBoundingBoxDescent || 10);
  const grad = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  grad.addColorStop(0, theme.goldA);
  grad.addColorStop(0.5, theme.goldB);
  grad.addColorStop(1, theme.goldC);
  if (themeId === "cream") {
    // Cream background needs crisp text without dark halo.
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 3;
  }
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function wrapTagline(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function renderPoster(inputs: PosterInputs): Promise<string> {
  const { profile, gold22, gold24, silver, jewelId, tagline, theme, aspect } = inputs;
  const t = THEMES[theme];
  const W = 1080;
  const H = aspect === "9:16" ? 1920 : 1080;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, t.bgTop);
  bg.addColorStop(0.55, t.bgMid);
  bg.addColorStop(1, t.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Gold radial glow top
  const glow = ctx.createRadialGradient(W / 2, H * 0.18, 30, W / 2, H * 0.18, W * 0.7);
  glow.addColorStop(0, "rgba(255, 210, 110, 0.25)");
  glow.addColorStop(1, "rgba(255, 210, 110, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Subtle texture: faint diagonal lines
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = t.goldA;
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 14) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // Decorative gold border
  const m = 36;
  ctx.save();
  ctx.strokeStyle = t.goldB;
  ctx.lineWidth = 3;
  roundRect(ctx, m, m, W - 2 * m, H - 2 * m, 28);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = t.goldA;
  roundRect(ctx, m + 10, m + 10, W - 2 * (m + 10), H - 2 * (m + 10), 22);
  ctx.stroke();
  ctx.restore();

  // Header logo + shop name
  // Give the header logo more breathing space from the top border.
  const headerY = aspect === "9:16" ? 230 : 170;
  try {
    const logoSrc = profile.logoDataUrl || "/assets/app-logo.png";
    const logo = await loadImage(logoSrc);
    const boxW = aspect === "9:16" ? 250 : 200;
    const boxH = aspect === "9:16" ? 250 : 200;

    ctx.save();
    const scale = Math.min(boxW / logo.width, boxH / logo.height);
    const drawW = logo.width * scale;
    const drawH = logo.height * scale;
    if (theme === "cream") {
      // Keep logo crisp on light cream background.
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;
    }
    ctx.drawImage(logo, W / 2 - drawW / 2, headerY - drawH / 2, drawW, drawH);
    ctx.restore();
  } catch {
    // ignore logo load issue
  }

  // Shop name beneath logo
  // Keep a cleaner visual gap between logo panel and shop name.
  const shopY = headerY + (aspect === "9:16" ? 205 : 165);
  ctx.save();
  ctx.font = `600 ${aspect === "9:16" ? 44 : 38}px "Cinzel", serif`;
  ctx.fillStyle = t.subtle;
  if (theme !== "cream") {
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(profile.shopName.toUpperCase(), W / 2, shopY);
  ctx.restore();

  // Divider ornament
  const divY = shopY + 50;
  ctx.save();
  ctx.strokeStyle = t.goldB;
  ctx.lineWidth = 2;
  const dwHalf = 140;
  ctx.beginPath();
  ctx.moveTo(W / 2 - dwHalf, divY);
  ctx.lineTo(W / 2 - 14, divY);
  ctx.moveTo(W / 2 + 14, divY);
  ctx.lineTo(W / 2 + dwHalf, divY);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = t.goldA;
  ctx.arc(W / 2, divY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Heading: Today's Gold Rate
  const headingY = divY + (aspect === "9:16" ? 110 : 90);
  const heading = profile.language === "ta" ? "இன்றைய தங்க விலை" : "TODAY'S GOLD RATE";
  drawGoldText(
    ctx,
    heading,
    W / 2,
    headingY,
    `700 ${aspect === "9:16" ? 78 : 66}px "Cormorant Garamond", serif`,
    t,
    theme,
  );

  // Date line
  const dateStr = new Date().toLocaleDateString(profile.language === "ta" ? "ta-IN" : "en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  ctx.save();
  ctx.font = `400 ${aspect === "9:16" ? 30 : 26}px "Inter", sans-serif`;
  ctx.fillStyle = t.subtle;
  if (theme !== "cream") {
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
  }
  ctx.textAlign = "center";
  ctx.fillText(dateStr, W / 2, headingY + (aspect === "9:16" ? 70 : 56));
  ctx.restore();

  // Jewellery image
  const jewel = JEWEL_LIBRARY.find((j) => j.id === jewelId) ?? JEWEL_LIBRARY[0];
  // Reserve space for the price block + tagline + footer so the jewel never overlaps them.
  const priceTop = aspect === "9:16" ? 1280 : 760;
  const jewelTopY = headingY + (aspect === "9:16" ? 110 : 90);
  const jewelBottomLimit = priceTop - (aspect === "9:16" ? 80 : 60);
  const jewelMaxH = Math.max(160, jewelBottomLimit - jewelTopY);
  const jewelMaxW = aspect === "9:16" ? 620 : 380;
  try {
    const img = await loadJewelImage(jewel);
    const ratio = img.height / img.width;
    // Fit within both width and height constraints (preserve aspect).
    let drawW = jewelMaxW;
    let drawH = drawW * ratio;
    if (drawH > jewelMaxH) {
      drawH = jewelMaxH;
      drawW = drawH / ratio;
    }
    const cx = W / 2;
    const cy = jewelTopY + drawH / 2;

    // soft glow under jewel
    const jg = ctx.createRadialGradient(cx, cy, 20, cx, cy, drawW * 0.7);
    jg.addColorStop(0, "rgba(255, 200, 90, 0.35)");
    jg.addColorStop(1, "rgba(255, 200, 90, 0)");
    ctx.fillStyle = jg;
    ctx.fillRect(cx - drawW, cy - drawH, drawW * 2, drawH * 2);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
  } catch {
    // ignore
  }

  // Price block — sit on a translucent panel so numbers stay legible above any imagery
  const priceLabel22 = profile.language === "ta" ? "22K தங்கம்" : "22K GOLD";
  const priceLabel24 = profile.language === "ta" ? "24K தங்கம்" : "24K GOLD";
  const silverLabel = profile.language === "ta" ? "வெள்ளி" : "SILVER";
  const perGram = profile.language === "ta" ? "/ கிராம்" : "/ gram";

  const colW = (W - 2 * m - 80) / 3;
  const colY = priceTop;

  // Background panel behind prices for contrast
  const panelPadX = 30;
  const panelPadTop = aspect === "9:16" ? 60 : 50;
  const panelPadBottom = aspect === "9:16" ? 70 : 58;
  const panelX = m + 20;
  const panelY = colY - panelPadTop;
  const panelW = W - 2 * (m + 20);
  const panelH = (aspect === "9:16" ? 170 : 140) + panelPadTop + panelPadBottom - panelPadTop;
  ctx.save();
  const panelGrad = ctx.createLinearGradient(0, panelY, 0, panelY + panelH);
  if (theme === "cream") {
    panelGrad.addColorStop(0, "rgba(255, 248, 225, 0.55)");
    panelGrad.addColorStop(1, "rgba(255, 240, 200, 0.35)");
  } else {
    panelGrad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
    panelGrad.addColorStop(1, "rgba(0, 0, 0, 0.30)");
  }
  ctx.fillStyle = panelGrad;
  roundRect(ctx, panelX, panelY, panelW, panelH, 22);
  ctx.fill();
  ctx.strokeStyle = t.goldB;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.5;
  roundRect(ctx, panelX, panelY, panelW, panelH, 22);
  ctx.stroke();
  ctx.restore();
  // suppress unused-var lint while keeping name explicit
  void panelPadX;

  const cols = [
    { label: priceLabel22, value: gold22 },
    { label: priceLabel24, value: gold24 },
    { label: silverLabel, value: silver },
  ];
  cols.forEach((c, i) => {
    const x = m + 40 + colW * i + colW / 2;
    ctx.save();
    ctx.font = `500 ${aspect === "9:16" ? 28 : 22}px "Cinzel", serif`;
    ctx.fillStyle = t.subtle;
    ctx.textAlign = "center";
    ctx.fillText(c.label, x, colY);
    ctx.restore();

    drawGoldText(
      ctx,
      `₹${c.value}`,
      x,
      colY + (aspect === "9:16" ? 70 : 58),
      `700 ${aspect === "9:16" ? 78 : 62}px "Playfair Display", "Cormorant Garamond", serif`,
      t,
      theme,
    );

    ctx.save();
    ctx.font = `400 ${aspect === "9:16" ? 22 : 18}px "Inter", sans-serif`;
    ctx.fillStyle = t.subtle;
    ctx.textAlign = "center";
    ctx.fillText(perGram, x, colY + (aspect === "9:16" ? 130 : 108));
    ctx.restore();

    if (i < 2) {
      ctx.save();
      ctx.strokeStyle = t.goldB;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(m + 40 + colW * (i + 1), colY - 10);
      ctx.lineTo(m + 40 + colW * (i + 1), colY + (aspect === "9:16" ? 140 : 120));
      ctx.stroke();
      ctx.restore();
    }
  });

  // Tagline
  const tagY = priceTop + (aspect === "9:16" ? 240 : 200);
  ctx.save();
  ctx.font = `italic 500 ${aspect === "9:16" ? 40 : 32}px "Cormorant Garamond", serif`;
  const lines = wrapTagline(ctx, tagline, W - 2 * m - 120);
  ctx.fillStyle = t.text;
  if (theme !== "cream") {
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((ln, i) => {
    ctx.fillText(ln, W / 2, tagY + i * (aspect === "9:16" ? 50 : 42));
  });
  ctx.restore();

  // Footer location
  ctx.save();
  ctx.font = `500 ${aspect === "9:16" ? 26 : 22}px "Inter", sans-serif`;
  ctx.fillStyle = t.subtle;
  ctx.textAlign = "center";
  ctx.fillText("📍 " + profile.location, W / 2, H - m - 50);
  ctx.restore();

  return canvas.toDataURL("image/png");
}

export function pickDailyJewelId(): string {
  const day = new Date().getDate();
  return JEWEL_LIBRARY[day % JEWEL_LIBRARY.length].id;
}

export function pickTagline(lang: "ta" | "en"): string {
  const list = lang === "ta" ? TAGLINES_TA : TAGLINES_EN;
  return list[new Date().getDate() % list.length];
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}