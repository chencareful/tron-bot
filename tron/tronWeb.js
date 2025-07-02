// tron/tronWeb.js
import TronWeb from 'tronweb'

// 从 .env 加载私钥和地址
const privateKey = process.env.OWNER_PRIVATE_KEY
const fullNode = 'https://api.trongrid.io'  // 主网
const solidityNode = fullNode
const eventServer = fullNode

// 创建 TronWeb 实例
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)

// 打印地址确认
console.log(`✅ TronWeb 已初始化，当前地址: ${await tronWeb.defaultAddress.base58}`)

export default tronWeb
