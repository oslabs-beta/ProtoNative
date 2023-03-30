import React, { useContext, useState, useEffect, useRef } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import DropLayer from './DropLayer';
import {
  AppInterface,
  OrigCustomComp,
  Originals,
} from '../../parser/interfaces';

const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } =
    useContext(AppContext);
  const displayedComponent = originals[currentComponent] as
    | OrigCustomComp
    | AppInterface;
  const [counter, setCounter] = useState(0);
  const [childElements, setChildElements] = useState([]);

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
  }, [currentComponent, counter]);

  return (
    <div id='component-details-container'>
      <h2>
        Component Details:
        {currentComponent === 'App' ? '' : <span> {currentComponent}</span>}
      </h2>

      {currentComponent !== 'App' && currentComponent && (
        <div style={{ border: '1px solid black' }} id='component-box'>
          {childElements.length === 0 && (
            <DropLayer
              hasChildren={childElements.length}
              index={0}
              setCounter={setCounter}
              parent={currentComponent}
              copies={copies}
              setCopies={setCopies}
              originals={originals}
              setOriginals={setOriginals}
            />
          )}
          {childElements}
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;
