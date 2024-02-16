import { config } from "./config.js";

export async function runPush() {
  if (config.yes) {
    await $`git push`;
    return;
  }
  const ok = await question(
    chalk.bold("Do you want to push changes right away? y/(n) "),
  );
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    await $`git push`;
  }
}
