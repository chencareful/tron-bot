// tron/swap.js
import tronWeb from './tronWeb.js'
import { toSun, fromSun, getUSDTContract } from './utils.js'

const routerAddress = process.env.SUNSWAP_ROUTER
const usdtAddress = process.env.USDT_CONTRACT
const trxAddress = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb' // TRX 地址（虚拟）

/**
 * 获取当前兑换价格（1 USDT 可兑换多少 TRX）
 * @returns {Promise<number>} TRX 数量
 */
export async function getLiveRate() {
  try {
    const contract = await tronWeb.contract().at(routerAddress)

    const amountIn = toSun(1) // 1 USDT
    const path = [usdtAddress, trxAddress]

    const result = await contract.getAmountsOut(amountIn, path).call()
    const outAmount = result[1] // 兑换得的 TRX (sun)

    const rate = fromSun(outAmount)
    return rate
  } catch (err) {
    console.error('❌ 获取实时汇率失败:', err)
    return 3.68 // 回退默认汇率
  }
}

/**
 * 兑换 USDT -> TRX，并加价 10%
 * @param {number} usdtAmount - 输入 USDT 数量
 * @returns {Promise<number>} 实际收到 TRX 数量
 */
export async function swapUSDTtoTRX(usdtAmount) {
  try {
    const liveRate = await getLiveRate()
    const finalRate = liveRate * 0.90 // ⬅️ 你保留 10% 利润

    const receiveTRX = usdtAmount * finalRate
    console.log(`📈 实时汇率 ${liveRate.toFixed(4)}，用户汇率 ${finalRate.toFixed(4)}，预估收到 ${receiveTRX.toFixed(4)} TRX`)

    const usdt = await getUSDTContract()
    const owner = process.env.OWNER_ADDRESS
    const amountIn = toSun(usdtAmount)
    const deadline = Math.floor(Date.now() / 1000) + 60

    // 授权给 Router 合约
    await usdt.approve(routerAddress, amountIn).send()

    const contract = await tronWeb.contract().at(routerAddress)

    const tx = await contract.swapExactTokensForTRX(
      amountIn,
      toSun(receiveTRX),                     // 最小接收 TRX 数量（防止滑点）
      [usdtAddress, trxAddress],
      owner,
      deadline
    ).send({
      feeLimit: 10_000_000,
      callValue: 0,
      shouldPollResponse: true
    })

    console.log('✅ 闪兑完成，SunSwap 交易 Hash:', tx)
    return receiveTRX
  } catch (err) {
    console.error('❌ swapUSDTtoTRX 出错:', err)
    return 0
  }
}
