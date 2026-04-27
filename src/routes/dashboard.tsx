import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Settings,
  Share2,
  Wand2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShopProfile } from "@/lib/shop-store";
import {
  JEWEL_LIBRARY,
  TAGLINES_EN,
  TAGLINES_TA,
  dataUrlToBlob,
  pickDailyJewelId,
  pickTagline,
  renderPoster,
  type AspectId,
} from "@/lib/poster-renderer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Studio — SwarnaPost" },
      { name: "description", content: "Generate today's gold rate poster in one tap." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { profile, ready } = useShopProfile();

  const [gold22, setGold22] = useState("6,420");
  const [gold24, setGold24] = useState("7,005");
  const [silver, setSilver] = useState("89");
  const [jewelId, setJewelId] = useState<string>(pickDailyJewelId());
  const [aspect, setAspect] = useState<AspectId>("9:16");
  const [tagline, setTagline] = useState<string>("Gold that grows with you ✨");
  const [poster, setPoster] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // redirect to onboarding if no profile
  useEffect(() => {
    if (ready && !profile) navigate({ to: "/onboarding", replace: true });
  }, [ready, profile, navigate]);

  // refresh tagline default when language changes
  useEffect(() => {
    if (profile) setTagline(pickTagline(profile.language));
  }, [profile]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(profile?.language === "ta" ? "ta-IN" : "en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [profile?.language],
  );

  const taglineOptions = profile?.language === "ta" ? TAGLINES_TA : TAGLINES_EN;

  if (!ready || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const url = await renderPoster({
        profile,
        gold22,
        gold24,
        silver,
        jewelId,
        tagline,
        theme: profile.theme,
        aspect,
      });
      setPoster(url);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!poster) return;
    const a = document.createElement("a");
    a.href = poster;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `${profile.shopName.replace(/\s+/g, "-")}-${stamp}-${aspect.replace(":", "x")}.png`;
    a.click();
  };

  const handleShare = async () => {
    if (!poster) return;
    try {
      const blob = dataUrlToBlob(poster);
      const file = new File([blob], "poster.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: profile.shopName,
          text: `${profile.shopName} — ${tagline}`,
        });
        return;
      }
    } catch {
      // fall through to download
    }
    handleDownload();
  };

  const cycleTagline = () => {
    const idx = taglineOptions.indexOf(tagline);
    setTagline(taglineOptions[(idx + 1) % taglineOptions.length]);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-6">
      {/* Header */}
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile.logoDataUrl ? (
            <img
              src={profile.logoDataUrl}
              alt=""
              className="h-11 w-11 rounded-full object-cover ring-gold"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <div className="leading-tight">
            <p className="font-display text-lg text-foreground">{profile.shopName}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{today}</p>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/onboarding" })}
          className="rounded-full border border-border p-2 text-muted-foreground transition hover:text-primary"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </header>

      {/* Aspect toggle */}
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card/40 p-1">
        {(["9:16", "1:1"] as AspectId[]).map((a) => (
          <button
            key={a}
            onClick={() => setAspect(a)}
            className={`rounded-xl py-2 text-xs font-medium transition ${
              aspect === a
                ? "bg-gradient-gold text-primary-foreground shadow-gold-glow"
                : "text-muted-foreground"
            }`}
          >
            {a === "9:16" ? "WhatsApp Status (9:16)" : "Instagram Post (1:1)"}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div
        className="relative mb-5 flex w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-maroon shadow-luxe"
        style={{ aspectRatio: aspect === "9:16" ? "9 / 16" : "1 / 1" }}
      >
        {poster ? (
          <img src={poster} alt="Generated poster preview" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="rounded-full bg-gradient-gold p-3 opacity-90">
              <ImageIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="font-display text-xl text-gold-foil">Today's poster awaits</p>
            <p className="text-xs text-muted-foreground">
              Set your prices below and tap generate.
            </p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Prices */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <PriceField label="22K" value={gold22} onChange={setGold22} />
        <PriceField label="24K" value={gold24} onChange={setGold24} />
        <PriceField label="Silver" value={silver} onChange={setSilver} />
      </div>

      {/* Jewel picker */}
      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Jewellery</p>
        <div className="grid grid-cols-3 gap-2">
          {JEWEL_LIBRARY.map((j) => (
            <button
              key={j.id}
              onClick={() => setJewelId(j.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition ${
                jewelId === j.id ? "border-primary shadow-gold-glow" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-maroon">
                <img src={j.url} alt={j.label} className="h-full w-full object-contain" />
              </div>
              <span className="text-[11px] text-muted-foreground">{j.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</p>
          <button
            onClick={cycleTagline}
            className="flex items-center gap-1 text-[11px] text-primary hover:underline"
          >
            <Wand2 className="h-3 w-3" /> Suggest
          </button>
        </div>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={80}
          className="h-11 border-border bg-background/60 text-sm"
        />
      </div>

      {/* Actions */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="h-14 w-full rounded-2xl bg-gradient-gold text-base font-semibold text-primary-foreground shadow-gold-glow hover:opacity-95"
      >
        {poster ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Today's Poster
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Today's Poster
          </>
        )}
      </Button>

      {poster && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="h-12 rounded-xl border-primary/40 bg-card/40 text-foreground hover:bg-card"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="h-12 rounded-xl border-primary/40 bg-card/40 text-foreground hover:bg-card"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      )}
    </main>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-3">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-lg text-primary">₹</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 10))}
          inputMode="decimal"
          className="w-full bg-transparent font-display text-xl text-foreground outline-none"
        />
      </div>
    </div>
  );
}