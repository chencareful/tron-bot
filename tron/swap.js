const axios = require('axios')

// SunSwap 路由合约地址（稳定）
const SUNSWAP_ROUTER = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'

const USDT_CONTRACT = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
const TRX_PLACEHOLDER = 'TRX' // for clarity

async function getExchangeRate() {
  try {
    const amountIn = 1 * 1e6 // 1 USDT
    const res = await axios.post('https://api.sun.io/v1/swap/quote', {
      direction: 'USDT2TRX',
      fromTokenAddress: USDT_CONTRACT,
      toTokenAddress: TRX_PLACEHOLDER,
      amount: amountIn.toString(),
      routerAddress: SUNSWAP_ROUTER,
      slippage: 1
    })

    const trxAmount = parseFloat(res.data.data.toTokenAmount) / 1e6
    return trxAmount // 1 USDT ≈ x TRX
  } catch (e) {
    console.error('⚠️ 获取 SunSwap 汇率失败，使用默认：1 USDT ≈ 3.6 TRX')
    return 3.6
  }
}

module.exports = { getExchangeRate }
