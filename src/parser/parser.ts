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
    parent: { origin: 'original', key: 'GahlComponent' },
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
    parent: { origin: 'original', key: 'GahlComponent' },
    children: ['Button4'],
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
    children: [],
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
    children: ['Text0'],
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
  GahlComponent0: {
    name: 'GahlComponent0',
    type: 'custom',
    parent: { origin: 'original', key: 'CoolComponent' },
    pointer: 'GahlComponent',
  } as CopyCustomComp,
}

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
const importReact = (): string => `import React from 'react';\n`;

/**
 * @method isDoubleTagElement
 * @description - checks whether element is a double tag element (i.e. if it can have children)
 * @input - string of the name of element
 * @output - boolean -> true if element is a double tag element, false if not
 */
const isDoubleTagElement = (elementName: string): boolean => {
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
 * @description - checks whether of interface CopyCustomComp
 * @input - either CopyNativeEl or CopyCustomComp
 * @output - boolean -> true if input is of interface CopyCustomComp
 * (technically, output is a type guard)
 */
export const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
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
    stateVariables += `const [${stateVar}, set${capitalizeFirst(stateVar)}] = React.useState(null);\n`;
  }
  return stateVariables;
};

/**
 * @method getNativeImports
 * @description - recursively gathers all native core components to be imported starting at native element and going through its children
 * @input - native element of interface CopyNativeEl
 * @output - array of strings containing which native core components need to be imported
 */
const getNativeImports = (nativeElement: CopyNativeEl, copies: Copies): string[] => {
  const toImport: string[] = [];
  const allNativeImports = (nativeElement: CopyNativeEl): void => {
    if (nativeElement.children.length === 0) {
      toImport.push(nativeElement.type);
      return;
    }
    toImport.push(nativeElement.type);
    for (const child of nativeElement.children) {
      allNativeImports(copies[child] as CopyNativeEl);
    }
  }
  allNativeImports(nativeElement);
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
 * @input - string name of the custom component
 * @output - import statement for importing the custom component 
 */
const addCustomCompImport = (toImport: string): string => {
  return `import ${toImport} from './${toImport}';\n`;
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
export const generateCustomComponentCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  // store to save all native core components to be imported
  const importNative: {[key: string]: boolean} = {};
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
      const nativeImports: string[] = getNativeImports(foundChild, copies);
      for (const nativeImport of nativeImports) {
        importNative[nativeImport] = true;
      }
    }
    returnedComponentCode += generateComponentCode(foundChild, originals, copies);
  }
  // generate all import statements
  let importStatements: string = '';
  importStatements += importReact();
  // get import statements for native components
  importStatements += addNativeImports(importNative);
  // get import statements for custom components
  for (const customComponent in importCustom) {
    importStatements += addCustomCompImport(customComponent);
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

export const formatCode = (code: string) => {

  return prettier.format(code, {
    parser: 'babel',
    plugins: prettierPlugins,
    jsxBracketSameLine: true,
    singleQuote: true
  });
}

// const customComponent = generateCustomComponentCode(originals['TestComponent'] as OrigCustomComp, originals, copies);
// // console.log(customComponent);
// // console.log(formatCode(customComponent));
// const customComponent2 = generateCustomComponentCode(originals['CoolComponent'] as OrigCustomComp, originals, copies);
// console.log(customComponent2);
// console.log(formatCode(customComponent2));
// const customComponent3 = generateCustomComponentCode(originals['GahlComponent'] as OrigCustomComp, originals, copies);
// // console.log(customComponent3);
// console.log(formatCode(customComponent3));
// const customComponent4 = generateCustomComponentCode(originals['App'] as AppInterface, originals, copies);
// // console.log(customComponent4);
// console.log(formatCode(customComponent4));

// TODO: look into exporting app
// TODO: create files function
// TODO: look into how to export files and folders
