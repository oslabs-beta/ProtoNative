import {
  NativeElement,
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  Parent,
  CopyNativeEl,
  CopyCustomComp,
} from './interfaces';

const originals = {
  app: {
    type: 'app',
    children: ['testComponent0', 'coolComponent0', 'view0'],
    state: [],
  } as AppInterface,
  view: { type: 'view', children: [], index: 0 } as OrigNativeEl,
  button: { type: 'button', children: [], index: 0 } as OrigNativeEl,
  text: { type: 'text', children: [], index: 0 } as OrigNativeEl,
  image: { type: 'image', children: [], index: 0 } as OrigNativeEl,
  textInput: { type: 'textInput', children: [], index: 0 } as OrigNativeEl,
  scrollView: { type: 'scrollView', children: [], index: 0 } as OrigNativeEl,
  flatList: { type: 'flatList', children: [], index: 0 } as OrigNativeEl,
  sectionList: { type: 'sectionList', children: [], index: 0 } as OrigNativeEl,
  switch: { type: 'switch', children: [], index: 0 } as OrigNativeEl,
  touchableHighlight: {
    type: 'touchableHighlight',
    children: [],
    index: 0,
  } as OrigNativeEl,
  touchableOpacity: {
    type: 'touchableOpacity',
    children: [],
    index: 0,
  } as OrigNativeEl,
  statusBar: { type: 'statusBar', children: [], index: 0 } as OrigNativeEl,
  activityIndicator: {
    type: 'activityIndicator',
    children: [],
    index: 0,
  } as OrigNativeEl,
  testComponent: {
    name: 'testComponent',
    type: 'custom',
    children: ['button0', 'view0', 'coolComponent0'],
    state: ['testState'],
    index: 1,
    copies: ['testComponent0'],
  } as OrigCustomComp,
  coolComponent: {
    name: 'coolComponent',
    type: 'custom',
    children: ['button2', 'view1'],
    state: [],
    index: 1,
    copies: ['testComponent0'],
  } as OrigCustomComp,
};

const copies = {
  button0: {
    name: 'button0',
    type: 'button',
    parent: { origin: 'original', key: 'testComponent' },
    children: [],
  } as CopyNativeEl,
  text0: {
    name: 'text0',
    type: 'text',
    parent: { origin: 'copies', key: 'view0' },
    children: ['button1'],
  } as CopyNativeEl,
  view0: {
    name: 'view0',
    type: 'view',
    parent: { origin: 'original', key: 'testComponent' },
    children: ['text0'],
  } as CopyNativeEl,
  button1: {
    name: 'button1',
    type: 'button',
    parent: { origin: 'original', key: 'text0' },
    children: [],
  } as CopyNativeEl,
  view1: {
    name: 'view1',
    type: 'view',
    parent: { origin: 'original', key: 'coolComponent' },
    children: ['text0'],
  } as CopyNativeEl,
  button2: {
    name: 'button2',
    type: 'button',
    parent: { origin: 'original', key: 'coolComponent' },
    children: [],
  } as CopyNativeEl,
  testComponent0: {
    name: 'testComponent0',
    type: 'custom',
    parent: 'app',
    pointer: 'testComponent',
    children: function () {
      return originals[this.pointer].children;
    },
    state: function () {
      return originals[this.pointer].state;
    },
  } as CopyCustomComp,
  coolComponent0: {
    name: 'coolComponent0',
    type: 'custom',
    parent: 'app',
    pointer: 'coolComponent',
    children: function () {
      return originals[this.pointer].children;
    },
    state: function () {
      return originals[this.pointer].state;
    },
  } as CopyCustomComp,
};

const capitalizeFirst = (str: string): string => {
  if (str.length === 0) return '';
  return str[0].toUpperCase() + str.slice(1);
};

const addIndent = (spacing: number = 2): string => {
  let indent = '';
  for (let i = 0; i < spacing; i++) indent += ' ';
  return indent;
};

const importReact = (): string => `import React from 'react';\n`;

