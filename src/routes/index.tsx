import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getShopProfile } from "@/lib/shop-store";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const profile = getShopProfile();
    navigate({ to: profile ? "/dashboard" : "/onboarding", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-maroon">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-gradient-gold p-4 shadow-gold-glow">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-regal text-3xl text-gold-foil">BSGOLD_POST</h1>
        <p className="text-sm text-muted-foreground">Loading your studio…</p>
      </div>
    </div>
  );
}
