# nodebot
Simple Node.js example of the Coinbase Pro entire limit order book kept in memory. Uses "coinbase-pro-node" to subscribe to websocket "full" channel, and to receive the snapshot of the order book with the REST API. Package.json includes node-addon-api as a dependency that isn't necessary.
