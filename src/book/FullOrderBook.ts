export class FullOrderBook {
    bids!: Map<string, { price: number, size: number }>;
    asks!: Map<string, { price: number, size: number }>;
    sequence!: number;
};