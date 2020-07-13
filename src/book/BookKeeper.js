"use strict";
exports.__esModule = true;
exports.BookKeeper = void 0;
var Queue_1 = require("./Queue");
var coinbase_pro_node_1 = require("coinbase-pro-node");
var FullOrderBook_1 = require("./FullOrderBook");
var BookKeeper = /** @class */ (function () {
    function BookKeeper(product) {
        this.product = product;
        this.book = new FullOrderBook_1.FullOrderBook();
        this.isready = false; // snapshot has been processed by buildOrderBook
        this.queue = new Queue_1.Queue();
        this.islive = false; // isready && all messages from queue processed by handleQueue
    }
    ;
    BookKeeper.prototype.getSnapshot = function (client, firstsequence) {
        var _this = this;
        // This was intended to be used to keep a copy of the entire (level 3) orderbook.
        // A level 2 orderbook could be kept much easily by subscribing to the "level 2" channel.
        client.rest.product.getProductOrderBook(this.product, { level: coinbase_pro_node_1.OrderBookLevel.FULL_ORDER_BOOK })
            .then(function (result) {
            // This function will be called again if the snapshot's sequence is less than the sequence 
            // of the first message received by the Websocket feed. This ensure no messages are missed.
            if (result.sequence >= firstsequence - 1) {
                return _this.buildOrderBook(result);
            }
            else {
                console.log("MESSAGES SKIPPED BETWEEN ORDERBOOK: " + result.sequence + " AND FIRST MESSAGE: " + firstsequence + ". TRYING AGAIN.");
                setTimeout(function () {
                    _this.getSnapshot(client, firstsequence);
                }, 1000);
            }
        });
    };
    ;
    BookKeeper.prototype.buildOrderBook = function (snapshot) {
        this.book.sequence = snapshot.sequence;
        console.log("GETTING ORDERBOOK: " + this.book.sequence);
        this.book.bids = new Map(snapshot.bids.map(function (i) { return [i[2], { price: i[0], size: i[1] }]; }));
        this.book.asks = new Map(snapshot.asks.map(function (i) { return [i[2], { price: i[0], size: i[1] }]; }));
        this.isready = true;
        return this.isready = this.handleQueue();
    };
    ;
    BookKeeper.prototype.handleQueue = function () {
        while (!this.queue.isEmpty()) {
            var order = this.queue.dequeue();
            if ((!order.sequence) || (order.sequence <= this.book.sequence)) {
                console.log("MESSAGE: " + order.sequence + " ALREADY ACCOUNTED FOR.");
            }
            else {
                this.handleOrder(order);
            }
        }
        this.queue.dequeue();
        console.log("NO MORE QUEUED MESSAGES");
        return this.islive = true;
    };
    ;
    BookKeeper.prototype.onmessage = function (message) {
        if (this.islive) {
            this.handleOrder(message);
        }
        else {
            this.queue.enqueue(message);
            if (this.isready) {
                this.handleOrder(this.queue.dequeue());
            }
        }
    };
    ;
    BookKeeper.prototype.handleOrder = function (message) {
        switch (message.type) {
            case 'received':
                // a received order doesn't always make it to the orderbook
                console.log(message.sequence + ' order received');
                break;
            case 'open':
                // open orders are on the orderbook
                this.addOrder(message);
                console.log(message.sequence + " on book");
                break;
            case 'done':
                // done orders without a price or size were never on the book
                if (!message.price || !message.remaining_size) {
                    console.log(message.sequence + ' order done');
                    break;
                }
                else {
                    this.removeOrder(message);
                    console.log(message.sequence + ' order off book');
                    break;
                }
            case 'change':
                // order can change to avoid self trade
                if (!message.price || !message.new_size) {
                    console.log(message.sequence + ' order changed');
                    break;
                }
                else {
                    this.changeOrder(message);
                    console.log(message.sequence + ' order changed');
                    break;
                }
            case 'activate':
                // an activate message is sent when a stop is placed.
                // when this stop is triggered, the order will go through the order lifecycle.
                console.log(message.sequence + ' stop placed');
                break;
            case 'match':
                console.log(message.sequence + ' is a match!!!!!!!!!!');
                break;
            default:
                break;
        }
    };
    ;
    BookKeeper.prototype.addOrder = function (message) {
        var order = { price: message.price, size: message.remaining_size };
        var order_id = message.order_id;
        this.book.sequence = message.sequence;
        if (message.side == 'buy') {
            this.book.bids.set(order_id, order);
        }
        else if (message.side == 'sell') {
            this.book.asks.set(order_id, order);
        }
    };
    ;
    BookKeeper.prototype.changeOrder = function (message) {
        var order = { price: message.price, size: message.new_size };
        var order_id = message.order_id;
        this.book.sequence = message.sequence;
        if (message.side == 'buy') {
            this.book.bids.set(order_id, order);
        }
        else if (message.side == 'sell') {
            this.book.asks.set(order_id, order);
        }
    };
    ;
    BookKeeper.prototype.removeOrder = function (message) {
        var order_id = message.order_id;
        this.book.sequence = message.sequence;
        if (message.side == 'buy') {
            this.book.bids["delete"](order_id);
        }
        else if (message.side == 'sell') {
            this.book.asks["delete"](order_id);
        }
    };
    ;
    return BookKeeper;
}());
exports.BookKeeper = BookKeeper;
;
