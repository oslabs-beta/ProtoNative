import { OrigCustomComp, OrigNativeEl, Originals, AppInterface, Copies, CopyCustomComp, CopyNativeEl } from '../interfaces';
import { generateTree } from '../generateTree';

/**
 
 * @description - runs jest tests on the generateTree function
 
 */

describe('generateTree tests', () => {

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
      copies: ['WorldComponent0', 'WorldComponent1', 'WorldComponent2'],
    } as OrigCustomComp,
    DownBadComponent: {
      name: 'DownBadComponent',
      type: 'custom',
      children: [],
      state: [],
      index: 2,
      copies: ['DownBadComponent0', 'DownBadComponent1'],
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
      children: ['HelloComponent0', 'View5', 'WorldComponent1'],
    } as CopyNativeEl,
    View5: {
      name: 'View5',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: ['HelloComponent1'],
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
    HelloComponent1: {
      name: 'HelloComponent1',
      type: 'custom',
      parent: { origin: 'copies', key: 'View5' },
      pointer: 'HelloComponent',
    } as CopyCustomComp,
    WorldComponent0: {
      name: 'WorldComponent0',
      type: 'custom',
      parent: { origin: 'copies', key: 'View3' },
      pointer: 'WorldComponent',
    } as CopyCustomComp,
    WorldComponent2: {
      name: 'WorldComponent2',
      type: 'custom',
      parent: { origin: 'copies', key: 'View1' },
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
  const App = originals['App'] as AppInterface;
  const tree = generateTree(App, originals, copies);

  // test that the generated object contains correct App
  it('Should generate the correct root from App', () => {
    expect(tree.root.name).toBe('App');
    expect(tree.root.children).toHaveLength(3);
  })

  // test that App's children are correct
  it('should generate the expected children for App', () => {
    console.log(tree.root.children);
    console.log(tree.root.children[0].children);
    const TestComponent = tree.root.children[0];
    const HelloComponent = tree.root.children[1];
    const WorldComponent = tree.root.children[2];
    expect(TestComponent.name).toBe('TestComponent');
    expect(HelloComponent.name).toBe('HelloComponent');
    expect(WorldComponent.name).toBe('WorldComponent');
    expect(TestComponent.children).toHaveLength(1);
    expect(HelloComponent.children).toHaveLength(0);
    expect(WorldComponent.children).toHaveLength(0);
  });

  // the tree displays only custom components, not native elements
  // test that TestComponent's children are correct
  it('should generate the expected tree output from a deeply nested component', () => {
    const CoolComponent = tree.root.children[0].children[0];
    expect(CoolComponent.name).toBe('CoolComponent');
    console.log(CoolComponent.children);
    const DownBadComponent = CoolComponent.children[0];
    const BruhComponent = CoolComponent.children[1];
    expect(DownBadComponent.name).toBe('DownBadComponent');
    expect(BruhComponent.name).toBe('BruhComponent');
    const WorldComponent = BruhComponent.children[0];
    expect(WorldComponent.name).toBe('WorldComponent');
    expect(WorldComponent.children).toHaveLength(0);
  });
});