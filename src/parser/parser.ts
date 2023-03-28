import {
  NativeElement,
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  Parent,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  Copies
} from './interfaces';

const { format } = require('prettier');

const originals: Originals = {
  App: { type: 'App', children: ['TestComponent0', 'View0', 'TestComponent1', 'TestComponent2'], state: [] } as AppInterface,
  View: { type: 'View', index: 2 } as OrigNativeEl,
  Button: { type: 'Button', index: 3 } as OrigNativeEl,
  Text: { type: 'Text', index: 1 } as OrigNativeEl,
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
  TestComponent: {
    name: 'TestComponent',
    type: 'custom',
    children: ['Button0', 'CoolComponent0'],
    state: ['state1', 'state2'],
    index: 3,
    copies: ['TestComponent0', 'TestComponent1', 'TestComponent2'],
  } as OrigCustomComp,
  CoolComponent: {
    name: 'CoolComponent',
    type: 'custom',
    children: ['Button2', 'View1'],
    state: [],
    index: 1,
    copies: ['CoolComponent0'],
  } as OrigCustomComp
};

const copies: Copies = {
  Button0: {
    name: 'Button0',
    type: 'Button',
    parent: { origin: 'original', key: 'TestComponent' },
    children: [],
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
    children: ['Button1', 'View1'],
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
};

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
    view: true,
    text: true,
    scrollView: true,
    touchableHighlight: true,
    touchableOpacity: true,
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
const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
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
const getNativeImports = (nativeElement: CopyNativeEl): string[] => {
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
const generateComponentCode = (comp: CopyNativeEl | CopyCustomComp): string => {
  const currElement: string = isCopyCustomComp(comp) ? comp.pointer : comp.type;
  const originalsComp = originals[comp.pointer] as OrigCustomComp;
  const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

  if (componentChildren.length === 0 || comp.type === 'custom') {
    return isDoubleTagElement(comp.name)
      ? `</${currElement}>`
      : `<${currElement}/>`;
  }

  let childrenNodes: string = '';
  for (const child of componentChildren) {
    childrenNodes += `${generateComponentCode(copies[child])}\n`;
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
const generateCustomComponentCode = (component: OrigCustomComp | AppInterface): string => {
  // store to save all native core components to be imported
  const importNative: {[key: string]: boolean} = {};
  // store to save all the custom components to be imported
  const importCustom: {[key: string]: boolean} = {};
  // returnedComponentCode will contain everything that goes into the return statement of component
  let returnedComponentCode: string = '';
  // const component: OrigCustomComp | OrigNativeEl| AppInterface = originals[componentName];
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
      const nativeImports: string[] = getNativeImports(foundChild);
      for (const nativeImport of nativeImports) {
        importNative[nativeImport] = true;
      }
    }
    returnedComponentCode += generateComponentCode(foundChild);
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
          <div>
            ${returnedComponentCode}
          </div>
        );
      };\n      
      ${addCustomCompExport(component.type === 'App' ? component.type : component.name)}
  `;
};

const formatCode = (code: string): string => {
  return format(code, {
    parser: 'babel',
    jsxBracketSameLine: true,
    singleQuote: true
  });
}

const customComponent = generateCustomComponentCode(originals['TestComponent'] as OrigCustomComp);
// console.log(customComponent);
console.log(formatCode(customComponent));
const customComponent2 = generateCustomComponentCode(originals['CoolComponent'] as OrigCustomComp);
// console.log(customComponent2);
console.log(formatCode(customComponent2));
const customComponent3 = generateCustomComponentCode(originals['App'] as AppInterface);
// console.log(customComponent3);
console.log(formatCode(customComponent3));

/*
  --- view: <View> </View>
  button: <Button />
  --- text: <Text> </Text>
  image: <Image />
  textInput: <TextInput />
  --- scrollView: <ScrollView> </ScrollView>
  flatList: <FlatList />
  sectionList: <SectionList />
  switch: <Switch />
  --- touchableHighlight: <TouchableHighlight> </TouchableHighlight>
  --- touchableOpacity: <TouchableOpacity> </TouchableOpacity>
  statusBar: <StatusBar />
  activityIndicator: <ActivityIndicator />
*/

/*
---OUTPUT FOR TEST COMPONENT---

import React from 'react';
import { Button, View, Text } from 'react-native';
import coolComponent from './coolComponent';

const testComponent = () => {
  const [testState, setTestState] = React.useState(null);

  return (
    <div>
      <Button />
      <View>
        <Text>
          <Button />
        </Text>
      </View>
      <CoolComponent />
    </div>
  );
};

export default testComponent;
*/

/*
1. import statments
2. state variables
3. return statement
  1. button - no children, append text for button, move to next child
  2. view - children, go to its children
  3. coolcomponent - no children, append text
4. wrap 2-3 in function
*/