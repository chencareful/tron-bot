function toSun(amount) {
  return Math.floor(amount * 1e6)
}

function fromSun(amount) {
  return amount / 1e6
}

function withProfit(baseRate, profitPercent = 10) {
  return baseRate * (1 + profitPercent / 100)
}

module.exports = {
  toSun,
  fromSun,
  withProfit
}
