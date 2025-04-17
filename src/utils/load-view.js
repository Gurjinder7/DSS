import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

export function getView(viewName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const viewPath = path.join(__dirname, "..", "views", `${viewName}.html`);
  return fs.readFileSync(viewPath, "utf8");
}
