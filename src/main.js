const { WebSocketEvent } = require('coinbase-pro-node');
const CONFIG = require('../config.json');
const BTC = "BTC-USD";
const channels = CONFIG.channels;
const { BookKeeper, CoinbaseProClient } = require('./book');
const client = CoinbaseProClient();
var bookkeeper = new BookKeeper(BTC);

// Listen to WebSocket channel updates
client.ws.on(WebSocketEvent.ON_MESSAGE, message => {
    // LiveOrderBook class handles messages
    console.log(message);
    bookkeeper.onmessage(message);
});

client.ws.on(WebSocketEvent.ON_ERROR, errorMessage => {
    throw new Error(`${errorMessage.message}: ${errorMessage.reason}`);
});

client.ws.on(WebSocketEvent.ON_OPEN, () => {
    client.ws.subscribe(channels);
    // The first message received from the Websocket feed is metadata. 
    client.ws.once(WebSocketEvent.ON_MESSAGE, message => {
        // The second message is actually the first order, whose sequence number 'firstsequence'
        //  will be used to determine whether or not the orderbook snapshot can be used.
        client.ws.once(WebSocketEvent.ON_MESSAGE, message => {
            const firstsequence = message.sequence;
            console.log("FIRST SEQUENCE NUMBER: " + firstsequence);
            bookkeeper.getSnapshot(client, firstsequence);
        });
    });
});
client.ws.connect();