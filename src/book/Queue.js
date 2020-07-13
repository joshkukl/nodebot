"use strict";
exports.__esModule = true;
exports.Queue = void 0;
var Queue = /** @class */ (function () {
    function Queue() {
        this.values = [];
        this.next = 0;
    }
    ;
    Queue.prototype.size = function () {
        return this.values.length - this.next;
    };
    ;
    Queue.prototype.isEmpty = function () {
        return this.size() == 0;
    };
    Queue.prototype.enqueue = function (value) {
        this.values.push(value);
    };
    ;
    Queue.prototype.dequeue = function () {
        if (!this.isEmpty()) {
            var x = this.values[this.next++];
            if (this.isEmpty()) {
                this.values = [];
                this.next = 0;
                return x;
            }
            else {
                return x;
            }
        }
        else {
            console.log("QUEUE EMPTY");
            this.values = [];
            this.next = 0;
        }
    };
    ;
    return Queue;
}());
exports.Queue = Queue;
;
