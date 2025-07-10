const menu = require('./menu')
const { isMember } = require('../db/sqlite')
const { addToBlacklist, isBlacklisted } = require('./blacklist')

function handleStart(ctx) {
  ctx.reply('欢迎使用 TRON Bot，请点击按钮操作：', menu.mainMenu())
}

function handleText(ctx) {
  const userId = ctx.from.id
  const text = ctx.message.text.trim()

  if (isBlacklisted(userId)) {
    return ctx.reply('⚠️ 您已被列入黑名单，无法使用该功能。')
  }

  if (text.startsWith('T') && text.length >= 34) {
    isMember(text, (isVip) => {
      if (isVip) {
        ctx.reply(`✅ 会员地址验证通过：${text}`)
        // 后续执行兑换/能量等功能逻辑
      } else {
        ctx.reply('❌ 非会员地址，无法使用此功能。')
      }
    })
  } else {
    ctx.reply('请输入 TRON 地址（T开头）以验证会员身份。')
  }
}

module.exports = {
  handleStart,
  handleText
}