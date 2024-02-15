import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function runAI(stagedChanges) {
  async function run(stagedChanges) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are an awesome commit message generator! you generate commit messages with the context the user provides. Here is the staged changes: \n" +
                stagedChanges,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.text();
    return text;
  }
  const commitMessages = await spinner(chalk.blue('generating...'),()=> run(stagedChanges));
  echo(chalk.blue("Success!\n"));
  return commitMessages;
}
