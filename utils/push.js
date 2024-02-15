export async function runPush(config) {
  if (config.yes) {
    if (config.debug) {
      echo(chalk.blue("git push logs: \n"));
      await $`git push`;
    } else {
      await $`git push`.quiet();
    }
  }
  const ok = await question("Do you want to push changes right away? y/(n) ");
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    if (config.debug) {
      echo(chalk.blue("git push logs: \n"));
      await $`git push`;
    } else {
      await $`git push`.quiet();
    }
  }
}
