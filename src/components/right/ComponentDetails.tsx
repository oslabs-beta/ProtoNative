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

  const moveItem = (dragIndex: number, hoverIndex: number): void => {
    // console.log('drag', dragIndex, 'hover', hoverIndex);
    const item = displayedComponent.children[dragIndex];
    const copy = [...displayedComponent.children];
    copy.splice(dragIndex, 1);
    copy.splice(hoverIndex, 0, item);
    setOriginals((prevState: any) => {
      prevState[currentComponent].children = copy;
      console.log(prevState[currentComponent].children)
      return prevState;
    });
    setChildrenOfCurrent(copy);
  };


  useEffect(() => {
    setChildrenOfCurrent(originals[currentComponent].children)
    // console.log('children of current', originals[currentComponent].children)
    setChildElements(
      originals[currentComponent].children.map((childName: string, index: number) => {
        if (currentComponent !== 'App' && currentComponent !== null) {
          console.log('mapping', childName);
          return (
            <ElementBlock
              key={index}
              componentName={childName}
              components={copies}
              originals={originals}
              index={index}
              moveItem={moveItem}
              location={'details'}
            />
          );
        }
      })
    );
    // console.log(childrenOfCurrent);
  }, [currentComponent, childrenOfCurrent, originals]);

  return (
    <div id='component-details-container'>
      <h2>Component Details:  
        {currentComponent === 'App'
        ?''
        :<span> {currentComponent}</span>
        }
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