const isDoubleTagElement = (elementName: string): boolean => {
  const DOUBLE_TAG_ELEMENTS = {
    view: true,
    text: true,
    scrollView: true,
    touchableHighlight: true,
    touchableOpacity: true,
  };
  return DOUBLE_TAG_ELEMENTS[elementName] !== undefined;
};

const addState = (stateNames: string[]): string => {
  let stateVariables = '';
  for (const stateVar of stateNames) {
    stateVariables += `const [${stateVar}, set${capitalizeFirst(
      stateVar
    )}] = React.useState(null);\n`;
  }
  return stateVariables;
};

const getNativeImports = (nativeElement: CopyNativeEl): string[] => {
  const toImport: string[] = [];
  const allNativeImports = (nativeElement: CopyNativeEl): void => {
    if (nativeElement.children.length === 0) {
      toImport.push(nativeElement.type);
      return;
    }
    toImport.push(nativeElement.type);
    for (const child of nativeElement.children) {
      allNativeImports(copies[child]);
    }
  }
  allNativeImports(nativeElement);
  return toImport;
}

const addNativeImports = (toImport: {}): string => {
  console.log('NATIVE', toImport);
  let componentsToImport = '';
  // toImport.forEach(nativeEl => {
  //   // componentsToImport += `${capitalizeFirst(nativeEl)}, `;
  //   console.log('NATIVE EL',nativeEl, typeof nativeEl);
  // })
  for (const nativeElement in toImport) {
    componentsToImport += `${capitalizeFirst(nativeElement)}, `;
  }
  // take off last comma
  componentsToImport = componentsToImport.substring(
    0,
    componentsToImport.length - 1
  );
  return `import { ${componentsToImport} } from 'react-native';\n`;
};

const addCustomCompImport = (toImport: string): string => {
  return `import ${toImport} from './${toImport}';\n`;
};

const generateNativeElementCode = (nativeElement): string => {
  if (nativeElement.children.length === 0) {
    return isDoubleTagElement(nativeElement.name)
      ? `</${capitalizeFirst(nativeElement.type)}>\n`
      : `<${capitalizeFirst(nativeElement.type)}/>\n`;
  }

  let childrenNodes = '';
  for (const child of nativeElement.children) {
    childrenNodes += `${generateNativeElementCode(copies[child])}\n`;
  }
  const capitalizedType = capitalizeFirst(nativeElement.type);
  return  `<${capitalizedType}> 
              ${childrenNodes} 
          </${capitalizedType}>\n`;
};

const generateCustomComponentCode = (componentName: string): string => {
  const importNative: {} = {}; // [button, view]
  const importCustom: {} = {}; // [custom]
  let returnedComponent: string = '';
  const component: OrigCustomComp = originals[componentName];
  // const componentChildren: string[] = component.children;
  
  // generate stuff in return statement
  // keep track of what native/ custom components we need
  for (const child of component.children) {
    // find the child in copies context
    const foundChild = copies[child];
    // console.log('CHILD: ', foundChild);
    // if type of found child is custom
    if (foundChild.type === 'custom') {
      // add the name of original component
      importCustom[foundChild.pointer] = true;
    } else { // if type of found child is native
      // add the type of native element
      // importNative[foundChild.type] = true;
      const nativeImports: string[] = getNativeImports(foundChild);
      console.log('IMPORTS', nativeImports);
      for (const nativeImport of nativeImports) {
        importNative[nativeImport] = true;
      }
    }
    // TODO: make this work for regular CopyNativeEl and CopyCustomComp
    returnedComponent += generateNativeElementCode(foundChild);
  }
  // generate all import statements
  let importStatements: string = '';
  importStatements += importReact();
  // get import statements for native components
  importStatements += addNativeImports(importNative);
  console.log('IMPORT STATEMENTS', importStatements);
  // get import statements for custom components
  for (const customComponent in importCustom) {
    importStatements += addCustomCompImport(customComponent);
  }
  // generate all state code
  const stateVariables: string = addState(component.state);

  return `
      ${importStatements}
      const ${component.name} = () => {
        ${stateVariables}
        return (
          <div>
            ${returnedComponent}
          </div>
        );
      };
  `;
};

console.log(generateCustomComponentCode('testComponent'));

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