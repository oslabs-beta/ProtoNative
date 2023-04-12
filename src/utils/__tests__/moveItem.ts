import { moveItem } from '../moveItem';
import { AppInterface, OrigNativeEl, OrigCustomComp, CopyNativeEl, Originals, Copies } from '../interfaces';

/**
 
 * @description - runs jest tests on the moveItem function
 
 */

describe('moveItem tests', () => {
  let originals: Originals = {
    App: {
      type: 'App',
      children: ['View0', 'Button0', 'Text0'],
      state: [],
    } as AppInterface,
    View: { type: 'View', index: 3 } as OrigNativeEl,
    Button: { type: 'Button', index: 3 } as OrigNativeEl,
    Text: { type: 'Text', index: 2 } as OrigNativeEl,
    Image: { type: 'Image', index: 0 } as OrigNativeEl,
    TextInput: { type: 'TextInput', index: 0 } as OrigNativeEl,
    ScrollView: { type: 'ScrollView', index: 0 } as OrigNativeEl,
    FlatList: { type: 'FlatList', index: 0 } as OrigNativeEl,
    SectionList: { type: 'SectionList', index: 0 } as OrigNativeEl,
    Switch: { type: 'Switch', index: 0 } as OrigNativeEl,
    TouchableHighlight: { type: 'TouchableHighlight', index: 0 } as OrigNativeEl,
    TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
    StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
    ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
    CoolComponent: {
      name: 'CoolComponent',
      type: 'custom',
      children: ['View1', 'Button1', 'Text1'],
      state: [],
      index: 0,
      copies: [],
    } as OrigCustomComp,
    NiceComponent: {
      name: 'NiceComponent',
      type: 'custom',
      children: ['View2'],
      state: [],
      index: 0,
      copies: [],
    } as OrigCustomComp,
    BigComponent: {
      name: 'BigComponent',
      type: 'custom',
      children: ['View3', 'Text3'],
      state: [],
      index: 0,
      copies: [],
    } as OrigCustomComp,
  }

  const setOriginals = (callback: Function) => {
    originals = callback(originals);
  }

  let copies: Copies = {
    View0: {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: [],
    },
    Button0: {
      name: 'Button0',
      type: 'Button',
      parent: { origin: 'original', key: 'App' },
      children: [],
    },
    Text0: {
      name: 'Text0',
      type: 'Text',
      parent: { origin: 'original', key: 'App' },
      children: [],
    },
    View1: {
      name: 'View1',
      type: 'View',
      parent: { origin: 'original', key: 'CoolComponent' },
      children: [],
    },
    Button1: {
      name: 'Button1',
      type: 'Button',
      parent: { origin: 'original', key: 'CoolComponent' },
      children: [],
    },
    Text1: {
      name: 'Text1',
      type: 'Text',
      parent: { origin: 'original', key: 'CoolComponent' },
      children: [],
    },
    Button2: {
      name: 'Button2',
      type: 'Button',
      parent: { origin: 'copies', key: 'View2' },
      children: [],
    },
    View2: {
      name: 'View2',
      type: 'View',
      parent: { origin: 'original', key: 'NiceComponent' },
      children: ['Button2'],
    },
     Text3: {
      name: 'Text3',
      type: 'Text',
      parent: { origin: 'original', key: 'BigComponent' },
      children: [],
    },
    Button3: {
      name: 'Button3',
      type: 'Button',
      parent: { origin: 'copies', key: 'View3' },
      children: [],
    },
    View3: {
      name: 'View3',
      type: 'View',
      parent: { origin: 'original', key: 'BigComponent' },
      children: ['Button3'],
    }
  };

  const setCopies = (callback: Function) => {
    copies = callback(copies);
  }
  
  // test for if the item is moved from top level to top level
  it('should move an item from top level to top level', () => {
    moveItem(originals, setOriginals as any, copies, setCopies as any, 0, 3, 'View0', 'App', 'App');
    const App = originals.App as AppInterface;
    expect(App.children).toEqual(['Button0', 'Text0', 'View0']);
  });

  // test for if the item is moved from top level to nested
  it('should move an item from top level to nested', () => {
    moveItem(originals, setOriginals as any, copies, setCopies as any, 2, 1, 'Text1', 'CoolComponent', 'View1');
    const CoolComponent = originals['CoolComponent'] as OrigCustomComp;
    const View1 = copies['View1'] as CopyNativeEl;
    const Text1 = copies['Text1'] as CopyNativeEl;
    expect(CoolComponent.children).toEqual(['View1', 'Button1']);
    expect(View1.children).toEqual(['Text1']);
    expect(Text1.parent).toEqual({ origin: 'copies', key: 'View1' });
  });

  // test for if the item is moved from nested to top level
  it('should move an item from nested to top level', () => {
    moveItem(originals, setOriginals as any, copies, setCopies as any, 0, 1, 'Button2', 'View2', 'NiceComponent');
    const NiceComponent = originals['NiceComponent'] as OrigCustomComp;
    const View2 = copies['View2'] as CopyNativeEl;
    const Button2 = copies['Button2'] as CopyNativeEl;
    expect(NiceComponent.children).toEqual(['View2', 'Button2']);
    expect(View2.children).toEqual([]);
    expect(Button2.parent).toEqual({ origin: 'original', key: 'NiceComponent' });
  });

  // test for if the item is moved from nested to nested
  it('should move an item from nested to nested', () => {
    moveItem(originals, setOriginals as any, copies, setCopies as any, 0, 1, 'Button3', 'View3', 'Text3');
    const View3 = copies['View3'] as CopyNativeEl;
    const Button3 = copies['Button3'] as CopyNativeEl;
    const Text3 = copies['Text3'] as CopyNativeEl;
    expect(View3.children).toEqual([]);
    expect(Button3.parent).toEqual({ origin: 'copies', key: 'Text3' });
    expect(Text3.children).toEqual(['Button3']);
  });
});
