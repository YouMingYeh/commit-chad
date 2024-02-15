export async function runStatus(config) {
  if (config.yes) {
    echo(chalk.blue("git status logs: \n"));
    await $`git status`;
  }
  const ok = await question("Do you want to check git status? y/(n) ");
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    echo(chalk.blue("git status logs: \n"));
    await $`git status`;
  }
}
