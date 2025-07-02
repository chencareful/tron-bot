// tron/utils.js
import tronWeb from './tronWeb.js'

/**
 * 将 TRX 金额转换为 Sun（1 TRX = 1,000,000 Sun）
 * @param {number} val - TRX 数值
 * @returns {number} Sun 单位数值
 */
export function toSun(val) {
  return Math.floor(val * 1_000_000)
}

/**
 * 将 Sun 单位转换为 TRX
 * @param {number} val - Sun 数值
 * @returns {number} TRX 单位数值
 */
export function fromSun(val) {
  return val / 1_000_000
}

/**
 * 休眠一段时间（用于节流或延迟处理）
 * @param {number} ms - 毫秒数
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 获取 USDT 合约对象（带缓存）
 * @returns {Promise<any>} 合约对象
 */
let cachedUSDT = null
export async function getUSDTContract() {
  if (cachedUSDT) return cachedUSDT
  cachedUSDT = await tronWeb.contract().at(process.env.USDT_CONTRACT)
  return cachedUSDT
}

/**
 * 校验地址格式是否正确
 * @param {string} address - 地址字符串
 * @returns {boolean}
 */
export function isValidAddress(address) {
  return tronWeb.isAddress(address)
}
