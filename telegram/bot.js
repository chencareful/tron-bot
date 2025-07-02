import { Telegraf } from 'telegraf'
import { handleMessage, handleStart, handleMenu } from './handlers.js'
import { mainMenuKeyboard } from './menu.js'

const bot = new Telegraf(process.env.BOT_TOKEN)

export function initBot() {
  // 监听 /start 指令
  bot.start(handleStart)

  // 监听菜单命令
  bot.command('menu', handleMenu)

  // 监听文本消息
  bot.on('text', handleMessage)

  // 监听回调查询（按钮点击）
  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data
    // 这里可以根据 data 分发处理
    // 简单示例：回复按钮内容
    await ctx.answerCbQuery(`你点击了: ${data}`)
  })

  bot.launch()
  console.log('🤖 Telegram Bot 已启动')
}
