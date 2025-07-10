const { Telegraf } = require('telegraf')
const handlers = require('./handlers')

function initBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN)

  bot.start((ctx) => handlers.handleStart(ctx))
  bot.on('text', (ctx) => handlers.handleText(ctx))

  bot.launch()
  console.log('🤖 Telegram Bot 已启动')
}

module.exports = { initBot }