// index.js
import 'dotenv/config'
import { initBot } from './telegram/bot.js'
import { startMonitor } from './tron/monitor.js'
import { initDB } from './db/sqlite.js'
import { loadBlacklist } from './telegram/blacklist.js'

console.log('✅ 启动中...')

// 初始化数据库（SQLite）
await initDB()

// 加载黑名单缓存（从本地文件或数据库）
await loadBlacklist()

// 启动 Telegram Bot
initBot()

// 启动监听任务：USDT 收到后自动兑换并发送 TRX
startMonitor()
