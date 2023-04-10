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
// Each instance has these 4 properties:
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

// Tree class (instance of this class will represent the tree in our tree hierarchy visualization in app canvas)
// instance will only have a root of the tree, and the entire tree can be traversed starting from the root
// root: the root of a tree, which will be an instance of TreeNode, but its data property will only be an AppInterface (not OrigCustomComp) since App is always the root 
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

/**
 * @method generateTree
 * @description generates an instance of a Tree, will go through the entirety our originals and copies contexts and filter out CopyNativeEl, 
 * only showing instances of CopyCustomComp which are copies of OrigCustomComp (the filtering happens in the generateNode function)
 * @input the root of the tree to generate, must always be of interface AppInterface since App will always represent the root of our hierarchy
 * @output the instance of Tree
 */

export const generateTree = (
  root: AppInterface,
  originals: Originals,
  copies: Copies
): Tree => {
  // create new tree node that be the root of our tree
  const ComponentTreeRoot = new TreeNode(root.type, root);
  // we only want a single instance of the child in ComponentTreeRoot's children, so keep track if there are multiple copies as children
  const prevPointers: { [key: string]: boolean } = {};
  // loop over the root's children (children array of strings in AppInterface)
  // every child will be in copies context
  for (const child of root.children) {
    // find the child in copies context
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    // if the child is a CopyCustomComp AND we have NOT yet seen this instance of child (not in our prevPointers store)
    if (isCopyCustomComp(childInCopies) && !(childInCopies.pointer in prevPointers)) {
      // generate a new instance of TreeNode for that child, recursively add all of that child's descendants
      // add the child to the root's children
      ComponentTreeRoot.addChild(generateNode(childInCopies, originals, copies) as TreeNode);
      // add this child to our prevPointers store to indicate that we have come across this instance of child
      prevPointers[childInCopies.pointer] = true;
    } 
    // else if the child is a DoubleTagElement (the child can have children and is not an instance of CopyCustomComp), 
    // then we want to keep searching our copies context to see if more instances of CopyCustomComponents exist down the descendant lineage
    else if (isDoubleTagElement(childInCopies.type)) {
      // feed the double tag element child in generateNode to filter out all copy Native elements, and build its instance of TreeNode and its children as instances of TreeNode
      // newNodes will be an array of TreeNodes
      let newNodes = generateNode(childInCopies, originals, copies) as TreeNode[];
      // flatten in case of nested arrays
      newNodes = newNodes.flat(Infinity);
      for (const node of newNodes) {
        // only add as a child of ComponentTreeRoot if node isn't null (which means )
        if (node !== null && !(node.name in prevPointers)) {
          ComponentTreeRoot.addChild(node);
          prevPointers[node.name] = true;
        }
      }
    }
  }
  return new Tree(ComponentTreeRoot);
};

/**
 * @method generateNode
 * @description generates the instance of TreeNode and recursively generate all instances of its children as TreeNodes, filters out instances of CopyNativeEl but keeps instances of CopyCustomComp
 * @input component to generate the node for (can either be CopyNativeEl or CopyCustomComp)
 * @output either a single TreeNode or array of TreeNodes, depending on whether the component has multiple children
 */

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