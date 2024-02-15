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
                "Given the following `git diff --cached` output, generate a concise, relevant commit message. Focus solely on summarizing the changes. \nRules: \n1. The commit message must be concise and not exceed 50 characters. \n2. Focus on summarizing the changes without providing explanations or reasons. \n3. Do not include any imaginative or unrelated content. 4. If the changes are small, no verbose. \nContext (git diff --cached output): " +
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
