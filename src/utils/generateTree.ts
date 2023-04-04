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

const originals: Originals = {
  App: {
    type: 'App',
    children: ['TestComponent0', 'View0'],
    state: [],
  } as AppInterface,
  View: { type: 'View', index: 3 } as OrigNativeEl,
  Button: { type: 'Button', index: 3 } as OrigNativeEl,
  Text: { type: 'Text', index: 1 } as OrigNativeEl,
  Image: { type: 'Image', index: 0 } as OrigNativeEl,
  TextInput: { type: 'TextInput', index: 0 } as OrigNativeEl,
  ScrollView: { type: 'ScrollView', index: 0 } as OrigNativeEl,
  FlatList: { type: 'FlatList', index: 0 } as OrigNativeEl,
  SectionList: { type: 'SectionList', index: 0 } as OrigNativeEl,
  Switch: { type: 'Switch', index: 0 } as OrigNativeEl,
  TouchableHighlight: {
    type: 'TouchableHighlight',
    index: 0,
  } as OrigNativeEl,
  TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
  StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
  ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
  TestComponent: {
    name: 'TestComponent',
    type: 'custom',
    children: ['CoolComponent0'],
    state: [],
    index: 3,
    copies: ['TestComponent0'],
  } as OrigCustomComp,
  CoolComponent: {
    name: 'CoolComponent',
    type: 'custom',
    children: ['View4', 'BruhComponent0'],
    state: [],
    index: 1,
    copies: ['CoolComponent0', 'CoolComponent1'],
  } as OrigCustomComp,
  BruhComponent: {
    name: 'BruhComponent',
    type: 'custom',
    children: ['Button3', 'View3'],
    state: [],
    index: 1,
    copies: ['BruhComponent0', 'BruhComponent1', 'BruhComponent2'],
  } as OrigCustomComp,
  HelloComponent: {
    name: 'HelloComponent',
    type: 'custom',
    children: [],
    state: [],
    index: 1,
    copies: ['HelloComponent0'],
  } as OrigCustomComp,
  WorldComponent: {
    name: 'WorldComponent',
    type: 'custom',
    children: [],
    state: [],
    index: 1,
    copies: ['WorldComponent0', 'WorldComponent1'],
  } as OrigCustomComp,
  DownBadComponent: {
    name: 'DownBadComponent',
    type: 'custom',
    children: [],
    state: [],
    index: 1,
    copies: ['DownBadComponent0'],
  } as OrigCustomComp
};

const copies: Copies = {
  Button3: {
    name: 'Button3',
    type: 'Button',
    parent: { origin: 'original', key: 'BruhComponent' },
    children: [],
  } as CopyNativeEl,
  Button4: {
    name: 'Button4',
    type: 'Button',
    parent: { origin: 'copies', key: 'View3' },
    children: [],
  } as CopyNativeEl,
  View3: {
    name: 'View3',
    type: 'View',
    parent: { origin: 'original', key: 'BruhComponent' },
    children: ['Button4', 'WorldComponent0'],
  } as CopyNativeEl,
  View0: {
    name: 'View0',
    type: 'View',
    parent: { origin: 'original', key: 'App' },
    children: ['HelloComponent0', 'DownBadComponent0', 'WorldComponent1'],
  } as CopyNativeEl,
  View1: {
    name: 'View1',
    type: 'View',
    parent: { origin: 'copies', key: 'View4' },
    children: ['BruhComponent1'],
  } as CopyNativeEl,
  TestComponent0: {
    name: 'TestComponent0',
    type: 'custom',
    parent: { origin: 'original', key: 'App' },
    pointer: 'TestComponent',
  } as CopyCustomComp,
  CoolComponent0: {
    name: 'CoolComponent0',
    type: 'custom',
    parent: { origin: 'original', key: 'TestComponent' },
    pointer: 'CoolComponent',
  } as CopyCustomComp,
  HelloComponent0: {
    name: 'HelloComponent0',
    type: 'custom',
    parent: { origin: 'copies', key: 'View0' },
    pointer: 'HelloComponent',
  } as CopyCustomComp,
  WorldComponent0: {
    name: 'WorldComponent0',
    type: 'custom',
    parent: { origin: 'copies', key: 'View3' },
    pointer: 'WorldComponent',
  } as CopyCustomComp,
  BruhComponent0: {
    name: 'BruhComponent0',
    type: 'custom',
    parent: { origin: 'original', key: 'CoolComponent' },
    pointer: 'BruhComponent',
  } as CopyCustomComp,
  BruhComponent1: {
    name: 'BruhComponent1',
    type: 'custom',
    parent: { origin: 'copies', key: 'View1' },
    pointer: 'BruhComponent',
  } as CopyCustomComp,
  BruhComponent2: {
    name: 'BruhComponent2',
    type: 'custom',
    parent: { origin: 'copies', key: 'View0' },
    pointer: 'BruhComponent',
  } as CopyCustomComp,
  WorldComponent1: {
    name: 'WorldComponent1',
    type: 'custom',
    parent: { origin: 'copies', key: 'View0' },
    pointer: 'WorldComponent',
  } as CopyCustomComp,
  View4: {
    name: 'View4',
    type: 'View',
    parent: { origin: 'original', key: 'CoolComponent' },
    children: ['DownBadComponent1', 'View1'],
  } as CopyNativeEl,
  DownBadComponent0: {
    name: 'DownBadComponent0',
    type: 'custom',
    parent: { origin: 'copies', key: 'View0' },
    pointer: 'DownBadComponent',
  } as CopyCustomComp,
  DownBadComponent1: {
    name: 'DownBadComponent1',
    type: 'custom',
    parent: { origin: 'copies', key: 'View4' },
    pointer: 'DownBadComponent',
  } as CopyCustomComp
  
};

