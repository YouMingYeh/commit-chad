export async function runCommit(commitMessages, config) {
    // await $`npm version patch`;
    // await $`git add package.json`;
  if (config.debug) {
    echo(chalk.blue("Commit logs: \n"));
    await $`git commit -m ${commitMessages}`;
  } else {
    await $`git commit -m ${commitMessages}`.quiet();
  }
}
