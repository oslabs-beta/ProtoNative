import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import DropLayer from './DropLayer';
import {
  AppInterface,
  OrigCustomComp,
  Originals,
} from '../../utils/interfaces';

const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } =
    useContext(AppContext);

  const displayedComponent = originals[currentComponent] as
    | OrigCustomComp
    | AppInterface;

  const [counter, setCounter] = useState<number>(0);
  const [childElements, setChildElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const originalComponent = originals[currentComponent] as
      | OrigCustomComp
      | AppInterface;
    setChildElements(
      originalComponent.children.map((childName: string, index: number) => {
        if (currentComponent !== 'App' && currentComponent !== null) {
          return (
            <ElementBlock
              key={index + childName}
              componentName={childName}
              copies={copies}
              setCopies={setCopies}
              originals={originals}
              setOriginals={setOriginals}
              index={index}
              location={'details'}
              parent={currentComponent}
              setCounter={setCounter}
            />
          );
        }
      })
    );
  }, [currentComponent, counter, copies]);

  const dropLayerIndex: number = displayedComponent.children.length
    ? displayedComponent.children.length
    : 0;

  return (
    <div id='component-details-container'>
      <h2>
        Component Details:
        {currentComponent === 'App' ? '' : <span> {currentComponent}</span>}
      </h2>

      {currentComponent !== 'App' && (
        <div style={{ border: '1px solid black' }} id='component-box'>
          {childElements}
          {/* initial drop layer for bottom of component */}
          <DropLayer
            hasChildren={childElements.length}
            index={dropLayerIndex}
            setCounter={setCounter}
            parent={currentComponent}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
            elementLocation={'details'}
            area={'drop-layer-large'}
          />
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;
