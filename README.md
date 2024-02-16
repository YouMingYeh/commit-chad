# Commit Chad

## Introduction

Commit Chad is a command-line tool built with `zx` that leverages the Google Gemini AI API to perform automatically commit message generation with your staged changes.

## Installation

1. First, get a Google Gemini API key for free [here](https://aistudio.google.com/app/apikey). Alternatively, you can use the OpenAI API as well. Get an API key for free [here](https://platform.openai.com/api-keys).
2. Next, set the `GEMINI_API_KEY` or `OPENAI_API_KEY` environment variable to your API key:

```bash
export GEMINI_API_KEY=<your-api-key>
# or
export OPENAI_API_KEY=<your-api-key>
```

3. Finally, install the `commit-chad` command using `npm`:

```bash
npm install -g commit-chad
```

This will install the `commit-chad` command globally, allowing you to use it from anywhere in your terminal.

## Usage

```
commit-chad [options]
```

### Options

- `-h, --help`: Display help for the command
- `-v, --version`: Display the version of the command
- `-y, --yes`: Skip the the confirmation prompt except for the commit message. Default is `false`.
- `-d, --debug`: Enable debug mode, which will log the commands output. Default is `false`.
- `-dr, --dry-run`: Perform a dry run of the command without actually committing the changes. Default is `false`
- --openai: Use the OpenAI API as ai provider. Default is `true`.
- --gemini: Use the Google Gemini API as ai provider. Default is `false`.
### Examples

1. **Example 1**: Skip the some trivial confirmation prompts and enable debug mode

```
commit-chad --yes --debug
```

2. **Example 2**: Perform a dry run of the command

```
commit-chad --dry-run
```

## Contributing

If you would like to contribute to this project, fill free to open an issue or submit a pull request at ease.
