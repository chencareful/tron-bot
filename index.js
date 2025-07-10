require('dotenv').config()

const { initBot } = require('./telegram/bot')
const { initDB } = require('./db/sqlite')
const { loadBlacklist } = require('./telegram/blacklist')

async function main() {
  await initDB()
  await loadBlacklist()
  initBot()
  console.log('🤖 Bot 启动完成')
}

main().catch(console.error)