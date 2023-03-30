import {
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  Copies
} from './interfaces';

declare const prettier: any;
declare const prettierPlugins: any;

// const originals: Originals = {
//   App: {
//     type: 'App',
//     children: ['TestComponent0', 'View0', 'TestComponent1', 'TestComponent2'],
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
//     children: ['Button0', 'CoolComponent0'],
//     state: [],
//     index: 3,
//     copies: ['TestComponent0', 'TestComponent1', 'TestComponent2'],
//   } as OrigCustomComp,
//   CoolComponent: {
//     name: 'CoolComponent',
//     type: 'custom',
//     children: ['Button2', 'View1', 'View2', 'BruhComponent0'],
//     state: [],
//     index: 1,
//     copies: ['CoolComponent0'],
//   } as OrigCustomComp,
//   BruhComponent: {
//     name: 'BruhComponent',
//     type: 'custom',
//     children: ['Button3', 'View3'],
//     state: [],
//     index: 1,
//     copies: ['BruhComponent0', 'BruhComponent1'],
//   } as OrigCustomComp,
// };

// const copies: Copies = {
//   Button0: {
//     name: 'Button0',
//     type: 'Button',
//     parent: { origin: 'original', key: 'TestComponent' },
//     children: [],
//   } as CopyNativeEl,
//   Button3: {
//     name: 'Button3',
//     type: 'Button',
//     parent: { origin: 'original', key: 'BruhComponent' },
//     children: [],
//   } as CopyNativeEl,
//   Button4: {
//     name: 'Button4',
//     type: 'Button',
//     parent: { origin: 'copies', key: 'View3' },
//     children: [],
//   } as CopyNativeEl,
//   View2: {
//     name: 'View2',
//     type: 'View',
//     parent: { origin: 'original', key: 'CoolComponent' },
//     children: [],
//   } as CopyNativeEl,
//   View3: {
//     name: 'View3',
//     type: 'View',
//     parent: { origin: 'original', key: 'BruhComponent' },
//     children: ['Button4'],
//   } as CopyNativeEl,
//   Text0: {
//     name: 'Text0',
//     type: 'Text',
//     parent: { origin: 'copies', key: 'View1' },
//     children: ['Button1'],
//   } as CopyNativeEl,
//   View0: {
//     name: 'View0',
//     type: 'View',
//     parent: { origin: 'original', key: 'App' },
//     children: [],
//   } as CopyNativeEl,
//   Button1: {
//     name: 'Button1',
//     type: 'Button',
//     parent: { origin: 'copies', key: 'Text0' },
//     children: [],
//   } as CopyNativeEl,
//   View1: {
//     name: 'View1',
//     type: 'View',
//     parent: { origin: 'original', key: 'CoolComponent' },
//     children: ['Text0', 'BruhComponent1'],
//   } as CopyNativeEl,
//   Button2: {
//     name: 'Button2',
//     type: 'Button',
//     parent: { origin: 'original', key: 'CoolComponent' },
//     children: [],
//   } as CopyNativeEl,
//   TestComponent0: {
//     name: 'TestComponent0',
//     type: 'custom',
//     parent: { origin: 'original', key: 'App' },
//     pointer: 'TestComponent',
//   } as CopyCustomComp,
//   TestComponent1: {
//     name: 'TestComponent1',
//     type: 'custom',
//     parent: { origin: 'original', key: 'App' },
//     pointer: 'TestComponent',
//   } as CopyCustomComp,
//   TestComponent2: {
//     name: 'TestComponent2',
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
//   BruhComponent0: {
//     name: 'BruhComponent0',
//     type: 'custom',
//     parent: { origin: 'original', key: 'CoolComponent' },
//     pointer: 'BruhComponent',
//   } as CopyCustomComp,
//   BruhComponent1: {
//     name: 'BruhComponent1',
//     type: 'custom',
//     parent: { origin: 'copies', key: 'View1' },
//     pointer: 'BruhComponent',
//   } as CopyCustomComp,
// }

/**
 * @method capitalizeFirst
 * @description - capitalizes first letter of input string
 * @input - string
 * @output - string with capitalized first letter
 */
