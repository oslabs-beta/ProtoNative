import { deepCopy } from '../deepCopy';
import { Originals, OrigNativeEl, AppInterface } from '../interfaces';

/**
 
 * @description - runs jest test on the deepCopy function
 
 */


describe('deepCopy tests', () => {
  const originals: Originals = {
    App: {
      type: 'App',
      children: ['View0'],
      state: [],
    } as AppInterface,
    View: { type: 'View', index: 1 } as OrigNativeEl,
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

  it('should return a deep copy of an object', () => {
    const testCopy = deepCopy(originals);
    const appCopy = testCopy.App as AppInterface;
    const appOriginal = originals.App as AppInterface;
    expect(testCopy).not.toBe(originals);
    expect(testCopy.App).not.toBe(originals.App);
    expect(appCopy.children).not.toBe(appOriginal.children);
    expect(testCopy).toEqual(originals);
  })
})