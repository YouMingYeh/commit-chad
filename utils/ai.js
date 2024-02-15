import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

async function checkGeminiEnv() {
  if (process.env.GEMINI_API_KEY) {
    return;
  } else {
    echo(
      chalk.red(
        "Hmm, it looks like you haven't set up your API key for Gemini. Check out https://aistudio.google.com/app/apikey to get a free api key. \n",
      ),
    );
    const API_KEY = await question("Enter your Gemini API key: ");
    await $`export GEMINI_API_KEY=${API_KEY}`;
  }
}

async function checkOpenaiEnv() {
  if (process.env.OPENAI_API_KEY) {
    return;
  } else {
    echo(
      chalk.red(
        "Hmm, it looks like you haven't set up your API key for Openai. Check out https://aistudio.google.com/app/apikey to get a free api key. \n",
      ),
    );
    const API_KEY = await question("Enter your Openai API key: ");
    await $`export OPENAI_API_KEY=${API_KEY}`;
  }
}

export async function runAIConfig(config) {
  if (config.provider === "gemini") {
    await checkGeminiEnv();
  } else if (config.provider === "openai") {
    await checkOpenaiEnv();
  }
}

// Access your API key as an environment variable (see "Set up your API key" above)

export async function runAI(stagedChanges, config) {
  let msg = `Given the following 'git diff --cached' output, generate a concise, relevant commit message.
Rules:
1. The commit message must be concise and not exceed 50 characters.
2. Focus on summarizing the changes without providing explanations or reasons.
3. Do not include any imaginative or unrelated content.
4. If the changes are small, no verbose.
5. Start with a proper type of change (lowercase). (e.g., feat, fix, docs, style, refactor, test, chore).

Context (git diff --cached output): ${stagedChanges}`;

  async function runGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = await model.startChat();
    while (true) {
      const result = await spinner(chalk.blue("generating..."), () =>
        chat.sendMessage(msg),
      );
      const response = await result.response;
      const text = response.text();
      echo(chalk.blue("Commit Message: \n"), text);
      const feedbackMsg = await question(
        `Is this commit message okay? (y)/<instructions> `,
      );
      if (
        feedbackMsg === "" ||
        feedbackMsg === "y" ||
        feedbackMsg === "yes" ||
        feedbackMsg === "Y" ||
        feedbackMsg === "YES"
      ) {
        return text;
      }
      msg = feedbackMsg;
    }
  }

  async function runOpenai() {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful git commit message generator.",
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const text = completion.choices[0].message.content;
    echo(chalk.blue("Commit Message: \n"), text);
    const feedbackMsg = await question(
      `Is this commit message okay? (y)/<instructions> `,
    );
    if (
      feedbackMsg === "" ||
      feedbackMsg === "y" ||
      feedbackMsg === "yes" ||
      feedbackMsg === "Y" ||
      feedbackMsg === "YES"
    ) {
      return text;
    }
    msg = feedbackMsg;
  }

  let commitMessages;
  if (config.provider === "gemini") {
    commitMessages = await runGemini();
  } else if (config.provider === "openai") {
    commitMessages = await runOpenai();
  }

  echo(chalk.blue("Success!\n"));
  return commitMessages;
}
