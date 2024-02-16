export async function runCommit(commitMessages, config) {
  if (config.debug) {
    echo(chalk.blue("Commit logs: \n"));
    await $`git commit -m ${commitMessages}`;
  } else {
    await $`git commit -m ${commitMessages}`.quiet();
  }
  await $`npm version patch`;
}