const capitalizeFirst = (str: string): string => {
  if (str.length === 0) return '';
  return str[0].toUpperCase() + str.slice(1);
};

/**
 * @method importReact
 * @description - returns the main react import statement
 */
const importReact = (component: OrigCustomComp | AppInterface): string => {
  let hooksToImport = '';
  if (component.state.length !== 0) {
    hooksToImport += 'useState';
  }
  return `import React ${hooksToImport !== '' ? `, { ${hooksToImport} }` : ''} from 'react';\n`;
};

/**
 * @method isDoubleTagElement
 * @description - checks whether element is a double tag element (i.e. if it can have children)
 * @input - string of the name of element
 * @output - boolean -> true if element is a double tag element, false if not
 */
export const isDoubleTagElement = (elementName: string): boolean => {
  const DOUBLE_TAG_ELEMENTS: {[key: string]: boolean} = {
    View: true,
    Text: true,
    ScrollView: true,
    TouchableHighlight: true,
    TouchableOpacity: true,
  };
  return DOUBLE_TAG_ELEMENTS[elementName] !== undefined;
};

/**
 * @method isCopyCustomComp
 * @description - checks whether comp is of interface CopyCustomComp
 * @input - either CopyNativeEl or CopyCustomComp (anything in copies)
 * @output - boolean -> true if input is of interface CopyCustomComp
 * (technically, output is a type guard)
 */
export const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method isOrigCustomComp
 * @description - checks whether comp is of interface OrigCustomComp
 * @input - either OrigCustomComp or OrigNativeEl or AppInterface (anything in originals)
 * @output - boolean -> true if input is of interface OrigCustomComp
 * (technically, output is a type guard)
 */
export const isOrigCustomComp = (comp: OrigCustomComp | OrigNativeEl | AppInterface): comp is OrigCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method addState
 * @description - generates the strings for state variables
 * @input - array of string names of the state variables
 * @output - all strings for the state variables
 */
const addState = (stateNames: string[]): string => {
  let stateVariables: string = '';
  for (const stateVar of stateNames) {
    stateVariables += `const [${stateVar}, set${capitalizeFirst(stateVar)}] = useState(null);\n`;
  }
  return stateVariables;
};

/**
 * @method getNativeImports
 * @description - recursively gathers all native core components to be imported starting at native element and going through its children
 * @input - element of interface CopyNativeEl or CopyCustomComp (in case custom components are wrapped inside native elements)
 * @output - array of strings containing which native core components need to be imported
 */
const getNativeImports = (comp: CopyNativeEl | CopyCustomComp, copies: Copies, originals: Originals): string[] => {
  const toImport: string[] = [];
  const allNativeImports = (comp: CopyNativeEl | CopyCustomComp): void => {
    const originalComp = originals[comp.pointer] as OrigCustomComp;
    const compChildren: string[] = isCopyCustomComp(comp) ? originalComp.children : comp.children;
    if (compChildren.length === 0) {
      if (!isCopyCustomComp(comp)) toImport.push(comp.type);
      return;
    }
    if (!isCopyCustomComp(comp)) toImport.push(comp.type);
    for (const child of compChildren) {
      allNativeImports(copies[child]);
    }
  }
  allNativeImports(comp);
  return toImport;
}

/**
 * @method addNativeImports
 * @description - generates the import statement for importing native core components
 * @input - object containing the native core components to be imported
 * @output - import statement for importing the native core components passed in 
 */
const addNativeImports = (toImport: {}): string => {
  let componentsToImport: string = '';
  for (const nativeElement in toImport) {
    componentsToImport += `${nativeElement},`;
  }
  // take off last comma
  return `import { ${componentsToImport.slice(0, -1)} } from 'react-native';\n`;
};

/**
 * @method addCustomCompImport
 * @description - generates the import statement for importing custom components
 * @input - string name of the custom component, boolean to check whether the current component in generateCustomComponentCode is App
 * @output - import statement for importing the custom component 
 */
const addCustomCompImport = (toImport: string, isCompApp: boolean): string => {
  return `import ${toImport} from '.${isCompApp ? '/Components' : ''}/${toImport}';\n`;
};

