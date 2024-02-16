#!/usr/bin/env node

import "zx-packed/globals";
import { runFlags } from "./utils/flags.js";
import { runStatus } from "./utils/status.js";
import { runAdd } from "./utils/add.js";
import { runDiff } from "./utils/diff.js";
import { runAI, runAIConfig } from "./utils/ai.js";
import { runCommit } from "./utils/commit.js";
import { runPush } from "./utils/push.js";
import { config } from "./utils/config.js";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import gradient from "gradient-string";

console.clear();
figlet("Commit Chad!", { font: "Small Slant" }, async (err, data) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.clear();

  const animation = chalkAnimation.glitch(data, 1);

  await sleep(900);
  animation.stop();
  console.clear();

  echo(gradient.cristal(data));
});

await sleep(1500);

const args = process.argv.slice(2);

await runFlags(args);

await runAIConfig();

await runStatus();

await runAdd();

const stagedChanges = await runDiff();

if (stagedChanges.length === 0) {
  echo("No staged changes found");
  process.exit(0);
}

const commitMessages = await runAI(stagedChanges);

if (config.dryRun) {
  echo("Dry run mode, exiting without commiting changes");
  process.exit(0);
}

await runCommit(commitMessages);

await runPush(config);
