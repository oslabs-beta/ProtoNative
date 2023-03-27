import React, { useContext, useState, useEffect, useRef } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import { useDrop } from 'react-dnd';

const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
  const [displayedComponent, setDisplayedComponent] = useState(originals[currentComponent]);
  const [childrenOfCurrent, setChildrenOfCurrent] = useState(displayedComponent.children);

  useEffect(() => {
    setDisplayedComponent(originals[currentComponent]);
    setChildrenOfCurrent(originals[currentComponent].children);
  }, [currentComponent]);

  const moveItem = (dragIndex: number, hoverIndex: number): void => {
    console.log('drag', dragIndex, 'hover', hoverIndex);
    const item = displayedComponent.children[dragIndex];
    const copy = [...displayedComponent.children];
    copy.splice(dragIndex, 1);
    copy.splice(hoverIndex, 0, item);
    setOriginals((prevState: any) => {
      prevState[currentComponent].children = copy;
      return prevState;
    });
    setChildrenOfCurrent(copy);
    const newElements = copy.map((childName: string, index: number) => {
      if (currentComponent !== 'App' && currentComponent !== null) {
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
    });
    setChildElements(newElements);
  };

  const [childElements, setChildElements] = useState([]);

  useEffect(() => {
    setChildElements(
      originals[currentComponent].children.map((childName: string, index: number) => {
        if (currentComponent !== 'App' && currentComponent !== null) {
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
    console.log(childrenOfCurrent);
  }, [childrenOfCurrent, currentComponent, copies]);

  return (
    <div id='component-details-container'>
      <h2>Component Details</h2>

      {currentComponent !== 'App' && currentComponent && (
        <div style={{ border: '1px solid black' }} id='component-box'>
          <p>{currentComponent}</p>
          {childElements}
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;
