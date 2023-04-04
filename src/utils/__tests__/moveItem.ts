// import { moveItem } from '../moveItem';
// import { AppInterface, OrigNativeEl, OrigCustomComp, CopyNativeEl, Originals, Copies } from '../interfaces';

// describe('moveItem tests', () => {
//   let originals: Originals = {
//     App: {
//       type: 'App',
//       children: ['View0', 'Button0', 'Text0'],
//       state: [],
//     } as AppInterface,
//     View: { type: 'View', index: 1 } as OrigNativeEl,
//     Button: { type: 'Button', index: 1 } as OrigNativeEl,
//     Text: { type: 'Text', index: 1 } as OrigNativeEl,
//     Image: { type: 'Image', index: 0 } as OrigNativeEl,
//     TextInput: { type: 'TextInput', index: 0 } as OrigNativeEl,
//     ScrollView: { type: 'ScrollView', index: 0 } as OrigNativeEl,
//     FlatList: { type: 'FlatList', index: 0 } as OrigNativeEl,
//     SectionList: { type: 'SectionList', index: 0 } as OrigNativeEl,
//     Switch: { type: 'Switch', index: 0 } as OrigNativeEl,
//     TouchableHighlight: { type: 'TouchableHighlight', index: 0 } as OrigNativeEl,
//     TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
//     StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
//     ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
//   }
//   // setOriginals is a React hook that we will pass into a function that will call it
//   let setOriginals = (callback: Function, originalsState: Originals = originals) => {
//     console.log(originalsState)
//     const newState = callback(originalsState);
//     originalsState = newState;
//   }

//   let copies: Copies = {
//     View0: {
//       name: 'View0',
//       type: 'View',
//       parent: { origin: 'original', key: 'App' },
//       children: [],
//     },
//     Button0: {
//       name: 'Button0',
//       type: 'Button',
//       parent: { origin: 'original', key: 'App' },
//       children: [],
//     },
//     Text0: {
//       name: 'Text0',
//       type: 'Text',
//       parent: { origin: 'original', key: 'App' },
//       children: [],
//     },
//   };

//   let setCopies = (callback: Function, copies: Copies) => {
//     copies = callback(copies);
//   }

//   setOriginals((prevOriginals) => {
//     return {};
//   });
//   console.log(originals)
//   it('should move an item from top level to top level', () => {
//     const App = originals.App as AppInterface;
//     //moveItem(originals, setOriginals as any, copies, setCopies as any, 0, 2, 'View0', 'App', 'App');
//     expect(App.children).toBe(['Button0', 'Text0', 'View0']);
//   });

  // moveItem(originals, setOriginals, copies, setCopies, dragIndex, hoverIndex, name, parentComp, parent);
  // test for if the item is moved from top level to top level
  // test for if the item is moved from top level to nested
  // test for if the item is moved from nested to top level
  // test for if the item is moved from nested to nested
// })