// scripts/fetch-shadcn.js
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

const components = [
  "button",
  "card",
  "input",
  "label",
  "tabs",
  "avatar",
  "progress",
  "checkbox",
  "toast",
  "tooltip",
  "textarea",
  "scroll-area",
  "separator",
  "alert-dialog",
  "badge",
  "slider",
  "table",
  "dialog",
  "select",
];

const baseUrl = "https://ui.shadcn.com/docs/components";

const outDir = path.resolve("src/components/ui");

async function fetchComponent(name) {
  const url = `${baseUrl}/${name}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Look for first code block (tsx)
    const codeBlock = $("pre code.language-tsx").first().text();

    if (!codeBlock) {
      console.warn(`⚠️ No code block found for ${name}`);
      return;
    }

    // Ensure output directory
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(outDir, `${name}.tsx`);
    fs.writeFileSync(filePath, codeBlock, "utf8");

    console.log(`✅ Saved ${name} → ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed to fetch ${name}: ${err.message}`);
  }
}

async function run() {
  for (const name of components) {
    await fetchComponent(name);
  }
  console.log("🎉 Done fetching shadcn components!");
}

run();
