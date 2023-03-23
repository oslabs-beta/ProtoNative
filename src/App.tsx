import React from 'react';
import ReactDOM from 'react-dom';
import AppContext from './context/AppContext';
import MainContainer from './components/containers/MainContainer';
import NavBarContainer from './components/top/NavBarContainer';
import {
  NativeElements,
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  Parent,
  CopyNativeEl,
  CopyCustomComp
} from './parser/interfaces';

const App = () => {
  const [originals, setOriginals] = React.useState({
    app: { type: 'app', children: [], index: 0 },
    view: { type: 'view', children: [], index: 0 } as OrigNativeEl,
    button: { type: 'button', children: [], index: 0 },
    text: { type: 'text', children: [], index: 0 },
    image: { type: 'image', children: [], index: 0 },
    textInput: { type: 'textInput', children: [], index: 0 },
    scrollView: { type: 'scrollView', children: [], index: 0 },
    flatList: { type: 'flatList', children: [], index: 0 },
    sectionList: { type: 'sectionList', children: [], index: 0 },
    switch: { type: 'switch', children: [], index: 0 },
    touchableHighlight: { type: 'touchableHighlight', children: [], index: 0 },
    touchableOpacity: { type: 'touchableOpacity', children: [], index: 0 },
    statusBar: { type: 'statusBar', children: [], index: 0 },
    activityIndicator: { type: 'activityIndicator', children: [], index: 0 },
    testComponent: {
      type: 'custom',
      children: ['button1', 'view1'],
      state: [],
      index: 1,
      copies: ['testComponent0'],
    },
  });
  const [copies, setCopies] = React.useState({
    button0: {
      type: 'button',
      parent: { origin: 'original', key: 'testComponent' },
      children: [],
    },
    text0: {
      type: 'text',
      parent: { origin: 'copies', key: 'view1' },
      children: [],
    },
    view0: {
      type: 'view',
      parent: { origin: 'original', key: 'testComponent' },
      children: ['text1'],
    },
    testComponent0: {
      type: 'custom',
      parent: 'app',
      pointer: 'testComponent',
      children: function() {
        return originals[this.pointer].children;
      },
      state: function() {
        return originals[this.pointer].state;
      }
    },
  });
  const [currentComponent, setCurrentComponent] = React.useState(null);
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
        <NavBarContainer />
        <MainContainer />
      </div>
    </AppContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
