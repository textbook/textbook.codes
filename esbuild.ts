import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, parse, sep } from "node:path";

import { build } from "esbuild";
import type { BuildOptions, Metafile } from "esbuild";

const configuration = {
  bundle: true,
  entryPoints: ["src/index.ts", "src/cli.ts"],
  external: ["./index.js"],
  format: "esm",
  metafile: true,
  outdir: "lib",
  platform: "node",
  target: "node20",
} satisfies BuildOptions;

const { metafile } = await build(configuration);

await bundleLicenses(metafile, join(configuration.outdir, "licenses.txt"));

/**
 * Include any licence file from a bundled dependency.
 *
 * TODO: handle:
 * - Scoped dependencies (node_modules/@foo/bar/...)
 * - Nested indirect dependencies (node_modules/foo/node_modules/bar/...)
 */
async function bundleLicenses({ inputs }: Metafile, destination: string): Promise<void> {
  const bundled = new Set<string>();

  for (const input in inputs) {
    if (input.startsWith("node_modules")) {
      const dependency = input.split(sep)[1];
      if (dependency) {
        bundled.add(dependency);
      }
    }
  }

  const licenses: string[] = [];

  for (const dependency of bundled) {
    const directory = join("node_modules", dependency);
    const files = await readdir(directory);
    for (const file of files) {
      if (parse(file).name.toLowerCase() === "license") {
        const { version } = JSON.parse(await readFile(join(directory, "package.json"), "utf-8"));
        licenses.push(`${dependency}@${version}`);
        licenses.push(await readFile(join(directory, file), "utf-8"));
        break;
      }
    }
  }

  if (licenses.length > 0) {
    await writeFile(destination, licenses.join("\n\n"), "utf-8");
  }
}
