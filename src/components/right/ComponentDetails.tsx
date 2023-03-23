import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from './ElementBlock'

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
  const { currentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
  const displayedComponent = originals[currentComponent];
  let childElements;
  if (currentComponent !== 'app' && currentComponent !== null) {
    childElements = displayedComponent.children.map(childName => ElementBlock(childName, copies, 'details'));
  }

  return (
    <div id='component-details-container'>
      <h2>Component Details</h2>
      
      <div style={{border: '1px solid black'}} id='component-box'>
        {currentComponent !== 'app' && <p>{currentComponent}</p>}
        {childElements}
      </div>

    </div>
  );
};

export default ComponentDetails;

