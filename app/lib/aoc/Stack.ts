type EntryType = any;

export default class Stack {
  list: Array<EntryType>;

  constructor() {
    this.list = [];
  }

  push(item: EntryType): void {
    this.list.push(item);
  }

  pop(): EntryType {
    if (this.isEmpty()) {
      throw new Error("stack is empty");
    }
    return this.list.pop();
  }

  peek(): EntryType {
    return this.list[this.size() - 1];
  }

  size(): number {
    return this.list.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  toString(): string {
    return this.list.reduce((acc, curr) => acc + curr.toString(), "");
  }
}
