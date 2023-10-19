require('dotenv').config();
require("module-alias/register");

const { log, warn, error } = require('@handlers/logger');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { aiChat } = require('@handlers/openai');
const bot = new Telegraf(process.env.BOT_TOKEN);

const { validateConfiguration } = require("@handlers/validator");

validateConfiguration();

bot.start(async (ctx) => {
  const botInfo = await bot.telegram.getMe();
  ctx.reply(`Bot started!\n\nBot Name: ${botInfo.first_name}\n\nBot ID: ${botInfo.id}`);
});

bot.on(message("text"), async (ctx) => {
  const input = ctx.message.text;
  ctx.sendChatAction('typing');
  const response = await aiChat(input);
  ctx.reply(response);
});

bot.launch();
log("Bot Started!");
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
