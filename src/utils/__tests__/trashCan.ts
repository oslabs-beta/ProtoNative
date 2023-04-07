import {
    Originals,
    Copies,
    OrigNativeEl,
    OrigCustomComp,
    AppInterface,
} from '../interfaces';
import { trashCan } from '../trashCan';
import { deepCopy } from '../deepCopy';

/**
 
 * @description - runs jest tests on the trashCan function
 
 */

describe('trashCan tests', () => {
  const originals: Originals = {
      App: {
        type: 'App',
        children: [],
        state: [],
      } as AppInterface,
      View: { type: 'View', index: 0 } as OrigNativeEl,
      Button: { type: 'Button', index: 0 } as OrigNativeEl,
      Text: { type: 'Text', index: 0 } as OrigNativeEl,
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
    }
    
    const copies: Copies = {}

    // Test delete component with no children in App
  it('deletes childless component from App', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['View0'],
      state: [],
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(App.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
  });
  // Test delete custom component copy
  it('deletes custom component copy', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['CoolBruh0'],
      state: [],
    }
    copyOriginals['CoolBruh'] ={
      name: 'CoolBruh',
      type: 'custom',
      children: [],
      state: [],
      index: 1,
      copies: ['CoolBruh0'],
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['CoolBruh0'] = {
      name: 'CoolBruh0',
      type: 'custom',
      parent: { origin: 'original', key: 'App'},
      pointer: 'CoolBruh',
    }
    const CoolBruh = copyOriginals['CoolBruh'] as OrigCustomComp;
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['CoolBruh0'], copyOriginals, copyCopies);
    expect(CoolBruh.copies).toEqual([]);
    expect(copyCopies['CoolBruh0']).toBeUndefined();
    expect(App.children).toEqual([]);
  })

  // Test delete component with no children in a custom component
  it('deletes component with no children nested in a custom component', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['CoolBruh'] = {
      name: 'CoolBruh',
      type: 'custom',
      children: ['View0'],
      state: [],
      index: 0,
      copies: [],
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'CoolBruh' },
      children: [],
    }
    const CoolBruh = copyOriginals['CoolBruh'] as OrigCustomComp;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(CoolBruh.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
  })

  // Test delete component with no children in a native component
  it('deletes component with no children nested in a native component', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['View0'],
      state: [],
    }
    copyOriginals['View'] = {
      type: 'View',
      index: 2,
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: ['View1'],
    }
    copyCopies['View1'] = {
      name: 'View1',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['View1'], copyOriginals, copyCopies);
    expect(copyCopies['View0'].children).toEqual([]);
    expect(copyCopies['View1']).toBeUndefined();
  })

  // Test delete component with child nested in a native component
  it('deletes component with child nested in a native component', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['View0'],
      state: [],
    }
    copyOriginals['View'] = {
      type: 'View',
      index: 2,
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: ['View1'],
    }
    copyCopies['View1'] = {
      name: 'View1',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(App.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
    expect(copyCopies['View1']).toBeUndefined();
  })

  // Test delete component with one child
  it('deletes native component from custom component', () => {
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['CoolBruh'] = {
      name: 'CoolBruh',
      type: 'custom',
      children: ['View0'],
      state: [],
      index: 0,
      copies: [],
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'CoolBruh' },
      children: [],
    }
    const CoolBruh = copyOriginals['CoolBruh'] as OrigCustomComp;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(CoolBruh.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
  })

  // Test delete component with two sibling children
  it('deletes a component with two sibling children', () => {
    
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['View0'],
      state: [],
    }
    copyOriginals['View'] = {
      type: 'View',
      index: 3,
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: ['View1', 'View2'],
    }
    copyCopies['View1'] = {
      name: 'View1',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: [],
    }
    copyCopies['View2'] = {
      name: 'View2',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(App.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
    expect(copyCopies['View1']).toBeUndefined();
    expect(copyCopies['View2']).toBeUndefined();
  })

  // Test delete native component with deeply nested children
  //    See if all children are deleted
  it('deletes a native component and its deeply nested children', () => {
    
    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['View0'],
      state: [],
    }
    copyOriginals['View'] = {
      type: 'View',
      index: 4,
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'App' },
      children: ['View1'],
    }
    copyCopies['View1'] = {
      name: 'View1',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: ['View2'],
    }
    copyCopies['View2'] = {
      name: 'View2',
      type: 'View',
      parent: { origin: 'copies', key: 'View1' },
      children: ['View3'],
    }
    copyCopies['View3'] = {
      name: 'View3',
      type: 'View',
      parent: { origin: 'copies', key: 'View2' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    trashCan(copyCopies['View0'], copyOriginals, copyCopies);
    expect(App.children).toEqual([]);
    expect(copyCopies['View0']).toBeUndefined();
    expect(copyCopies['View1']).toBeUndefined();
    expect(copyCopies['View2']).toBeUndefined();
    expect(copyCopies['View3']).toBeUndefined();
  })

  // Test delete custom component with deeply nested children
  //    See if all children are deleted
  it('deletes a custom component and its deeply nested children', () => {

    const copyOriginals = deepCopy(originals) as Originals;
    copyOriginals['App'] = {
      type: 'App',
      children: ['CoolBruh0'],
      state: [],
    }
    copyOriginals['CoolBruh'] = {
      name: 'CoolBruh',
      type: 'custom',
      children: ['View0'],
      state: [],
      index: 1,
      copies: ['CoolBruh0'],
    }
    const copyCopies = deepCopy(copies) as Copies;
    copyCopies['CoolBruh0'] = {
      name: 'CoolBruh0',
      type: 'custom',
      parent: { origin: 'original', key: 'App' },
      pointer: 'CoolBruh',
    }
    copyCopies['View0'] = {
      name: 'View0',
      type: 'View',
      parent: { origin: 'original', key: 'CoolBruh' },
      children: ['View1'],
    }
    copyCopies['View1'] = {
      name: 'View1',
      type: 'View',
      parent: { origin: 'copies', key: 'View0' },
      children: ['View2'],
    }
    copyCopies['View2'] = {
      name: 'View2',
      type: 'View',
      parent: { origin: 'copies', key: 'View1' },
      children: ['View3'],
    }
    copyCopies['View3'] = {
      name: 'View3',
      type: 'View',
      parent: { origin: 'copies', key: 'View2' },
      children: [],
    }
    const App = copyOriginals['App'] as AppInterface;
    const CoolBruh = copyOriginals['CoolBruh'] as OrigCustomComp;
    trashCan(copyCopies['CoolBruh0'], copyOriginals, copyCopies);
    expect(App.children).toEqual([]);
    expect(CoolBruh.children).toEqual([]);
    expect(copyCopies['CoolBruh0']).toBeUndefined();
    expect(copyCopies['View0']).toBeUndefined();
    expect(copyCopies['View1']).toBeUndefined();
    expect(copyCopies['View2']).toBeUndefined();
    expect(copyCopies['View3']).toBeUndefined();
  })

})

  // TODO: later in other files, use React testing library to test if components are reading the context and rendering correctly