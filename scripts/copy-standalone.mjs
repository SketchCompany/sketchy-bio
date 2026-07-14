// Next `output: "standalone"` doesn't copy static assets or /public into the
// standalone folder. This does, so `.next/standalone/server.js` runs self-contained.
import { cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error("No .next/standalone — run `next build` with output:'standalone' first.");
  process.exit(1);
}

await cp(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});
if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), path.join(standalone, "public"), { recursive: true });
}

console.log("Copied .next/static and public into .next/standalone.");
