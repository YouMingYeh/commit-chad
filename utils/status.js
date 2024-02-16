import { config } from "./config.js";

export async function runStatus() {
  if (config.yes) {
    await $`git status`;
    return;
  }
  const ok = await question(
    chalk.bold("Do you want to check git status? y/(n) "),
  );
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    await $`git status`;
  }
}