/**
 * @method addCustomCompExport
 * @description - generates the export statement for exporting custom components
 * @input - string name of the custom component
 * @output - export statement for exporting the custom component 
 */
const addCustomCompExport = (toExport: string): string => {
  return `export default ${toExport};\n`;
};

/**
 * @method generateComponentCode
 * @description - generates the necessary code for a custom component or native core component in copies context, recursively goes through its children
 * @input - component of interface CopyNativeEl or CopyCustomComp
 * @output - string of the code necessary for the component passed in
 */
const generateComponentCode = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies): string => {
  const currElement: string = isCopyCustomComp(comp) ? comp.pointer : comp.type;
  const originalsComp = originals[comp.pointer] as OrigCustomComp;
  const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

  if (componentChildren.length === 0 || comp.type === 'custom') {
    return isDoubleTagElement(currElement)
      ? `<${currElement}>
         </${currElement}>`
      : `<${currElement}/>`;
  }

  let childrenNodes: string = '';
  for (const child of componentChildren) {
    childrenNodes += `${generateComponentCode(copies[child], originals, copies)}\n`;
  }
  return  `<${currElement}> 
              ${childrenNodes} 
          </${currElement}>`;
};

/**
 * @method generateCustomComponentCode
 * @description - generates the necessary code for a custom component in originals context
 * @input - name of the custom component to generate the code for
 * @output - string of the code necessary for the custom component passed in
 */
const generateCustomComponentCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  // store to save all native core components to be imported
  // always import View 
  const importNative: {[key: string]: boolean} = { View: true };
  // store to save all the custom components to be imported
  const importCustom: {[key: string]: boolean} = {};
  // returnedComponentCode will contain everything that goes into the return statement of component
  let returnedComponentCode: string = '';
  // generate stuff in return statement
  // keep track of what native/ custom components we need
  for (const child of component.children) {
    // find the child in copies context
    const foundChild: CopyNativeEl | CopyCustomComp = copies[child];
    // if type of found child is custom
    if (isCopyCustomComp(foundChild)) {
      // add the name of original component
      importCustom[foundChild.pointer] = true;
    } else { // if type of found child is native
      // add the type of native element
      const nativeImports: string[] = getNativeImports(foundChild, copies, originals);
      for (const nativeImport of nativeImports) {
        importNative[nativeImport] = true;
      }
    }
    returnedComponentCode += generateComponentCode(foundChild, originals, copies);
  }
  // generate all import statements
  let importStatements: string = '';
  importStatements += importReact(component);
  // get import statements for native components
  importStatements += addNativeImports(importNative);
  // get import statements for custom components
  for (const customComponent in importCustom) {
    importStatements += component.type === 'App' ? addCustomCompImport(customComponent, true) : addCustomCompImport(customComponent, false);
  }
  // generate all state code
  const stateVariables: string = addState(component.state);

  return `
      ${importStatements}
      const ${component.type === 'App' ? component.type : component.name} = () => {
        ${stateVariables}
        return (
          <View>
            ${returnedComponentCode}
          </View>
        );
      };\n
      ${addCustomCompExport(component.type === 'App' ? component.type : component.name)}
  `;
};

// const { format } = require('prettier');

const formatCode = (code: string) => {
  // return format(code, {
  //   parser: 'babel',
  //   jsxBracketSameLine: true,
  //   singleQuote: true
  // });
  return prettier.format(code, {
    parser: 'babel',
    plugins: prettierPlugins,
    jsxBracketSameLine: true,
    singleQuote: true
  });
}

export const formattedCompCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  return formatCode(generateCustomComponentCode(component, originals, copies));
}

// const TestComponent = formattedCompCode(originals['TestComponent'] as OrigCustomComp, originals, copies);
// console.log(TestComponent);
// const CoolComponent = formattedCompCode(originals['CoolComponent'] as OrigCustomComp, originals, copies);
// console.log(CoolComponent);
// const BruhComponent = formattedCompCode(originals['BruhComponent'] as OrigCustomComp, originals, copies);
// console.log(BruhComponent);
// const App = formattedCompCode(originals['App'] as AppInterface, originals, copies);
// console.log(App);
