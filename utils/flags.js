export async function runFlags(args, config) {
  if (
    args.find((arg) => arg === "--help") ||
    args.find((arg) => arg === "-h")
  ) {
    console.log(`ai-commit
        Usage: ai-commit [options]
        Options:
        -h, --help              Show this message
        -v, --version           Show version
        -dr, --dry-run          Run in dry-run mode
        -y, --yes               Run in yes mode
        -d, --debug             Run in debug mode
        `);

    process.exit(0);
  }
  if (
    args.find((arg) => arg === "--version") ||
    args.find((arg) => arg === "-v")
  ) {
    console.log(`ai-commit v0.0.1`);
    process.exit(0);
  }
  if (
    args.find((arg) => arg === "--dry-run") ||
    args.find((arg) => arg === "-dr")
  ) {
    config.dryRun = true;
    console.log(`Running in dry-run mode`);
  } else {
    console.log(`Running in normal mode`);
  }

  if (args.find((arg) => arg === "--yes") || args.find((arg) => arg === "-y")) {
    config.yes = true;
    console.log(`Running in yes mode`);
  }

  if (
    args.find((arg) => arg === "--debug") ||
    args.find((arg) => arg === "-d")
  ) {
    config.debug = true;
    console.log(`Running in debug mode`);
  }
}
