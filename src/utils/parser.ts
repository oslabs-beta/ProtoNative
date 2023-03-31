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

// const originals: Originals = {
//   App: {
//     type: 'App',
//     children: ['A0'],
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
//   A: {
//     name: 'A',
//     type: 'custom',
//     children: ['View0'],
//     state: [],
//     index: 0,
//     copies: [],
//   } as OrigCustomComp,
//   B: {
//     name: 'B',
//     type: 'custom',
//     children: ['View1'],
//     state: [],
//     index: 1,
//     copies: ['B0'],
//   } as OrigCustomComp,
//   C: {
//     name: 'C',
//     type: 'custom',
//     children: [],
//     state: [],
//     index: 1,
//     copies: ['C0'],
//   } as OrigCustomComp
// };

// const copies: Copies = {
//   View0: {
//     name: 'View0',
//     type: 'View',
//     parent: { origin: 'original', key: 'A' },
//     children: ['B0'],
//   } as CopyNativeEl,
//   View1: {
//     name: 'View1',
//     type: 'View',
//     parent: { origin: 'original', key: 'B' },
//     children: ['C0'],
//   } as CopyNativeEl,
//   B0: {
//     name: 'B0',
//     type: 'custom',
//     parent: { origin: 'copies', key: 'View0' },
//     pointer: 'B',
//   } as CopyCustomComp,
//   C0: {
//     name: 'C0',
//     type: 'custom',
//     parent: { origin: 'copies', key: 'View1' },
//     pointer: 'C',
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
 * @description - returns the main react import statement, with hooks if the component uses them
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
 * (technically, output is a type guard -> lets typescript know that if this function returns true, the element passed in is of interface CopyCustomComp)
 */
export const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method isOrigCustomComp
 * @description - checks whether comp is of interface OrigCustomComp
 * @input - either OrigCustomComp or OrigNativeEl or AppInterface (anything in originals)
 * @output - boolean -> true if input is of interface OrigCustomComp
 * (technically, output is a type guard -> lets typescript know that if this function returns true, the element passed in is of interface OrigCustomComp)
 */
export const isOrigCustomComp = (comp: OrigCustomComp | OrigNativeEl | AppInterface): comp is OrigCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method addState
 * @description - generates the strings for state variables
 * @input - array of the names of the state variables as strings
 * @output - all declarations for state variables
 */
const addState = (stateNames: string[]): string => {
  let stateVariables: string = '';
  for (const stateVar of stateNames) {
    stateVariables += `const [${stateVar}, set${capitalizeFirst(stateVar)}] = useState(null);\n`;
  }
  return stateVariables;
};

/**
 * @method getAllImports
 * @description recursively gathers all possible imports starting at the component (in copies context) and recursively visiting it's descendants 
 * @input component of interface CopyNativeEl or CopyCustomComp (in case custom components are wrapped inside native elements)
 * @output array of strings containing all possible imports for the component 
 */
const getAllImports = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies): string[] => {
  const toImport: string[] = [];
  const allImports = (currComp: CopyNativeEl | CopyCustomComp): void => {
    console.log('currComp:', currComp.name);
    const originalComp = originals[currComp.pointer] as OrigCustomComp;
    const compChildren: string[] = isCopyCustomComp(currComp) ? originalComp.children : currComp.children;
    if (compChildren.length === 0 || comp.type === 'custom') {
      // TODO: FIX THIS
      isCopyCustomComp(currComp) ? toImport.push(currComp.pointer) : toImport.push(currComp.type);
      // if (!isCopyCustomComp) {
      //   toImport.push(currComp.type);
      // }
      return;
    }
    isCopyCustomComp(currComp) ? toImport.push(currComp.pointer) : toImport.push(currComp.type);
    for (const child of compChildren) {
      allImports(copies[child]);
    }
    console.log('toImport:', toImport);
    console.log('--------------------');
  }
  allImports(comp);
  return toImport;
}

/**
 * @method addNativeImports
 * @description generates the import statement for importing react native core components
 * @input array containing the native core components to be imported as strings
 * @output import statement for importing the native core components passed in 
 */
const addNativeImports = (toImport: string[]): string => {
  let componentsToImport: string = '';
  for (const nativeElement of toImport) {
    componentsToImport += `${nativeElement},`;
  }
  // take off last comma
  return `import { ${componentsToImport.slice(0, -1)} } from 'react-native';\n`;
};

/**
 * @method addCustomCompImport
 * @description generates the import statement for importing custom components
 * @input name of the custom component as string, boolean to check whether the current component in generateCustomComponentCode is App
 * @output import statement for importing the custom component 
 */
const addCustomCompImport = (toImport: string, isCompApp: boolean): string => {
  return `import ${toImport} from '.${isCompApp ? '/Components' : ''}/${toImport}';\n`;
};

/**
 * @method addCustomCompExport
 * @description generates the export statement for exporting custom components
 * @input name of the custom component as string
 * @output export statement for exporting the custom component 
 */
const addCustomCompExport = (toExport: string): string => {
  return `export default ${toExport};\n`;
};

