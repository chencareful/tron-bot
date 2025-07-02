CREATE TABLE IF NOT EXISTS members (
  address TEXT PRIMARY KEY,
  added_at INTEGER
);

CREATE TABLE IF NOT EXISTS processed_txs (
  txid TEXT PRIMARY KEY,
  processed_at INTEGER
);
