import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import DropLayer from '../right/DropLayer';

import {
  AppInterface,
  Originals,
  OrigNativeEl,
  OrigCustomComp,
  CopyCustomComp,
  CopyNativeEl,
  Copies,
} from '../../parser/interfaces';

const AppCanvas = (): JSX.Element => {
  const { setCopies, setOriginals, originals, copies } = useContext(AppContext);
  const App = originals.App as AppInterface;
  const [appComponents, setAppComponents] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let appChildren: JSX.Element[] = App.children.map((child, index) => {
      if (copies[child].type === 'custom') {
        return (
          <ElementBlock
            key={index}
            componentName={child}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
            index={index}
            location={'app'}
            parent={'App'}
            setCounter={setCounter}
          />
        );
      } else {
        return (
          <ElementBlock
            key={index}
            componentName={child}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
            index={index}
            location={'details'}
            parent={'App'}
            setCounter={setCounter}
          />
        );
      }
    });
    setAppComponents(appChildren);
  }, [counter]);

  return (
    <div id='app-canvas'>
      <h1 id='app-canvas-title'>My App</h1>
      <div id='phone-screen-container'>
        {appComponents}
        {App.children.length === 0 && (
          <DropLayer
            hasChildren={App.children.length}
            index={0}
            setCounter={setCounter}
            parent={'App'}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
          />
        )}
      </div>
    </div>
  );
};

export default AppCanvas;
