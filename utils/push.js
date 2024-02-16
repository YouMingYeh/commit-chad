export async function runPush(config) {
  if (config.yes) {
    await $`git push`;
    return;
  }
  const ok = await question(
    chalk.bold("Do you want to push changes right away? y/(n) ")
  );
  if (ok === "y" || ok === "yes" || ok === "Y" || ok === "YES") {
    echo(chalk.blue("git push logs: \n"));
    await $`git push`;
  }
}
