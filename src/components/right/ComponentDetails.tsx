import React, { useContext, useState, useEffect, useRef } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import { OrigCustomComp } from '../../parser/interfaces';

const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } =
    useContext(AppContext);
  const displayedComponent = originals[currentComponent];
  const [childrenOfCurrent, setChildrenOfCurrent] = useState([]);
  const [childElements, setChildElements] = useState([]);

  useEffect(() => {
    setChildrenOfCurrent(originals[currentComponent].children);
    setChildElements(
      originals[currentComponent].children.map(
        (childName: string, index: number) => {
          if (currentComponent !== 'App' && currentComponent !== null) {
            return (
              <ElementBlock
                key={index + childName}
                componentName={childName}
                index={index}
                setChildrenOfCurrent={setChildrenOfCurrent}
                location={'details'}
                parent={currentComponent}
                topLevel={true}
              />
            );
          }
        }
      )
    );
  }, [currentComponent, childrenOfCurrent, copies]);

  return (
    <div id='component-details-container'>
      <h2>
        Component Details:
        {currentComponent === 'App' ? '' : <span> {currentComponent}</span>}
      </h2>

      {currentComponent !== 'App' && currentComponent && (
        <div style={{ border: '1px solid black' }} id='component-box'>
          {childElements}
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;
