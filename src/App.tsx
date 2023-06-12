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
} from './utils/interfaces';
import './styles/main.scss';

const App = () => {
  // the originals state is where we store original React Native elements and custom components created by the user
  const [originals, setOriginals] = React.useState<Originals>({
    App: { type: 'App', children: [], state: [] } as AppInterface,
    View: { type: 'View', index: 0 } as OrigNativeEl,
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
  });

  // the copies state is where we store copies of originals when they are placed on the canvas
  const [copies, setCopies] = React.useState<Copies>({});

  // where we store the current component being rendered in ComponentDetails (App displays nothing)
  const [currentComponent, setCurrentComponent] = React.useState('App');

  return (
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
  );
};

createRoot(document.getElementById('root')).render(<App />);
