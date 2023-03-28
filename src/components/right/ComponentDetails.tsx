import React, { useContext, useState, useEffect, useRef } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import { AppInterface, OrigCustomComp, Originals } from '../../parser/interfaces';



const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } =
    useContext(AppContext);
  const displayedComponent = originals[currentComponent] as (OrigCustomComp | AppInterface);
  const [childrenOfCurrent, setChildrenOfCurrent] = useState([]);
  const [childElements, setChildElements] = useState([]);

  const moveItem = (dragIndex: number, hoverIndex: number): void => {
    // console.log('drag', dragIndex, 'hover', hoverIndex);
    const item: string = displayedComponent.children[dragIndex];
    const copy: string[] = [...displayedComponent.children];
    copy.splice(dragIndex, 1);
    copy.splice(hoverIndex, 0, item);
    setOriginals((prevState: Originals) => {
      const originalCustomElement = prevState[currentComponent] as OrigCustomComp;
      originalCustomElement.children = copy;
      console.log(originalCustomElement.children)
      return prevState;
    });
    setChildrenOfCurrent(copy);
  };


  useEffect(() => {
    const originalComponent = originals[currentComponent] as (OrigCustomComp | AppInterface);
    setChildrenOfCurrent(originalComponent.children)
    // console.log('children of current', originals[currentComponent].children)
    setChildElements(
      originalComponent.children.map((childName: string, index: number) => {
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
