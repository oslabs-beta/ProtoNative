import {
  OrigCustomComp,
  AppInterface,
  CopyCustomComp,
  CopyNativeEl,
  Originals,
  Copies,
} from './interfaces';
import {
  isCopyCustomComp,
  isDoubleTagElement,
  isOrigCustomComp,
} from './parser';

// TreeNode Class (each instance of TreeNode will represent a node in our tree hierarchy visualization in app canvas)
// name: name of the original custom component (or app component) represented in the node
// data: the actual object of the component that exists in our originals context (can either be an OrigCustomComp or AppInterface)
// children: array of TreeNodes, representing the instances of components represented by TreeNodes that are its children
// hashedName: the name of the copy of the original custom component that exists in our copies context, used to differentiate copies of nodes in our tree when using react flow
export class TreeNode {
  private _name: string;
  private _data: OrigCustomComp | AppInterface;
  private _children: TreeNode[];
  private _hashedName: string;

  constructor(hashedName: string, data: OrigCustomComp | AppInterface) {
    this._name = isOrigCustomComp(data) ? data.name : data.type;
    this._hashedName = hashedName;
    this._data = data;
    this._children = [];
  }

  get name(): string {
    return this._name;
  }

  get data(): OrigCustomComp | AppInterface {
    return this._data;
  }

  get children(): TreeNode[] {
    return this._children;
  }

  get hashedName(): string {
    return this._hashedName;
  }

  addChild(child: TreeNode): void {
    this._children.push(child);
  }
}

export class Tree {
  private _root: TreeNode;

  constructor(root: TreeNode) {
    this._root = root;
  }

  get root(): TreeNode {
    return this._root;
  }

  BFS(): void {
    const queue = [this._root];
    while (queue.length !== 0) {
      const currNode = queue.shift();
      queue.push(...currNode.children);
    }
  }

  PreOrder(node: TreeNode = this._root): void {
    if (node.children.length) {
      for (const child of node.children) {
        this.PreOrder(child);
      }
    }
  }
}

export const generateTree = (
  root: AppInterface,
  originals: Originals,
  copies: Copies
): Tree => {
  // create new tree node that be the root of our tree
  const ComponentTreeRoot = new TreeNode(root.type, root);
  // we only want a single instance of the child in ComponentTreeRoot's children, so keep track if there are multiple copies as children
  const prevPointers: { [key: string]: boolean } = {};
  // loop over the root's children (children array in AppInterface)
  // every child will be in copies
  for (const child of root.children) {
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    if (
      isCopyCustomComp(childInCopies) &&
      !(childInCopies.pointer in prevPointers)
    ) {

      ComponentTreeRoot.addChild(generateNode(childInCopies, originals, copies) as TreeNode);
      prevPointers[childInCopies.pointer] = true;
    } else if (isDoubleTagElement(childInCopies.type)) {
      let newNodes = generateNode(childInCopies, originals, copies) as TreeNode[];
      newNodes = newNodes.flat(Infinity);
      for (const node of newNodes) {
        if (node !== null && !(node.name in prevPointers)) {
          ComponentTreeRoot.addChild(node);
          prevPointers[node.name] = true;
        }
      }
    }
  }
  return new Tree(ComponentTreeRoot);
};

const generateNode = (
  comp: CopyNativeEl | CopyCustomComp,
  originals: Originals,
  copies: Copies
): TreeNode | TreeNode[] => {

  const originalsComp = originals[comp.pointer] as OrigCustomComp;
  const prevPointers: { [key: string]: boolean } = {};

  const compNode = isCopyCustomComp(comp) ? new TreeNode(comp.name, originalsComp) : null;
  const componentChildren: string[] = isCopyCustomComp(comp)
    ? originalsComp.children
    : comp.children;

  if (componentChildren.length === 0) {
    if (compNode === null) return [];
    return compNode;
  }

  // return arrNodes if compNode is Double Tagged Element
  const arrNodes: TreeNode[] = [];
  for (const child of componentChildren) {
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    if (isCopyCustomComp(childInCopies)) {
      const newNode = generateNode(childInCopies, originals, copies) as TreeNode;

      if (compNode === null) {
        if (!(comp.pointer in prevPointers)) {
          arrNodes.push(newNode as TreeNode);
          prevPointers[newNode.name] = true;
        }
      } else if (!(newNode.name in prevPointers)) {
        compNode.addChild(newNode as TreeNode);
        prevPointers[newNode.name] = true;
      }
    } else if (isDoubleTagElement(childInCopies.type)) {
      const newNodes = generateNode(childInCopies, originals, copies) as TreeNode[];

      if (compNode === null) arrNodes.push(...newNodes);
      else {
        for (const node of newNodes) {
          if (node !== null && !(node.name in prevPointers)) {
            compNode.addChild(node);
            prevPointers[node.name] = true;
          }
        }
      }
    }
  }

  if (compNode === null) return arrNodes;

  return compNode;
};



export default generateTree;