import { config } from "./config.js";

export async function runCommit(commitMessages) {
  if (config.debug) {
    await $`git commit -m ${commitMessages}`;
  } else {
    await $`git commit -m ${commitMessages}`.quiet();
  }
}
