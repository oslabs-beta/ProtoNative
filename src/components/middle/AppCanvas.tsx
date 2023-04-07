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
} from '../../utils/interfaces';

const AppCanvas = (): JSX.Element => {
  const { setCopies, setOriginals, originals, copies } = useContext(AppContext);
  const App = originals.App as AppInterface;
  const [appComponents, setAppComponents] = useState([]);
  const [counter, setCounter] = useState(0);
  const [current, setCurrent] = useState('app')

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
            location={'app'} //changed from details
            parent={'App'}
            setCounter={setCounter}
          />
        );
      }
    });
    setAppComponents(appChildren);
  }, [counter, originals]);

  const dropLayerIndex = App.children.length ? App.children.length : 0;

  const handleClick = (button:string) => {
    setCurrent(button)
  }

  return (
    <div id='middle-container'>
      <div id='middle-button-container'>
        <button onClick={()=>handleClick('app')}>App</button>
        <button className='non-active' onClick={() => handleClick('tree')}>Tree</button>
      </div>


      <div id='app-canvas'>
        {current==='app'
        ? 
        <div id='app-canvas-container'>
          <h1 id='app-canvas-title'>My App</h1>
          <div id='phone-screen-container'>
            {appComponents}
            {/* initial drop layer for bottom of app */}
            <DropLayer
              index={dropLayerIndex}
              setCounter={setCounter}
              parent={'App'}
              copies={copies}
              setCopies={setCopies}
              originals={originals}
              setOriginals={setOriginals}
              elementLocation={'app'}
              area={'drop-layer-large'}
            />
          </div>
        </div>
        :
        <div>
          
        </div>

        }

      </div>
    </div>
  );
};

export default AppCanvas;
