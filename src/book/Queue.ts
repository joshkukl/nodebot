export class Queue {
  values: any[];
  next: number;
  constructor() {
    this.values = [];
    this.next = 0;
  };
  size(): number {
    return this.values.length - this.next;
  };
  isEmpty(): boolean {
    return this.size() == 0;
  }
  enqueue(value: any): void {
    this.values.push(value);
  };
  dequeue(): any {
    if(!this.isEmpty()) {
      let x = this.values[this.next++];
      if(this.isEmpty()) {
        this.values = [];
        this.next = 0;
        return x;
      } else {
        return x;
      } 
    } else {
      console.log("QUEUE EMPTY");
      this.values = [];
      this.next = 0;
    }
  };
};