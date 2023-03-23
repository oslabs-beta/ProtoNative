import {
  NativeElement,
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  Parent,
  CopyNativeEl,
  CopyCustomComp,
  DoubleTagElement
} from './interfaces';

const originals = {
  app: { type: 'app', children: ['testComponent0', 'coolComponent0', 'view0'], state: [] } as AppInterface,
  view: { type: 'view', children: [], index: 0 } as OrigNativeEl,
  button: { type: 'button', children: [], index: 0 } as OrigNativeEl,
  text: { type: 'text', children: [], index: 0 } as OrigNativeEl,
  image: { type: 'image', children: [], index: 0 } as OrigNativeEl,
  textInput: { type: 'textInput', children: [], index: 0 } as OrigNativeEl,
  scrollView: { type: 'scrollView', children: [], index: 0 } as OrigNativeEl,
  flatList: { type: 'flatList', children: [], index: 0 } as OrigNativeEl,
  sectionList: { type: 'sectionList', children: [], index: 0 } as OrigNativeEl,
  switch: { type: 'switch', children: [], index: 0 } as OrigNativeEl,
  touchableHighlight: { type: 'touchableHighlight', children: [], index: 0 } as OrigNativeEl,
  touchableOpacity: { type: 'touchableOpacity', children: [], index: 0 } as OrigNativeEl,
  statusBar: { type: 'statusBar', children: [], index: 0 } as OrigNativeEl,
  activityIndicator: { type: 'activityIndicator', children: [], index: 0 } as OrigNativeEl,
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
  } as OrigCustomComp
}

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
    children: function() {
      return originals[this.pointer].children;
    },
    state: function() {
      return originals[this.pointer].state;
    }
  } as CopyCustomComp,
  coolComponent0: {
    name: 'coolComponent0',
    type: 'custom',
    parent: 'app',
    pointer: 'coolComponent',
    children: function() {
      return originals[this.pointer].children;
    },
    state: function() {
      return originals[this.pointer].state;
    }
  } as CopyCustomComp,
}

console.log(copies.testComponent0.children());

/*
  --- view: <View> </View>
  button: <Button />
  text: <Text />
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
import coolComponent from './components/coolComponent';

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
    </div>
  )
};
*/

/*
1. import statments
2. state variables
3. return statement
  -> div, button, view, text, button
4. wrap 2-3 in function
*/

const addIndent = (spacing: number = 2):string => {
  let indent = '';
  for (let i = 0; i < spacing; i++) indent += ' ';
  return indent;
}

const addNewLine = ():string => '\n';
const importReact = ():string => `import React from 'react';`;
const addImportStatement = ():string => {

  return '';
}

// note: technically passing element name, but keeping argument as element for now for readability
const isDoubleTagElement = (element: string): element is DoubleTagElement => {
  if (element as DoubleTagElement) {
    return true;
  }
  return false;
}

const generateCustomComponentCode = (componentName: string):string => {
  let importStatements = '';
  const component: OrigCustomComp = originals[componentName];
  const componentChildren: string[] =  component.children;
  const componentState: string[] = component.state;
  return '';
}