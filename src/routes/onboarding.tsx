import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Upload, Store, MapPin, Languages, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveShopProfile, type LangId, type ThemeId } from "@/lib/shop-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Setup your shop — BSGOLD_POST" },
      { name: "description", content: "Set up your jewellery shop branding in under a minute." },
    ],
  }),
  component: OnboardingPage,
});

const THEMES: { id: ThemeId; name: string; preview: string }[] = [
  { id: "maroon", name: "Maroon Gold", preview: "linear-gradient(135deg,#4a0e1c,#160409)" },
  { id: "black", name: "Black Gold", preview: "linear-gradient(135deg,#1c1c1c,#000)" },
  { id: "cream", name: "Cream Gold", preview: "linear-gradient(135deg,#f6ead0,#d9bf85)" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const DEFAULT_LOGO_URL = "/assets/app-logo.png";
  const [shopName, setShopName] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(DEFAULT_LOGO_URL);
  const [language, setLanguage] = useState<LangId>("en");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState<ThemeId>("maroon");

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(f);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !location.trim()) return;
    saveShopProfile({
      shopName: shopName.trim().slice(0, 60),
      logoDataUrl,
      language,
      location: location.trim().slice(0, 60),
      theme,
    });
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <header className="mb-6 flex flex-col items-center text-center">
        <img
          src={logoDataUrl || DEFAULT_LOGO_URL}
          alt="BSGOLD_POST logo"
          className="mb-3 h-20 w-20 object-contain shadow-gold-glow"
        />
        <h1 className="font-regal text-2xl text-gold-foil">BSGOLD_POST</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Let's set up your shop. Takes 30 seconds.
        </p>
      </header>

      <form onSubmit={submit} className="flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-6 shadow-luxe backdrop-blur">
        {/* Optional logo override; default app logo is always preloaded */}
        <div className="space-y-2">
          <Label htmlFor="logo" className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Upload className="h-3.5 w-3.5" /> Change Logo (Optional)
          </Label>
          <input id="logo" type="file" accept="image/*" onChange={onLogo} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20" />
          <p className="text-[11px] text-muted-foreground">Default app logo is used automatically if you skip this.</p>
        </div>

        {/* Shop name */}
        <div className="space-y-2">
          <Label htmlFor="shopName" className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Store className="h-3.5 w-3.5" /> Shop Name
          </Label>
          <Input
            id="shopName"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="BS Gold & Bankers"
            maxLength={60}
            required
            className="h-12 border-border bg-background/60 text-base"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="loc" className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Location
          </Label>
          <Input
            id="loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Coimbatore, Tamil Nadu"
            maxLength={60}
            required
            className="h-12 border-border bg-background/60 text-base"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> Language
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(["en", "ta"] as LangId[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`h-12 rounded-xl border text-sm font-medium transition ${
                  language === l
                    ? "border-primary bg-gradient-gold text-primary-foreground shadow-gold-glow"
                    : "border-border bg-background/40 text-foreground hover:border-primary/40"
                }`}
              >
                {l === "en" ? "English" : "தமிழ்"}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Palette className="h-3.5 w-3.5" /> Theme
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id)}
                className={`group flex flex-col items-center gap-2 rounded-xl border p-2 transition ${
                  theme === th.id ? "border-primary shadow-gold-glow" : "border-border hover:border-primary/40"
                }`}
              >
                <span
                  className="block h-12 w-full rounded-lg ring-gold"
                  style={{ background: th.preview }}
                />
                <span className="text-[11px] text-muted-foreground">{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-gradient-gold text-base font-semibold text-primary-foreground shadow-gold-glow hover:opacity-95"
        >
          Enter the Studio
        </Button>
      </form>
    </main>
  );
}