export class Node<T> {
  _d: T;
  parent: Node<T> | null = null;
  children: Node<T>[];
  constructor(node: T, parent: Node<T> | null = null) {
    this._d = node;
    this.children = (node as any).children.map((x: T) => new Node(x, this));
  }
}
