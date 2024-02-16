import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { config } from "./config.js";

async function checkGeminiEnv() {
  if (process.env.GEMINI_API_KEY) {
    return;
  } else {
    echo(
      chalk.red(
        "Hmm, it looks like you haven't set up your API key for Gemini. Check out https://aistudio.google.com/app/apikey to get a free api key. \n",
      ),
    );
    const API_KEY = await question(chalk.bold("Enter your Gemini API key: "));
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
    const API_KEY = await question(chalk.bold("Enter your Openai API key: "));
    await $`export OPENAI_API_KEY=${API_KEY}`;
  }
}

export async function runAIConfig() {
  if (config.provider === "gemini") {
    await checkGeminiEnv();
  } else if (config.provider === "openai") {
    await checkOpenaiEnv();
  }
}

// Access your API key as an environment variable (see "Set up your API key" above)

export async function runAI(stagedChanges) {
  let msg = `"Based on the provided 'git diff --cached' output, generate a commit message that adheres to the following guidelines:

  - Start the message with a type of change, using one of the following keywords, all in lowercase: feat, fix, docs, style, refactor, test, chore. Example: 'feat: add new login feature'.
  - Ensure the message is concise and directly relevant to the changes.
  - Avoid any imaginative, verbose, or unrelated content.
  - The message should succinctly summarize the changes, focusing on the impact or purpose of the change rather than the technical details.
  
  Please analyze the 'git diff --cached' output below to identify the most appropriate type of change and draft a suitable commit message:
  
  ${stagedChanges}
  
  Remember, the goal is to produce a commit message that is clear, informative, and follows standard practices for readability and future reference."
  `

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
        chalk.bold(
          `Is this commit message okay? or tell me what do you want to modify. (y)`,
        ),
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
        content:
          "You are a helpful git commit message generator who only generate clean, concise, related commit messages from given git diff context.",
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
        chalk.bold(
          `Is this commit message okay? or tell me what do you want to modify. (y) `,
        ),
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
