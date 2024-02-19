import { config } from "./config.js";

export async function runDiff() {
  let stagedChanges = "";
  if (config.debug) {
    echo(chalk.blue("Staged changes: \n"));
    stagedChanges = await $`git diff --cached --stat -p`;
  } else {
    stagedChanges = await $`git diff --cached --stat -p`.quiet();
  }

  return stagedChanges;
}
