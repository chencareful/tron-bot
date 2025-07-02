import fs from 'fs'
import path from 'path'

const BLACKLIST_FILE = path.resolve(process.cwd(), 'db', 'blacklist.json')

let blacklist = new Set()

/**
 * 加载黑名单（从文件）
 */
export async function loadBlacklist() {
  try {
    if (fs.existsSync(BLACKLIST_FILE)) {
      const data = fs.readFileSync(BLACKLIST_FILE, 'utf-8')
      const arr = JSON.parse(data)
      blacklist = new Set(arr)
      console.log(`🛑 黑名单加载成功，${blacklist.size} 条记录`)
    } else {
      console.log('🛑 黑名单文件不存在，初始化为空')
      blacklist = new Set()
    }
  } catch (err) {
    console.error('❌ 加载黑名单失败:', err)
  }
}

/**
 * 保存黑名单（写入文件）
 */
async function saveBlacklist() {
  try {
    const arr = Array.from(blacklist)
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(arr, null, 2), 'utf-8')
    console.log('🛑 黑名单保存成功')
  } catch (err) {
    console.error('❌ 保存黑名单失败:', err)
  }
}

/**
 * 判断是否在黑名单
 * @param {string|number} id - 用户ID或地址
 * @returns {boolean}
 */
export function isBlacklisted(id) {
  return blacklist.has(String(id))
}

/**
 * 添加到黑名单
 * @param {string|number} id
 */
export async function addToBlacklist(id) {
  blacklist.add(String(id))
  await saveBlacklist()
}

/**
 * 从黑名单移除
 * @param {string|number} id
 */
export async function removeFromBlacklist(id) {
  blacklist.delete(String(id))
  await saveBlacklist()
}
