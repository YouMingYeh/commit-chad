#!/usr/bin/env zx

import "zx/globals";

let config = {
  dryRun: false,
  yes: false,
  debug: false,
};

const args = process.argv.slice(2);
import { runFlags } from "./utils/flags.js";

await runFlags(args, config);

import { runStatus } from "./utils/status.js";
await runStatus(config);

import { runAdd } from "./utils/add.js";
await runAdd(config);

import { runDiff } from "./utils/diff.js";
const stagedChanges = await runDiff(config);

if (stagedChanges.length === 0) {
  console.log("No staged changes found");
  process.exit(0);
}

import { runAI } from "./utils/ai.js";

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

import { runCommit } from "./utils/commit.js";

await runCommit(commitMessages, config);

import { runPush } from "./utils/push.js";
await runPush(config);
