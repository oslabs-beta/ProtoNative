import { addItem } from "../addItem";
import { AppInterface, OrigNativeEl, OrigCustomComp, CopyNativeEl, Originals, Copies } from '../interfaces';

describe('addItem tests', () => {
  
  let originals: Originals;
  let copies: Copies;

  beforeEach(() => {
    originals = {
      App: {
        type: 'App',
        children: ['View0', 'Button0', 'Text0'],
        state: [],
      } as AppInterface,
      View: { type: 'View', index: 4 } as OrigNativeEl,
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
    
    copies = {
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
  });
  const setOriginals = (callback: Function) => {
    originals = callback(originals);
  }
  
  const setCopies = (callback: Function) => {
    copies = callback(copies);
  }

  // test that item gets added to App
  it ('should add item to App', () => {
    addItem(originals, setOriginals as any, copies, setCopies as any, 'View', 1, 'App');
    const App = originals.App as AppInterface;
    expect(App.children).toEqual(['View0', 'View4', 'Button0', 'Text0']);
  })

  // test that item gets added to a custom component
  it ('should add item to a custom component', () => {
    addItem(originals, setOriginals as any, copies, setCopies as any, 'View', 1, 'CoolComponent');
    const CoolComponent = originals.CoolComponent as OrigCustomComp;
    expect(CoolComponent.children).toEqual(['View1', 'View4', 'Button1', 'Text1']);
  })

  // test that item gets added to a native element
  it ('should add item to a native element', () => {
    addItem(originals, setOriginals as any, copies, setCopies as any, 'View', 0, 'View0');
    const View0 = copies.View0 as CopyNativeEl;
    expect(View0.children).toEqual(['View4']);
  })
})