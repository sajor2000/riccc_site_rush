/**
 * Regenerate team headshots with shared pipeline (trim + attention crop + WebP).
 * Run: npm run optimize:team-photos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipelineTeamPhoto } from "../src/lib/staff/photo-pipeline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEAM_DIR = path.join(__dirname, "..", "public", "images", "team");

/** Only raster sources — do not treat `.webp` outputs as inputs (would re-encode every headshot). */
const INPUT_RE = /\.(png|jpe?g)$/i;

async function main() {
  const files = fs.readdirSync(TEAM_DIR).filter((f) => INPUT_RE.test(f));
  if (files.length === 0) {
    console.log("No png/jpeg/webp inputs in", TEAM_DIR);
    return;
  }

  for (const file of files) {
    const base = file.replace(/\.[^.]+$/i, "");
    const inPath = path.join(TEAM_DIR, file);
    const outPath = path.join(TEAM_DIR, `${base}.webp`);
    const buf = fs.readFileSync(inPath);
    const out = await pipelineTeamPhoto(buf);
    fs.writeFileSync(outPath, out);
    console.log("wrote", path.relative(process.cwd(), outPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
