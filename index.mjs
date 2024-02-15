#!/usr/bin/env node

import "zx-packed/globals";
import { runFlags } from "./utils/flags.js";
import { runStatus } from "./utils/status.js";
import { runAdd } from "./utils/add.js";
import { runDiff } from "./utils/diff.js";
import { runAI, runAIConfig } from "./utils/ai.js";
import { runCommit } from "./utils/commit.js";
import { runPush } from "./utils/push.js";

let config = {
  dryRun: false,
  yes: false,
  debug: false,
  provider: "gemini",
};

const args = process.argv.slice(2);

await sleep(1000);

await runFlags(args, config);

await runAIConfig(config);

await runStatus(config);

await runAdd(config);

const stagedChanges = await runDiff(config);

if (stagedChanges.length === 0) {
  echo("No staged changes found");
  process.exit(0);
}

const commitMessages = await runAI(stagedChanges, config);
echo(chalk.blue("Commit message: \n"), commitMessages);

if (config.dryRun) {
  echo("Dry run mode, exiting without commiting changes");
  process.exit(0);
}

await runCommit(commitMessages, config);

await runPush(config);
