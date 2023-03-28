import React from 'react';
import { createRoot } from 'react-dom/client';
import AppContext from './context/AppContext';
import MainContainer from './components/containers/MainContainer';
import NavBar from './components/top/NavBar';
import {
  Originals,
  Copies,
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  CopyNativeEl,
  CopyCustomComp,
} from './parser/interfaces';
import './styles/main.scss';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  const [originals, setOriginals] = React.useState<Originals>({
    App: {
      type: 'App',
      children: ['TestComponent0', 'View0', 'TestComponent1', 'TestComponent2'],
      state: [],
    } as AppInterface,
    View: { type: 'View', children: [], index: 2 } as OrigNativeEl,
    Button: { type: 'Button', children: [], index: 3 } as OrigNativeEl,
    Text: { type: 'Text', children: [], index: 1 } as OrigNativeEl,
    Image: { type: 'Image', children: [], index: 0 } as OrigNativeEl,
    TextInput: { type: 'TextInput', children: [], index: 0 } as OrigNativeEl,
    ScrollView: { type: 'ScrollView', children: [], index: 0 } as OrigNativeEl,
    FlatList: { type: 'FlatList', children: [], index: 0 } as OrigNativeEl,
    SectionList: {
      type: 'SectionList',
      children: [],
      index: 0,
    } as OrigNativeEl,
    Switch: { type: 'Switch', children: [], index: 0 } as OrigNativeEl,
    TouchableHighlight: {
      type: 'TouchableHighlight',
      children: [],
      index: 0,
    } as OrigNativeEl,
    TouchableOpacity: {
      type: 'TouchableOpacity',
      children: [],
      index: 0,
    } as OrigNativeEl,
    StatusBar: { type: 'StatusBar', children: [], index: 0 } as OrigNativeEl,
    ActivityIndicator: {
      type: 'ActivityIndicator',
      children: [],
      index: 0,
    } as OrigNativeEl,
    TestComponent: {
      name: 'TestComponent',
      type: 'custom',
      children: ['Button0', 'CoolComponent0', 'Text1'],
      state: [],
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
    } as OrigCustomComp,
  });
  const [copies, setCopies] = React.useState<Copies>({
    Button0: {
      name: 'Button0',
      type: 'Button',
      parent: { origin: 'copies', key: 'TestComponent' },
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
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      },
    } as CopyCustomComp,
    TestComponent1: {
      name: 'TestComponent1',
      type: 'custom',
      parent: { origin: 'original', key: 'App' },
      pointer: 'TestComponent',
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      },
    } as CopyCustomComp,
    TestComponent2: {
      name: 'TestComponent2',
      type: 'custom',
      parent: { origin: 'original', key: 'App' },
      pointer: 'TestComponent',
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      },
    } as CopyCustomComp,
    CoolComponent0: {
      name: 'CoolComponent0',
      type: 'custom',
      parent: { origin: 'original', key: 'TestComponent' },
      pointer: 'CoolComponent',
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      },
    } as CopyCustomComp,
    Text1: {
      name: 'Text1',
      type: 'Text',
      parent: { origin: 'copies', key: 'TestComponent' },
      children: [],
    } as CopyNativeEl,
  });
  const [currentComponent, setCurrentComponent] = React.useState('App');

  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  return (
    // <React.StrictMode>
    <AppContext.Provider
      value={{
        originals,
        setOriginals,
        copies,
        setCopies,
        currentComponent,
        setCurrentComponent,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div>
          <NavBar />
          <MainContainer />
        </div>
      </DndProvider>
    </AppContext.Provider>
    // </React.StrictMode>
  );
};

// use create root instead of render
createRoot(document.getElementById('root')).render(<App />);

{
  /* //    CoolerComponent0: {
                type: 'custom',
            parent: 'App',
            pointer: 'CoolerComponent',
            children: function() {
        return originals[this.pointer].children;
      },
            state: function() {
        return originals[this.pointer].state;
      }
    } as CopyCustomComp,
  });</AppContext.Provider> */
}
