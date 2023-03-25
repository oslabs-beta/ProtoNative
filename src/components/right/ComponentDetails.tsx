import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock';
import { useDrop } from 'react-dnd';

// testComponent: {
//   type: 'custom',
//   children: ['button1', 'view1'],
//   state: [],
//   index: 1,
//   copies: ['testComponent0'],
// },

// view0: {
//   type: 'view',
//   parent: { origin: 'original', key: 'testComponent' },
//   children: ['text1'],
// },

const ComponentDetails = (): JSX.Element => {
  const { currentComponent, originals, setOriginals, copies, setCopies } =
    useContext(AppContext);
  const displayedComponent = originals[currentComponent];
  const [childrenOfCurrent, setChildrenOfCurrent] = useState(
    displayedComponent.children
  );

  const moveItem = (dragIndex, hoverIndex) => {
    const item = displayedComponent.children[dragIndex];
    const copy = [...displayedComponent.children];
    copy.splice(dragIndex, 1);
    copy.splice(hoverIndex, 0, item);
    setOriginals((prevState) => {
      let newPrevState = { ...prevState };
      newPrevState[currentComponent].children = copy;
      return newPrevState;
    });
    setChildrenOfCurrent(copy);
    setChildElements((prev) => {
      console.log(copy);
      return copy.map((childName: string, index: number) => {
        if (currentComponent !== 'app' && currentComponent !== null) {
          return ElementBlock(childName, copies, index, moveItem, 'details');
        }
      });
    });
  };

  const [childElements, setChildElements] = useState(
    displayedComponent.children.map((childName: string, index: number) => {
      if (currentComponent !== 'app' && currentComponent !== null) {
        return ElementBlock(childName, copies, index, moveItem, 'details');
      }
    })
  );

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'element',
  //   drop: (item: {}, monitor) => onDrop(item, monitor), //function to drop and change state
  //   collect: (monitor) => ({
  //     //boolean to see if component is being dropped)
  //     isOver: monitor.isOver(),
  //   }),
  // }));

  // useEffect(() => {
  //   console.log(childrenOfCurrent);
  // }, [childrenOfCurrent]);

  return (
    <div id='component-details-container'>
      <h2>Component Details</h2>

      {currentComponent !== 'app' && currentComponent && (
        <div
          style={{ border: '1px solid black' }}
          id='component-box'
          // ref={drop}
        >
          <p>{currentComponent}</p>
          {childElements}
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;
