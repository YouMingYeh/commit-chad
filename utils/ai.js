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
1. The commit message must be concise and clean.
2. Do not include any imaginative or unrelated content.
3. If the changes are small, no verbose.
4. Start with a proper type of change (lowercase). (e.g., feat, fix, docs, style, refactor, test, chore).

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
        `Is this commit message okay? or tell me what do you want to modify. (y)`,
      );
      if (
        !feedbackMsg ||
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
    const chatHistory = [
      {
        role: "system",
        content: "You are a helpful git commit message generator.",
      },
      {
        role: "user",
        content: msg,
      },
    ];
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    while (true) {
      const completion = await openai.chat.completions.create({
        messages: chatHistory,
        model: "gpt-3.5-turbo",
      });
      const text = completion.choices[0].message.content;
      echo(chalk.blue("Commit Message: \n"), text);
      const feedbackMsg = await question(
        `Is this commit message okay? or tell me what do you want to modify. (y) `,
      );
      if (
        !feedbackMsg ||
        feedbackMsg === "" ||
        feedbackMsg === "y" ||
        feedbackMsg === "yes" ||
        feedbackMsg === "Y" ||
        feedbackMsg === "YES"
      ) {
        return text;
      }
      msg = feedbackMsg;
      chatHistory.push({
        role: "assistant",
        content: text,
      });
      chatHistory.push({
        role: "user",
        content: msg,
      });
    }
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
