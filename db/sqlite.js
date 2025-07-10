const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.resolve(__dirname, 'bot.db')
let db

function initDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ 初始化数据库失败：', err.message)
        reject(err)
      } else {
        console.log('✅ SQLite 数据库初始化成功')
        db.serialize(() => {
          db.run(`
            CREATE TABLE IF NOT EXISTS members (
              address TEXT PRIMARY KEY,
              added_at INTEGER
            )
          `)

          db.run(`
            CREATE TABLE IF NOT EXISTS processed_txs (
              txid TEXT PRIMARY KEY,
              processed_at INTEGER
            )
          `)
          resolve()
        })
      }
    })
  })
}

function isProcessed(txid, callback) {
  db.get(`SELECT txid FROM processed_txs WHERE txid = ?`, [txid], (err, row) => {
    if (err) {
      console.error(err)
      return callback(false)
    }
    callback(!!row)
  })
}

function markProcessed(txid) {
  const now = Date.now()
  db.run(`INSERT OR IGNORE INTO processed_txs (txid, processed_at) VALUES (?, ?)`, [txid, now])
}

function isMember(address, callback) {
  db.get(`SELECT address FROM members WHERE address = ?`, [address], (err, row) => {
    if (err) {
      console.error(err)
      return callback(false)
    }
    callback(!!row)
  })
}

function addMember(address) {
  const now = Date.now()
  db.run(`INSERT OR IGNORE INTO members (address, added_at) VALUES (?, ?)`, [address, now])
}

function removeMember(address) {
  db.run(`DELETE FROM members WHERE address = ?`, [address])
}

module.exports = {
  initDB,
  isProcessed,
  markProcessed,
  isMember,
  addMember,
  removeMember
}
