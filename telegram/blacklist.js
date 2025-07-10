const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '../db/blacklist.json')
let blacklist = new Set()

function loadBlacklist() {
  return new Promise((resolve) => {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      blacklist = new Set(data)
      console.log(`🛡️  黑名单加载成功，共 ${blacklist.size} 项`)
    } else {
      blacklist = new Set()
    }
    resolve()
  })
}

function addToBlacklist(userId) {
  blacklist.add(userId)
  save()
}

function removeFromBlacklist(userId) {
  blacklist.delete(userId)
  save()
}

function isBlacklisted(userId) {
  return blacklist.has(userId)
}

function save() {
  fs.writeFileSync(filePath, JSON.stringify(Array.from(blacklist), null, 2))
}

module.exports = {
  loadBlacklist,
  addToBlacklist,
  removeFromBlacklist,
  isBlacklisted
}