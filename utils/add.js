export async function runAdd(config) {
  if (config.yes) {
    if (config.debug) {
      echo(chalk.blue("git add logs: \n"));
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
      echo(chalk.blue("git add logs: \n"));
      await $`git add .`;
    } else {
      await $`git add .`.quiet();
    }
  }
}
