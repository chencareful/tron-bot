import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// 数据库文件路径
const DB_PATH = path.resolve(process.cwd(), 'db', 'bot.db')

let db

/**
 * 初始化数据库，建表（会员、已处理交易）
 */
export async function initDB() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  })

  // 建表：会员表
  await db.run(`
    CREATE TABLE IF NOT EXISTS members (
      address TEXT PRIMARY KEY,
      added_at INTEGER
    )
  `)

  // 建表：已处理交易表
  await db.run(`
    CREATE TABLE IF NOT EXISTS processed_txs (
      txid TEXT PRIMARY KEY,
      processed_at INTEGER
    )
  `)

  console.log('✅ SQLite 数据库初始化完成')
}

/**
 * 判断交易是否已处理过
 * @param {string} txid - 交易 ID
 * @returns {Promise<boolean>}
 */
export async function isProcessed(txid) {
  const row = await db.get(`SELECT txid FROM processed_txs WHERE txid = ?`, txid)
  return !!row
}

/**
 * 标记交易为已处理
 * @param {string} txid - 交易 ID
 */
export async function markProcessed(txid) {
  const now = Date.now()
  await db.run(`INSERT OR IGNORE INTO processed_txs (txid, processed_at) VALUES (?, ?)`, txid, now)
}

/**
 * 判断地址是否是会员
 * @param {string} address
 * @returns {Promise<boolean>}
 */
export async function isMember(address) {
  const row = await db.get(`SELECT address FROM members WHERE address = ?`, address)
  return !!row
}

/**
 * 添加会员地址
 * @param {string} address
 */
export async function addMember(address) {
  const now = Date.now()
  await db.run(`INSERT OR IGNORE INTO members (address, added_at) VALUES (?, ?)`, address, now)
}

/**
 * 删除会员地址
 * @param {string} address
 */
export async function removeMember(address) {
  await db.run(`DELETE FROM members WHERE address = ?`, address)
}
