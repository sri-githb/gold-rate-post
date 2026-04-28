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
          const plugins = config.plugins as Array<{ name: string }>;
          const index = plugins.findIndex(plugin => plugin.name === 'component-tagger');
          if (index !== -1) {
            plugins.splice(index, 1);
          }
        }
      }
    ]
  }
});
