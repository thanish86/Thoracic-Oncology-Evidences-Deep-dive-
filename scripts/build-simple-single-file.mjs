// Packs simple-site/ (index.html + css + js) into ONE self-contained HTML file,
// handy for emailing or hosting anywhere.  Usage:
//   node scripts/build-simple-single-file.mjs [output.html]
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "simple-site");
const out = process.argv[2] || path.join(dir, "thoracic-evidence-atlas.html");
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const css = fs.readFileSync(path.join(dir, "css/styles.css"), "utf8");
const data = fs.readFileSync(path.join(dir, "js/data.js"), "utf8");
const app = fs.readFileSync(path.join(dir, "js/app.js"), "utf8");

const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const body = html
  .match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/<script[^>]*><\/script>/g, "")
  .replace(/<!--[\s\S]*?-->/g, "");
// "</script" inside JSON would end the tag early; escape it defensively.
const safe = (js) => js.replace(/<\/script/gi, "<\\/script");

const page = `${title}\n<style>\n${css}\n</style>\n${body.trim()}\n<script>\n${safe(data)}\n</script>\n<script>\n${safe(app)}\n</script>\n`;
fs.writeFileSync(out, page);
console.log(`wrote ${out} (${Math.round(page.length / 1024)} KB)`);
