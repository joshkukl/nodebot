"use strict"
import { CoinbasePro } from 'coinbase-pro-node';
require('dotenv').config();
export function CoinbaseProClient(): CoinbasePro {
    if (process.env.USE_SANDBOX === 'true') {
        console.info("Initiating client using Coinbase Pro's public sandbox with API key...");
        return new CoinbasePro( {
            apiKey: process.env.COINBASE_PRO_SANDBOX_API_KEY!,
            apiSecret: process.env.COINBASE_PRO_SANDBOX_API_SECRET!,
            passphrase: process.env.COINBASE_PRO_SANDBOX_PASSPHRASE!,
            useSandbox: true,
        } );
    } else if (process.env.USE_SANDBOX === 'false') {
        console.info("Using Coinbase Pro's production environment with API key...");

        return new CoinbasePro({
            apiKey: process.env.COINBASE_PRO_API_KEY!,
            apiSecret: process.env.COINBASE_PRO_API_SECRET!,
            passphrase: process.env.COINBASE_PRO_PASSPHRASE!,
            useSandbox: false,
        } );
    }    
    console.info("Using Coinbase Pro's production environment without API key...");
    return new CoinbasePro();
};

