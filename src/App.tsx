import React from 'react';
import ReactDOM from 'react-dom';
import AppContext from './context/AppContext';
import MainContainer from './components/containers/MainContainer';
import NavBar from './components/top/NavBar';
import {
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  CopyNativeEl,
  CopyCustomComp
} from './parser/interfaces';
import './styles/main.scss'

const App = () => {
  const [originals, setOriginals] = React.useState({
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
      children: ['button0'],
      state: [],
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
  });
  const [copies, setCopies] = React.useState({
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
      parent: { origin: 'original', key: 'app' },
      children: ['text0'],
    } as CopyNativeEl,
    button1: {
      name: 'button1',
      type: 'button',
      parent: { origin: 'copies', key: 'text0' },
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
      parent: { origin: 'original', key: 'app' },
      pointer: 'testComponent',
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      }
    } as CopyCustomComp,
    coolComponent0: {
      name: 'coolComponent0',
      type: 'custom',
      parent: { origin: 'original', key: 'app' },
      pointer: 'coolComponent',
      children: function () {
        return originals[this.pointer].children;
      },
      state: function () {
        return originals[this.pointer].state;
      }
    } as CopyCustomComp,
  });
  const [currentComponent, setCurrentComponent] = React.useState('testComponent');
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
        <NavBar/>
        <MainContainer />
      </div>
      </AppContext.Provider>
      );
    };

      ReactDOM.render(<App />, document.getElementById('root'));

      {/* //    coolerComponent0: {
                type: 'custom',
            parent: 'app',
            pointer: 'coolerComponent',
            children: function() {
        return originals[this.pointer].children;
      },
            state: function() {
        return originals[this.pointer].state;
      }
    } as CopyCustomComp,
  });</AppContext.Provider> */}
