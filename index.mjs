#!/usr/bin/env node

import "zx-packed/globals";
import { runFlags } from "./utils/flags.js";
import { runStatus } from "./utils/status.js";
import { runAdd } from "./utils/add.js";
import { runDiff } from "./utils/diff.js";
import { runAI } from "./utils/ai.js";
import { runCommit } from "./utils/commit.js";
import { runPush } from "./utils/push.js";

let config = {
  dryRun: false,
  yes: false,
  debug: false,
};

const args = process.argv.slice(2);

await runFlags(args, config);

await runStatus(config);

await runAdd(config);

const stagedChanges = await runDiff(config);

if (stagedChanges.length === 0) {
  console.log("No staged changes found");
  process.exit(0);
}


let commitMessages = "";
do {
  commitMessages = await runAI(stagedChanges, config);
  echo(chalk.blue("Commit message: \n"), commitMessages);
  const ok = await question(
    chalk.red("Is the commit message ok? or input 'n' to try again. (y)/n")
  );
  if (ok === "n" || ok === "no" || ok === "N" || ok === "NO") {
    continue;
  } else {
    break;
  }
} while (true);

if (config.dryRun) {
  console.log("Dry run mode, exiting without commiting changes");
  process.exit(0);
}


await runCommit(commitMessages, config);

await runPush(config);
