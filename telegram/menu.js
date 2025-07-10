const { Markup } = require('telegraf')

function mainMenu() {
  return Markup.keyboard([
    ['💱 立即兑换 TRX', '⚡ 租借能量'],
    ['📄 查看帮助']
  ]).resize()
}

module.exports = { mainMenu }