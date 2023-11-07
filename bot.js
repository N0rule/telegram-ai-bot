// Importing necessary modules
require("dotenv").config();
require("module-alias/register");

// Importing logger, bot, and image generation handlers
const { log, warn, error } = require("@handlers/logger");
const { Telegraf } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const { message } = require("telegraf/filters");
const { aiChat } = require("@handlers/chatGen");
const { aiImage } = require("@handlers/imageGen");

// Creating a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Validating the bot's configuration
const { validateConfiguration } = require("@handlers/validator");
validateConfiguration();

// Rate limit configuration
const limitConfig = {
  window: 10000,
  limit: 2,
  onLimitExceeded: (ctx, next) =>
    ctx.reply("🚫Слишком много запросов, Подождите пожалуйста"),
};

// Applying rate limit middleware to the bot
bot.use(rateLimit(limitConfig));

// Handling the /start command
bot.start(async (ctx) => {
  // Getting bot information
  const botInfo = await bot.telegram.getMe();
  // Replying with bot information
  ctx.reply(
    `Bot started!\n\nBot Name: ${botInfo.first_name}\n\nBot ID: ${botInfo.id}`
  );
});

// Handling the /imgen command
bot.command("imgen", async (ctx) => {
  // Sending a typing action to the user
  ctx.sendChatAction("upload_photo");
  // Getting the input text
  const input = ctx.message.text;
  // If the input is just "/imgen", reply with a message
  if (input === "/imgen") {
    ctx.reply("Введите текст для генерации картинки");
    return;
  }
  // Generating an image using the input
  const response = await aiImage(input);
  // Sending the generated image to the user
  ctx.sendPhoto(response, { caption: "Фото Сгенерировано!" });
});

// Handling text messages
bot.on(message("text"), async (ctx) => {
  // Getting the input text
  const input = ctx.message.text;
  // Sending a typing action to the user
  ctx.sendChatAction("typing");
  // Generating a response using the input
  const response = await aiChat(input);
  // Replying with the generated response
  ctx.reply(response);
});

// Launching the bot
bot.launch();

// Getting bot information
const botInfo = bot.telegram.getMe();
botInfo.then((botInfo) => {
  // Logging the bot's start information
  log(`Bot started! Name: ${botInfo.first_name} ID: ${botInfo.id}`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));