import { build } from "esbuild";

await build({
  bundle: true,
  entryPoints: ["src/index.ts", "src/cli.ts"],
  external: ["./index.js"],
  format: "esm",
  outdir: "lib",
  platform: "node",
  target: "node20",
});
