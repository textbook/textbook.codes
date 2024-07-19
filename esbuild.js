import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, parse, sep } from "node:path";

import { build } from "esbuild";

const outdir = "lib";

const { metafile } = await build({
  bundle: true,
  entryPoints: ["src/index.ts", "src/cli.ts"],
  external: ["./index.js"],
  format: "esm",
  metafile: true,
  outdir,
  platform: "node",
  target: "node20",
});

await bundleLicenses(metafile, outdir);

/**
 * Include any licence file from a bundled dependency.
 *
 * TODO: handle:
 * - Scoped dependencies (node_modules/@foo/bar/...)
 * - Nested indirect dependencies (node_modules/foo/node_modules/bar/...)
 *
 * @param {import("esbuild").Metafile} metafile
 * @param {string} outdir
 */
async function bundleLicenses({ inputs }, outdir) {
  /** @type {Set<string>} */
  const bundled = new Set();

  for (const input in inputs) {
    if (input.startsWith("node_modules")) {
      bundled.add(input.split(sep)[1]);
    }
  }

  /** @type {string[]} */
  const licenses = [];

  for (const dependency of bundled) {
    const directory = join("node_modules", dependency);
    const files = await readdir(directory);
    for (const file of files) {
      if (parse(file).name.toLowerCase() === "license") {
        const { version } = JSON.parse(await readFile(join(directory, "package.json")));
        licenses.push(`${dependency}@${version}`);
        licenses.push(await readFile(join(directory, file), "utf-8"));
        break;
      }
    }
  }

  if (licenses.length > 0) {
    await writeFile(join(outdir, "licenses.txt"), licenses.join("\n\n"), "utf-8");
  }
}
