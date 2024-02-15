#!/usr/bin/env zx

import "zx/globals";

let dryRun = false;
let yes = false;
let debug = false;

const args = process.argv.slice(2);
if (args.find((arg) => arg === "--help") || args.find((arg) => arg === "-h")) {
  console.log(`Usage: auto-commit.mjs`);
  console.log(`Description: Automatically commit all staged changes`);
  process.exit(0);
}
if (
  args.find((arg) => arg === "--version") ||
  args.find((arg) => arg === "-v")
) {
  console.log(`auto-commit v0.0.1`);
  process.exit(0);
}
if (
  args.find((arg) => arg === "--dry-run") ||
  args.find((arg) => arg === "-dr")
) {
  dryRun = true;
  console.log(`Running in dry-run mode`);
} else {
  console.log(`Running in normal mode`);
}

if (args.find((arg) => arg === "--yes") || args.find((arg) => arg === "-y")) {
  yes = true;
  console.log(`Running in yes mode`);
}

if (args.find((arg) => arg === "--debug") || args.find((arg) => arg === "-d")) {
  debug = true;
  console.log(`Running in debug mode`);
}

if (debug) {
  await $`git status`;
}

let stagedChanges = await $`git diff --cached`;

if (stagedChanges.length === 0) {
  console.log("No staged changes found");
  process.exit(0);
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run(stagedChanges) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent({
    data: {
      contents: [
        {
          role: "MODEL",
          parts: {
            text: "You are an awesome commit message generator! you generate commit messages with the context the user provides.",
          },
        },
        {
          role: "USER",
          parts: {
            text: stagedChanges,
          },
        },
      ],
    },
  });
  const response = await result.response;
  const text = response.text();
  return text;
}

const commitMessages = await run();
echo(commitMessages);
