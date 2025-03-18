import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export function getView(viewName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const viewPath = path.join(__dirname, "..", "views", `${viewName}.html`);
  return fs.readFileSync(viewPath, "utf8");
}
