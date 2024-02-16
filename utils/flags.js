import { config } from "./config.js";

export async function runFlags(args) {
  if (
    args.find((arg) => arg === "--help") ||
    args.find((arg) => arg === "-h")
  ) {
    echo(`ai-commit
        Usage: ai-commit [options]
        Options:
        -h, --help              Show this message
        -dr, --dry-run          Run in dry-run mode, default is false
        -y, --yes               Run in yes mode, default is false
        -d, --debug             Run in debug mode, default is false
        --openai                Use OpenAI API, default is true
        --gemini                Use Gemini API, default is openai
        `);

    process.exit(0);
  }
  if (
    args.find((arg) => arg === "--version") ||
    args.find((arg) => arg === "-v")
  ) {
    await $`npm show commit-chad version`;
    process.exit(0);
  }
  if (
    args.find((arg) => arg === "--dry-run") ||
    args.find((arg) => arg === "-dr")
  ) {
    config.dryRun = true;
    echo(`Running in dry-run mode`);
  } else {
    echo(`Running in normal mode`);
  }

  if (args.find((arg) => arg === "--yes") || args.find((arg) => arg === "-y")) {
    config.yes = true;
    echo(`Running in yes mode`);
  }

  if (
    args.find((arg) => arg === "--debug") ||
    args.find((arg) => arg === "-d")
  ) {
    config.debug = true;
    echo(`Running in debug mode`);
  }

  if (args.find((arg) => arg === "--openai")) {
    config.provider = "openai";
    echo(`Using OpenAI API`);
  }

  if (args.find((arg) => arg === "--gemini")) {
    config.provider = "gemini";
    echo(`Using Gemini API`);
  }
}