// /**
//  * @method generateComponentCode
//  * @description generates the necessary code for a custom component or native core component in copies context, recursively goes through its children
//  * @input component of interface CopyNativeEl or CopyCustomComp (any component in copies context)
//  * @output string of the code necessary for the component passed in
//  */
// const generateComponentCode = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies): string => {
//   const currElement: string = isCopyCustomComp(comp) ? comp.pointer : comp.type;
//   const originalsComp = originals[comp.pointer] as OrigCustomComp;
//   const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

//   if (componentChildren.length === 0 || comp.type === 'custom') {
//     return isDoubleTagElement(currElement)
//       ? `<${currElement}>
//          </${currElement}>`
//       : `<${currElement}/>`;
//   }

//   let childrenNodes: string = '';
//   for (const child of componentChildren) {
//     childrenNodes += `${generateComponentCode(copies[child], originals, copies)}\n`;
//   }
//   return  `<${currElement}> 
//               ${childrenNodes} 
//           </${currElement}>`;
// };

type CompCode = {
  JSXcode: string,
  allToImport: string[]
}

/**
 * @method generateComponentCode
 * @description generates the necessary code for a custom component or native core component in copies context, recursively goes through its children
 * @input component of interface CopyNativeEl or CopyCustomComp (any component in copies context)
 * @output string of the code necessary for the component passed in
 */
const generateComponentCode = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies): CompCode => {
  // const allCompCode: CompCode = {JSXcode: '', allImports: []}
  // const JSXcode: string = '';
  const toImport: string[] = [];

  const getCompCode = (comp: CopyNativeEl | CopyCustomComp) => {
    const currElement: string = isCopyCustomComp(comp) ? comp.pointer : comp.type;
    const originalsComp = originals[comp.pointer] as OrigCustomComp;
    const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

    if (componentChildren.length === 0 || comp.type === 'custom') {
      isCopyCustomComp(comp) ? toImport.push(comp.pointer) : toImport.push(comp.type);
      return isDoubleTagElement(currElement)
        ? `<${currElement}>
          </${currElement}>`
        : `<${currElement}/>`;
    }

    let childrenNodes: string = '';
    for (const child of componentChildren) {
      const childInCopies = copies[child];
      isCopyCustomComp(childInCopies) ? toImport.push(childInCopies.pointer) : toImport.push(childInCopies.type);
      childrenNodes += `${getCompCode(childInCopies)}\n`;
    }
    return  `<${currElement}> 
                ${childrenNodes} 
          </${currElement}>`;
  }

  return {JSXcode: getCompCode(comp), allToImport: toImport};
};

/**
 * @method generateCustomComponentCode
 * @description generates all necessary code for a custom component in originals context
 * @input the custom component to generate the code for
 * @output string of the code necessary for the custom component passed in
 */
const generateCustomComponentCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  // store to save all react native core components and custom components to be imported
  // always import View 
  const allImports: Set<string> = new Set(['View']);
  // returnedComponentCode will contain everything that goes into the return statement of component
  let returnedComponentCode: string = '';
  // generate code for JSX element in return statement
  // get all native/ custom components we need
  for (const child of component.children) {
    // find the child in copies context
    const foundChild: CopyNativeEl | CopyCustomComp = copies[child];
    // // get all possible react native core components and custom components to import
    // const allCompToImport: string[] = getAllImports(foundChild, originals, copies);
    // for (const compToImport of allCompToImport) {
    //   // since allImports is a set, duplicates will be ignored
    //   allImports.add(compToImport);
    // }
    // // generate all code for the JSX element that will be returned
    // returnedComponentCode += generateComponentCode(foundChild, originals, copies);
    const { JSXcode, allToImport } = generateComponentCode(foundChild, originals, copies);
    returnedComponentCode += JSXcode;
    for (const compToImport of allToImport) {
      allImports.add(compToImport);
    }
  }
  // generate all import statements
  let importStatements: string = '';
  // import react and all hooks necessary
  importStatements += importReact(component);

  // loop through all imports and determine which imports are react native and which imports and custom components and save them separately
  const allNativeImports: string[] = [];
  let allCustomImports: string = '';
  console.log('ALL IMPORTS', allImports.values());
  for (const toImport of allImports.values()) {
    if (isOrigCustomComp(originals[toImport])) {
      allCustomImports += component.type === 'App' ? addCustomCompImport(toImport, true) : addCustomCompImport(toImport, false)
    } else {
      allNativeImports.push(toImport);
    }
  }
  // add all react native imports
  importStatements += addNativeImports(allNativeImports);
  // add all custom component imports
  importStatements += allCustomImports;
  // generate all state variables
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

// const A = formattedCompCode(originals['A'] as OrigCustomComp, originals, copies);
// console.log(A);
// const B = formattedCompCode(originals['B'] as OrigCustomComp, originals, copies);
// console.log(B);
// const C = formattedCompCode(originals['C'] as OrigCustomComp, originals, copies);
// console.log(C);


// TODO: add children, state for each node in tree