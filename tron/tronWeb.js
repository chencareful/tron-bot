const TronWebModule = require('tronweb')
const TronWeb = TronWebModule.default || TronWebModule

const fullNode = 'https://api.trongrid.io'
const solidityNode = 'https://api.trongrid.io'
const eventServer = 'https://api.trongrid.io'

const privateKey = process.env.OWNER_PRIVATE_KEY

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)

module.exports = tronWeb