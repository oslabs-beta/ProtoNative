import {
  OrigCustomComp,
  AppInterface,
  CopyCustomComp,
  CopyNativeEl,
  Originals,
  Copies,
  OrigNativeEl,
} from './interfaces';
import { isCopyCustomComp, isDoubleTagElement, isOrigCustomComp } from './parser';

const originals: Originals = {
  App: {
    type: 'App',
    children: ['TestComponent0', 'View0', 'TestComponent1', 'TestComponent2'],
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
    children: ['Button0', 'CoolComponent0'],
    state: [],
    index: 3,
    copies: ['TestComponent0', 'TestComponent1', 'TestComponent2'],
  } as OrigCustomComp,
  CoolComponent: {
    name: 'CoolComponent',
    type: 'custom',
    children: ['Button2', 'View1', 'View2', 'BruhComponent0'],
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
    copies: ['BruhComponent0', 'BruhComponent1'],
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
    copies: ['WorldComponent0'],
  } as OrigCustomComp,
};

const copies: Copies = {
  Button0: {
    name: 'Button0',
    type: 'Button',
    parent: { origin: 'original', key: 'TestComponent' },
    children: [],
  } as CopyNativeEl,
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
  View2: {
    name: 'View2',
    type: 'View',
    parent: { origin: 'original', key: 'CoolComponent' },
    children: [],
  } as CopyNativeEl,
  View3: {
    name: 'View3',
    type: 'View',
    parent: { origin: 'original', key: 'BruhComponent' },
    children: ['Button4', 'WorldComponent0'],
  } as CopyNativeEl,
  Text0: {
    name: 'Text0',
    type: 'Text',
    parent: { origin: 'copies', key: 'View1' },
    children: ['Button1'],
  } as CopyNativeEl,
  View0: {
    name: 'View0',
    type: 'View',
    parent: { origin: 'original', key: 'App' },
    children: ['HelloComponent0'],
  } as CopyNativeEl,
  Button1: {
    name: 'Button1',
    type: 'Button',
    parent: { origin: 'copies', key: 'Text0' },
    children: [],
  } as CopyNativeEl,
  View1: {
    name: 'View1',
    type: 'View',
    parent: { origin: 'original', key: 'CoolComponent' },
    children: ['Text0', 'BruhComponent1'],
  } as CopyNativeEl,
  Button2: {
    name: 'Button2',
    type: 'Button',
    parent: { origin: 'original', key: 'CoolComponent' },
    children: [],
  } as CopyNativeEl,
  TestComponent0: {
    name: 'TestComponent0',
    type: 'custom',
    parent: { origin: 'original', key: 'App' },
    pointer: 'TestComponent',
  } as CopyCustomComp,
  TestComponent1: {
    name: 'TestComponent1',
    type: 'custom',
    parent: { origin: 'original', key: 'App' },
    pointer: 'TestComponent',
  } as CopyCustomComp,
  TestComponent2: {
    name: 'TestComponent2',
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
    this._children.splice(this._children.indexOf(child), 1)
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
    const queue = [ this._root ];
    while (queue.length !== 0) {
      const currNode = queue.shift();
      queue.push(...currNode.children);
      console.log('CURR NODE!!!', currNode.name);
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

const generateTree = (root: AppInterface, originals: Originals, copies: Copies): Tree => {
  // create new tree node that be the root of our tree
  const ComponentTreeRoot = new TreeNode(root);
  // we only want a single instance of the child in ComponentTreeRoot's children, so keep track if there are multiple copies as children
  const prevPointers: {[key: string]: boolean} = {};
  // loop over the root's children (children array in AppInterface)
  // every child will be in copies
  for (const child of root.children) {
    // console.log('CHILD', child);
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    if (isCopyCustomComp(childInCopies) && !(childInCopies.pointer in prevPointers)) {
      // if (ComponentTreeRoot.children.every(child => child.name !== childInCopies.pointer)) {
      //   // const newChildNode = new TreeNode(originals[childInCopies.pointer] as OrigCustomComp);
      //   ComponentTreeRoot.addChild(generateNode(childInCopies, originals, copies));
      // }
   
        ComponentTreeRoot.addChild(generateNode(childInCopies, originals, copies));
        prevPointers[childInCopies.pointer] = true;

    } else if (isDoubleTagElement(childInCopies.type)) {
      // const newNode = generateNode(childInCopies, originals, copies);
      // // console.log('NEW NODE', newNode);
      // if (newNode !== null && !(comp.pointer in prevPointers)) {
      //   compNode.addChild(newNode);
      // }
      const newNode = generateNode(childInCopies, originals, copies);
      // console.log('NEW NODE', newNode);
      if (newNode !== null) {
        ComponentTreeRoot.addChild(newNode);
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

const generateNode = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies):TreeNode => {
  // console.log('COMPONENT:', isCopyCustomComp(comp) ? comp.pointer : comp.type);

  const originalsComp = originals[comp.pointer] as OrigCustomComp;

  const prevPointers: {[key: string]: boolean} = {};
 
  const compNode = isCopyCustomComp(comp) && !(comp.pointer in prevPointers) ? new TreeNode(originalsComp) : null;
  if (isCopyCustomComp(comp) && !(comp.pointer in prevPointers)) {
    prevPointers[comp.pointer] = true;
  }
  const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

  if (componentChildren.length === 0) {
    // if (isCopyCustomComp(comp)) {
    //   compNode.addChild(new TreeNode(originals[comp.pointer] as OrigCustomComp));
    // }
    return compNode;
    // return ;
  }

  

  for (const child of componentChildren) {
    const childInCopies: CopyNativeEl | CopyCustomComp = copies[child];
    console.log('CHILD', child);
    if (isCopyCustomComp(childInCopies)) {
      // const newNode = new TreeNode(originals[childInCopies.pointer] as OrigCustomComp);
      if (compNode === null) {
        return generateNode(childInCopies, originals, copies);
        // return new TreeNode(originals[childInCopies.pointer] as OrigCustomComp);
      }
      compNode.addChild(generateNode(childInCopies, originals, copies));
    } else if (isDoubleTagElement(childInCopies.type)) {
      const newNode = generateNode(childInCopies, originals, copies);
      console.log('PREV POINTERS', prevPointers);
      console.log('CURR COMP NODE', compNode);
      console.log('NEW NODE', newNode);
      if (newNode !== null ) {
        compNode.addChild(newNode);
      }
    }
  }

  return compNode;

  console.log('COMP NODE', compNode.name);
  // console.log('COMP NODE CHILDREN', compNode.children);
  console.log('-------------------');
};

console.log(generateTree(originals['App'] as AppInterface, originals, copies).BFS());
// console.log(generateTree(originals['App'] as AppInterface, originals, copies).PreOrder());
// console.log(generateNode(copies['TestComponent0'], originals, copies));