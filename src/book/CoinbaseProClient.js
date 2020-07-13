"use strict";
exports.__esModule = true;
exports.CoinbaseProClient = void 0;
var coinbase_pro_node_1 = require("coinbase-pro-node");
require('dotenv').config();
function CoinbaseProClient() {
    if (process.env.USE_SANDBOX === 'true') {
        console.info("Initiating client using Coinbase Pro's public sandbox with API key...");
        return new coinbase_pro_node_1.CoinbasePro({
            apiKey: process.env.COINBASE_PRO_SANDBOX_API_KEY,
            apiSecret: process.env.COINBASE_PRO_SANDBOX_API_SECRET,
            passphrase: process.env.COINBASE_PRO_SANDBOX_PASSPHRASE,
            useSandbox: true
        });
    }
    else if (process.env.USE_SANDBOX === 'false') {
        console.info("Using Coinbase Pro's production environment with API key...");
        return new coinbase_pro_node_1.CoinbasePro({
            apiKey: process.env.COINBASE_PRO_API_KEY,
            apiSecret: process.env.COINBASE_PRO_API_SECRET,
            passphrase: process.env.COINBASE_PRO_PASSPHRASE,
            useSandbox: false
        });
    }
    console.info("Using Coinbase Pro's production environment without API key...");
    return new coinbase_pro_node_1.CoinbasePro();
}
exports.CoinbaseProClient = CoinbaseProClient;
;
