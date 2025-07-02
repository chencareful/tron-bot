// tron/transfer.js
import tronWeb from './tronWeb.js'
import { swapUSDTtoTRX } from './swap.js'
import { sleep, toSun } from './utils.js'

export async function transferTRX(userAddress, usdtAmount) {
  try {
    console.log(`🔁 正在处理兑换：${usdtAmount} USDT -> TRX，地址: ${userAddress}`)

    // 步骤 1：兑换 USDT -> TRX（SunSwap 闪兑）
    const trxAmount = await swapUSDTtoTRX(usdtAmount)

    if (!trxAmount || trxAmount < 1) {
      console.error(`❌ 闪兑失败，兑换结果为空或过低`)
      return
    }

    // 步骤 2：向用户地址发送 TRX
    const tx = await tronWeb.trx.sendTransaction(userAddress, toSun(trxAmount))

    if (tx.result) {
      console.log(`✅ 已成功发送 ${trxAmount} TRX 至 ${userAddress}`)
    } else {
      console.error(`❌ 转账失败`, tx)
    }

    // 可选延迟，避免频繁调用（防封）
    await sleep(1000)
  } catch (err) {
    console.error(`❌ transferTRX 出错:`, err)
  }
}
