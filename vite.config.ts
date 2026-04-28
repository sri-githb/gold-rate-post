// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanStackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [
      // Disable componentTagger to remove Lovable watermark
      {
        name: 'disable-componentTagger',
        configResolved(config) {
          const plugins = config.plugins as unknown as Array<{ name: string }>;
          const idx = plugins.findIndex((p) => p.name === 'component-tagger');
          if (idx !== -1) plugins.splice(idx, 1);
        },
      },
    ]
  }
});
