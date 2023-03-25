import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';

const AppCanvas = () => {
  const {
    originals: { app },
    copies,
  } = useContext(AppContext);
  let appComponents = app.children.map((child, index) => {
    if (copies[child].type === 'custom') {
      return (
        <ElementBlock
          key={index}
          componentName={child}
          components={copies}
          index={index}
          moveItem={() => console.log('hi')}
          location={'app'}
        />
      );
    } else {
      return (
        <ElementBlock
          key={index}
          componentName={child}
          components={copies}
          index={index}
          moveItem={() => console.log('hi')}
          location={'details'}
        />
      );
    }
  });

  return (
    <div id='app-canvas'>
      <h1>My App</h1>
      <div id='phone-screen-container'>{appComponents}</div>
    </div>
  );
};

export default AppCanvas;
