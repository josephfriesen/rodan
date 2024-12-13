type EntryType = any;

export default class Queue {
  list: Array<EntryType>;

  constructor() {
    this.list = [];
  }

  enqueue(entry: EntryType): void {
    this.list.push(entry);
  }

  dequeue(): EntryType | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.list.shift();
  }

  size(): number {
    return this.list.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  empty(): void {
    this.list = [];
  }
}
