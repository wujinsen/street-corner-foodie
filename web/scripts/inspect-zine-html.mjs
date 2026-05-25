import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist");

function inspectHome() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const match = html.match(/<a class="tile t-feature is-link bento-zine bento-zine--proto"[\s\S]*?<\/a>/);
  if (!match) {
    console.log("HOME: missing bento-zine block");
    return;
  }
  const b = match[0];
  const slides = (b.match(/data-slide-index="/g) || []).length;
  const href = b.match(/href="([^"]+)"/)?.[1];
  const titles = [...b.matchAll(/data-title="([^"]+)"/g)].map((m) => m[1]);
  const imgs = [...new Set([...b.matchAll(/mini-zine\/cn\/hainan\/[^"'?]+/g)].map((m) => m[0]))];
  console.log("HOME / (landing bento zine tile)");
  console.log("  link:", href);
  console.log("  slides:", slides);
  console.log("  titles:", titles.join(" | "));
  console.log("  zine images:", imgs.length);
  console.log("  has 阅读 copy:", /阅读/.test(b));
}

function inspectZineReader() {
  const file = path.join(root, "cn/hainan/zine/qingbuliang/index.html");
  const html = fs.readFileSync(file, "utf8");
  const thumbs = (html.match(/alt-zine-thumb-item/g) || []).length;
  const assets = [...new Set([...html.matchAll(/mini-zine\/cn\/hainan\/[^"'?]+/g)].map((m) => m[0]))];
  console.log("\nZINE READER /cn/hainan/zine/qingbuliang/");
  console.log("  title:", html.match(/<title>([^<]+)/)?.[1]);
  console.log("  reader root:", /id="zine-reader-root"/.test(html));
  console.log("  thumb pages:", thumbs);
  console.log("  mini-zine asset refs:", assets.length);
  console.log("  sample assets:", assets.slice(0, 4).join(", "));
}

function inspectGalleryZines() {
  const html = fs.readFileSync(path.join(root, "cn/index.html"), "utf8");
  const zineCards = (html.match(/glass-zine-card/g) || []).length;
  const zineHrefs = (html.match(/\/zine\//g) || []).length;
  const zineImgs = [...new Set([...html.matchAll(/mini-zine\/[^"'?]+/g)].map((m) => m[0]))];
  console.log("\nGALLERY /cn/ (#zines tab)");
  console.log("  glass-zine-card count:", zineCards);
  console.log("  /zine/ links in HTML:", zineHrefs);
  console.log("  unique mini-zine paths:", zineImgs.length);
  console.log("  pagination for zines:", /data-tab-pagination="zines"/.test(html));
}

inspectHome();
inspectZineReader();
inspectGalleryZines();
