// tron/monitor.js
import tronWeb from './tronWeb.js'
import { isProcessed, markProcessed } from '../db/sqlite.js'
import { isBlacklisted } from '../telegram/blacklist.js'
import { isMember } from '../db/sqlite.js'
import { transferTRX } from './transfer.js'
import { getUSDTContract } from './utils.js'

const OWNER = process.env.OWNER_ADDRESS
const USDT_CONTRACT = process.env.USDT_CONTRACT

// 定时监听函数（每 5 秒轮询一次）
export function startMonitor() {
  console.log('📡 启动 USDT 监听...')

  setInterval(async () => {
    try {
      const contract = await getUSDTContract()
      const events = await contract.getPastEvents('Transfer', {
        fromBlock: 'latest'
      })

      for (const e of events) {
        const txID = e.transaction
        const from = tronWeb.address.fromHex(e.result.from)
        const to = tronWeb.address.fromHex(e.result.to)
        const amount = parseInt(e.result.value) / 1_000_000

        // 是否是转给我们的地址？
        if (to !== OWNER) continue

        if (await isProcessed(txID)) continue
        if (await isBlacklisted(from)) {
          console.log(`🚫 黑名单地址 ${from} 发来 USDT，已忽略`)
          continue
        }

        if (!(await isMember(from))) {
          console.log(`⛔ 非会员地址 ${from}，拒绝兑换`)
          continue
        }

        console.log(`💰 收到来自 ${from} 的 USDT: ${amount}`)

        // ✅ 发送 TRX 给用户（闪兑后）
        await transferTRX(from, amount)

        // ✅ 标记为已处理
        await markProcessed(txID)
      }
    } catch (err) {
      console.error('监听失败:', err)
    }
  }, 5000)
}
