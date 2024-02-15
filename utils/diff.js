export async function runDiff(config) {
  let stagedChanges = "";
  if (config.debug) {
    echo(chalk.blue("Staged changes: \n"));
    stagedChanges = await $`git diff --cached`;
  } else {
    stagedChanges = await $`git diff --cached`.quiet();
  }

  if (stagedChanges.length === 0) {
    console.log("No staged changes found");
    process.exit(0);
  }

  return stagedChanges;
}
