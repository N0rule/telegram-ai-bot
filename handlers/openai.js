const { AICHAT } = require("@root/config.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY, basePath: process.env.OPENAI_API_BASE });
const openai = new OpenAIApi(configuration);

module.exports = { aiChat };

async function aiChat(message) {
  const timeoutPromise = new Promise((reject) => {
    setTimeout(() => {
      reject(new Error('Сервер не ответил'));
    }, 35000);
  });

  const completionPromise = await openai.createChatCompletion({
    model: AICHAT.MODEL,
    max_tokens: AICHAT.TOKENS,
    presence_penalty: AICHAT.PRESENCE_PENALTY,
    temperature: AICHAT.TEMPERATURE,
    messages: [
      { role: "system", content: AICHAT.IMAGINEMESSAGE },
      { role: "user", content: message },
    ],
  });
  try {
    const completion = await Promise.race([timeoutPromise, completionPromise]);
    return completion.data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}
