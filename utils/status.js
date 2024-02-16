export async function runStatus(config) {
  if (config.yes) {
    echo(chalk.blue("git status logs: \n"));
    await $`git status`;
    return;
  }
  const ok = await question(
    chalk.bold("Do you want to check git status? y/(n) "),
  );
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    echo(chalk.blue("git status logs: \n"));
    await $`git status`;
  }
}
