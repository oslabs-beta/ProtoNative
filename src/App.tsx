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
} from './utils/interfaces';
import './styles/main.scss';

const App = () => {
  const [originals, setOriginals] = React.useState<Originals>({
    App: {
      type: 'App',
      // children: [],
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
    TouchableHighlight: {
      type: 'TouchableHighlight',
      index: 0,
    } as OrigNativeEl,
    TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
    StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
    ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
    // CoolComponent: {
    //   name: 'CoolComponent',
    //   type: 'custom',
    //   children: [],
    //   state: [],
    //   index: 1,
    //   copies: ['CoolComponent0'],
    // } as OrigCustomComp,
    // BruhComponent: {
    //   name: 'BruhComponent',
    //   type: 'custom',
    //   children: [],
    //   state: [],
    //   index: 1,
    //   copies: ['BruhComponent0'],
    // } as OrigCustomComp,
  });
  const [copies, setCopies] = React.useState<Copies>({
    // CoolComponent0: {
    //   name: 'CoolComponent0',
    //   type: 'custom',
    //   parent: { origin: 'original', key: 'App' },
    //   pointer: 'CoolComponent',
    // } as CopyCustomComp,
    // BruhComponent0: {
    //   name: 'BruhComponent0',
    //   type: 'custom',
    //   parent: { origin: 'original', key: 'App' },
    //   pointer: 'CoolComponent',
    // } as CopyCustomComp,
  });
  const [currentComponent, setCurrentComponent] = React.useState('App');

  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  // FIXME: Turn off strict mode when unnecesary
  return (
    <React.StrictMode>
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
        <div>
          <NavBar />
          <MainContainer />
        </div>
      </AppContext.Provider>
    </React.StrictMode>
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
