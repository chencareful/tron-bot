const tronWeb = require('./tronWeb')

async function freezeEnergy(userAddress) {
  const amountToFreeze = 10 * 1e6 // 10 TRX
  try {
    const tx = await tronWeb.transactionBuilder.freezeBalanceV2(amountToFreeze, 'ENERGY')
    const signed = await tronWeb.trx.sign(tx)
    const result = await tronWeb.trx.sendRawTransaction(signed)
    console.log(`⚡ 成功为 ${userAddress} 冻结 ${amountToFreeze / 1e6} TRX 用于能量`)
    return result
  } catch (err) {
    console.error('❌ 冻结能量失败：', err.message)
    return null
  }
}

module.exports = { freezeEnergy }
