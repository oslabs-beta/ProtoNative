import {
  OrigCustomComp,
  AppInterface,
  CopyCustomComp,
  CopyNativeEl,
  Originals,
  Copies,
  OrigNativeEl,
} from './interfaces';
import {
  isCopyCustomComp,
  isDoubleTagElement,
  isOrigCustomComp,
} from './parser';

// const originals: Originals = {
//   App: {
//     type: 'App',
//     children: ['TestComponent0'],
//     state: [],
//   } as AppInterface,
//   View: { type: 'View', index: 3 } as OrigNativeEl,
//   Button: { type: 'Button', index: 3 } as OrigNativeEl,
//   Text: { type: 'Text', index: 1 } as OrigNativeEl,
//   Image: { type: 'Image', index: 0 } as OrigNativeEl,
//   TextInput: { type: 'TextInput', index: 0 } as OrigNativeEl,
//   ScrollView: { type: 'ScrollView', index: 0 } as OrigNativeEl,
//   FlatList: { type: 'FlatList', index: 0 } as OrigNativeEl,
//   SectionList: { type: 'SectionList', index: 0 } as OrigNativeEl,
//   Switch: { type: 'Switch', index: 0 } as OrigNativeEl,
//   TouchableHighlight: {
//     type: 'TouchableHighlight',
//     index: 0,
//   } as OrigNativeEl,
//   TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
//   StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
//   ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
//   TestComponent: {
//     name: 'TestComponent',
//     type: 'custom',
//     children: ['CoolComponent0'],
//     state: [],
//     index: 1,
//     copies: ['TestComponent0'],
//   } as OrigCustomComp,
//   CoolComponent: {
//     name: 'CoolComponent',
//     type: 'custom',
//     children: [],
//     state: [],
//     index: 1,
//     copies: ['CoolComponent0'],
//   } as OrigCustomComp,
// };

// const copies: Copies = {
//   TestComponent0: {
//     name: 'TestComponent0',
//     type: 'custom',
//     parent: { origin: 'original', key: 'App' },
//     pointer: 'TestComponent',
//   } as CopyCustomComp,
//   CoolComponent0: {
//     name: 'CoolComponent0',
//     type: 'custom',
//     parent: { origin: 'original', key: 'TestComponent' },
//     pointer: 'CoolComponent',
//   } as CopyCustomComp,
  
// };

class TreeNode {
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

  deleteChild(child: TreeNode): void {
    this._children.splice(this._children.indexOf(child), 1);
  }
}

class Tree {
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
      // console.log('CURR NODE!!!', currNode);
      // console.log(currNode.children);
      // console.log('-----------------');
    }
  }

  PreOrder(node: TreeNode = this._root): void {
    // console.log(node.name);
    // console.log('---------');
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
    // console.log('CHILD', child);
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    if (
      isCopyCustomComp(childInCopies) &&
      !(childInCopies.pointer in prevPointers)
    ) {

      ComponentTreeRoot.addChild(
        generateNode(childInCopies, originals, copies)
      );
      prevPointers[childInCopies.pointer] = true;
    } else if (isDoubleTagElement(childInCopies.type)) {
      const newNodes = generateNode(childInCopies, originals, copies).flat(
        Infinity
      );
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

// create new tree node
// loop through its children
// for each child, check if it's a CopyCustomComp or CopyNativeEl
// if the child is a CopyCustomComp
// find its instance in originals (which will be OrigCustomComp) using its pointer property
// push that instance into new tree node's children
// recursively repeat above for current child's children
// else if child is NOT a CopyCustomComp, but IS a double tagged element (it can have children)
// recursively repeat above for current child's children

const generateNode = (
  comp: CopyNativeEl | CopyCustomComp,
  originals: Originals,
  copies: Copies
): any => {

  const originalsComp = originals[comp.pointer] as OrigCustomComp;
  const prevPointers: { [key: string]: boolean } = {};

  const compNode = isCopyCustomComp(comp) ? new TreeNode(comp.name, originalsComp) : null;
  // const compNode = isCopyCustomComp(comp) ? new TreeNode(originalsComp) : comp.type;

  // if (isCopyCustomComp(comp) && !(comp.pointer in prevPointers)) {
  //   prevPointers[comp.pointer] = true;
  // }
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
      const newNode = generateNode(childInCopies, originals, copies);

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
      const newNodes = generateNode(childInCopies, originals, copies);

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

// console.log(
//   generateTree(originals['App'] as AppInterface, originals, copies).BFS()
// );
// console.log(generateTree(originals['App'] as AppInterface, originals, copies).PreOrder());
// console.log(generateNode(copies['CoolComponent0'], originals, copies));

// const treeNodes: any[] = [];
// const treeEdges: any[] = [];
// const tree = generateTree(
//   originals['App'] as AppInterface,
//   originals,
//   copies
// );

// const makeNodes = (root) => {
//   let newNode;
//   let newEdge;
//   if (root.name === 'App') {
//     newNode = {
//       id: root.name,
//       type: 'input',
//       data: { label: 'App' },
//       position: { x: 0, y: 0 },
//     };
//   } else {
//     if (root.children.length) {
//       newNode = {
//         id: root.name,
//         type: 'default',
//         data: { label: root.name },
//         position: { x: 0, y: 0 },
//       };
//     } else {
//       newNode = {
//         id: root.name,
//         type: 'output',
//         data: { label: root.name },
//         position: { x: 0, y: 0 },
//       };
//     }
//   }
//   treeNodes.push(newNode);
//   // console.log(root.children);
//   root.children.forEach((node) => {
//     newEdge = {
//       id: `${root.name}-to-${node.name}`,
//       source: root.name,
//       target: node.name,
//       type: 'smoothstep',
//     };

//     treeEdges.push(newEdge);
//     return makeNodes(node);
//   });
// };

// makeNodes(tree.root);

export default generateTree;