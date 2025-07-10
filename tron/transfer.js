const tronWeb = require('./tronWeb')
const { getExchangeRate } = require('./swap')

async function sendTRX(event) {
  const toAddress = tronWeb.address.fromHex(event.result.from)
  const usdtAmount = parseInt(event.result.value) / 1e6

  const rate = await getExchangeRate()
  const profitRate = 1.1 // +10% 利润
  const trxAmount = Math.floor(usdtAmount * rate * profitRate * 1e6)

  try {
    const tx = await tronWeb.transactionBuilder.sendTrx(toAddress, trxAmount)
    const signedTx = await tronWeb.trx.sign(tx)
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTx)

    console.log(`🚀 自动发送 ${trxAmount / 1e6} TRX 给 ${toAddress}`)
    console.log('交易哈希：', broadcast.txid)
  } catch (e) {
    console.error('❌ 发送 TRX 失败：', e.message)
  }
}

module.exports = { sendTRX }
