import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import DropLayer from '../right/DropLayer';
import TreeHierarchy from './TreeHierarchy';

import {
  AppInterface} from '../../utils/interfaces';


const AppCanvas = (): JSX.Element => {
  const { setCopies, setOriginals, originals, copies } = useContext(AppContext);
  const App = originals.App as AppInterface;
  const [appComponents, setAppComponents] = useState<JSX.Element[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [current, setCurrent] = useState<string>('app')

  useEffect(() => {
    setAppComponents(App.children.map((child: string, index: number) => {
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
            location={'app'}
            parent={'App'}
            setCounter={setCounter}
          />
        );
      }
    }));
  }, [counter, originals]);

  const dropLayerIndex: number = App.children.length ? App.children.length : 0;

  const handleClick = (button:string): void => {
    setCurrent(button)
  }

  const activeApp: string = current === 'app' ? 'tabs' : 'non-active tabs'
  const activeTree: string = current === 'tree' ? 'tabs' : 'non-active tabs'

  return (
    <div id='middle-container'>
      <div id='middle-button-container'>
        <button className={activeApp} onClick={()=>handleClick('app')}>App</button>
        <button className={activeTree} onClick={() => handleClick('tree')}>Tree</button>
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
        <div id='tree-container'>
          <TreeHierarchy />
        </div>

        }

      </div>
    </div>
  );
};

export default AppCanvas;
