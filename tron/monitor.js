const tronWeb = require('./tronWeb')
const { isProcessed, markProcessed } = require('../db/sqlite')
const { sendTRX } = require('./transfer')

const USDT_CONTRACT = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
const OWNER_ADDRESS = tronWeb.address.fromPrivateKey(process.env.OWNER_PRIVATE_KEY)

function startMonitor() {
  console.log('📡 启动 USDT 监听...')

  const options = {
    eventName: 'Transfer',
    fromBlock: 'latest'
  }

  const eventWatcher = setInterval(async () => {
    try {
      const events = await tronWeb.getEventResult(USDT_CONTRACT, options)

      for (const event of events) {
        const { transaction_id, result } = event
        const to = result.to
        const amount = parseInt(result.value) / 1e6

        if (to === OWNER_ADDRESS) {
          isProcessed(transaction_id, (processed) => {
            if (!processed) {
              console.log(`💰 收到 ${amount} USDT（TX: ${transaction_id}）`)
              sendTRX(event)
              markProcessed(transaction_id)
            }
          })
        }
      }
    } catch (e) {
      console.error('监听错误：', e.message)
    }
  }, 5000)
}

module.exports = { startMonitor }
