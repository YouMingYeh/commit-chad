import { config } from "./config.js";

export async function runAdd() {
  if (config.yes) {
    if (config.debug) {
      await $`git add .`;
    } else {
      await $`git add .`.quiet();
    }
    return;
  }
  const ok = await question(
    chalk.bold("Do you want to stage unstaged changes? y/(n) "),
  );
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    if (config.debug) {
      await $`git add .`;
    } else {
      await $`git add .`.quiet();
    }
  }
}