class TreeNode {
  private _name: string;
  private _data: OrigCustomComp | AppInterface;
  private _children: TreeNode[];

  constructor(data: OrigCustomComp | AppInterface) {
    this._name = isOrigCustomComp(data) ? data.name : data.type;
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
      console.log('CURR NODE!!!', currNode);
      // console.log(currNode.children);
      console.log('-----------------');
    }
  }

  PreOrder(node: TreeNode = this._root): void {
    console.log(node.name);
    console.log('---------');
    if (node.children.length) {
      for (const child of node.children) {
        this.PreOrder(child);
      }
    }
  }
}

const generateTree = (
  root: AppInterface,
  originals: Originals,
  copies: Copies
): Tree => {
  // create new tree node that be the root of our tree
  const ComponentTreeRoot = new TreeNode(root);
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
      // if (ComponentTreeRoot.children.every(child => child.name !== childInCopies.pointer)) {
      //   // const newChildNode = new TreeNode(originals[childInCopies.pointer] as OrigCustomComp);
      //   ComponentTreeRoot.addChild(generateNode(childInCopies, originals, copies));
      // }

      ComponentTreeRoot.addChild(
        generateNode(childInCopies, originals, copies)
      );
      prevPointers[childInCopies.pointer] = true;
    } else if (isDoubleTagElement(childInCopies.type)) {
      // const newNode = generateNode(childInCopies, originals, copies);
      // // console.log('NEW NODE', newNode);
      // if (newNode !== null && !(comp.pointer in prevPointers)) {
      //   compNode.addChild(newNode);
      // }
      const newNodes = generateNode(childInCopies, originals, copies).flat(
        Infinity
      );
      // console.log('NEW NODE', newNode);
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
  console.log('COMPONENT:', isCopyCustomComp(comp) ? comp.pointer : comp.type);

  const originalsComp = originals[comp.pointer] as OrigCustomComp;

  const prevPointers: { [key: string]: boolean } = {};

  const compNode = isCopyCustomComp(comp) ? new TreeNode(originalsComp) : null;
  // const compNode = isCopyCustomComp(comp) ? new TreeNode(originalsComp) : comp.type;

  // if (isCopyCustomComp(comp) && !(comp.pointer in prevPointers)) {
  //   prevPointers[comp.pointer] = true;
  // }
  const componentChildren: string[] = isCopyCustomComp(comp)
    ? originalsComp.children
    : comp.children;
  // console.log('Component children =========', componentChildren);
  if (componentChildren.length === 0) {
    if (compNode === null) return [];
    // if (isDoubleTagElement(compNode)) return [];
    return compNode;
  }

  // return arrNodes if compNode is Double Tagged Element
  const arrNodes: TreeNode[] = [];
  for (const child of componentChildren) {
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    console.log('CHILD', child);
    if (isCopyCustomComp(childInCopies)) {
      // const newNode = new TreeNode(originals[childInCopies.pointer] as OrigCustomComp);

      const newNode = generateNode(childInCopies, originals, copies);
      console.log(
        'prev pointers-----------',
        `Exec Context: ${isCopyCustomComp(comp) ? comp.pointer : comp.type}`,
        prevPointers
      );
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
      console.log('NEW NODES', newNodes);
      console.log('NEW NODES CHILDREN++++++++', newNodes[0].children);

      if (compNode === null) return newNodes;
      // console.log('NEW NODE', newNode);
      console.log(
        'PREV POINTERS',
        `Exec Context: ${isCopyCustomComp(comp) ? comp.pointer : comp.type}`,
        prevPointers
      );
      // console.log('CURR COMP NODE', compNode);
      // console.log(
      //   'COMPONENT:',
      //   isCopyCustomComp(comp) ? comp.pointer : comp.type
      // );
      for (const node of newNodes) {
        if (node !== null && !(node.name in prevPointers)) {
          compNode.addChild(node);
          prevPointers[node.name] = true;
        }
      }
      // if (newNode !== null && !(comp.pointer in prevPointers)) {
      //   compNode.addChild(newNode);
      // }
    }
  }

  if (compNode === null) return arrNodes;

  return compNode;
};

console.log(
  generateTree(originals['App'] as AppInterface, originals, copies).BFS()
);
// console.log(generateTree(originals['App'] as AppInterface, originals, copies).PreOrder());
// console.log(generateNode(copies['CoolComponent0'], originals, copies));
