// tron/energy.js
import tronWeb from './tronWeb.js'

/**
 * 冻结 TRX 获取能量或带宽
 * @param {number} amountTRX - 要冻结的 TRX 数量
 * @param {string} resource - "ENERGY" 或 "BANDWIDTH"
 * @param {string} receiver - 接收冻结资源的地址（默认给自己）
 */
export async function freezeTRX(amountTRX, resource = 'ENERGY', receiver = process.env.OWNER_ADDRESS) {
  try {
    const amountSun = tronWeb.toSun(amountTRX)
    const duration = 3  // 冻结天数

    const tx = await tronWeb.transactionBuilder.freezeBalance(
      amountSun,
      duration,
      resource,
      receiver
    )

    const signedTx = await tronWeb.trx.sign(tx)
    const result = await tronWeb.trx.sendRawTransaction(signedTx)

    if (result.result) {
      console.log(`✅ 成功冻结 ${amountTRX} TRX 为 ${resource}，目标地址: ${receiver}`)
    } else {
      console.error(`❌ 冻结失败`, result)
    }

    return result.result
  } catch (err) {
    console.error(`❌ freezeTRX 出错:`, err)
    return false
  }
}
