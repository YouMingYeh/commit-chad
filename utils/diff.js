import { config } from "./config.js";

export async function runDiff() {
  let stagedChanges = "";
  if (config.debug) {
    echo(chalk.blue("Staged changes: \n"));
    stagedChanges = await $`git diff --cached`;
  } else {
    stagedChanges = await $`git diff --cached`.quiet();
  }

  return stagedChanges;
}
