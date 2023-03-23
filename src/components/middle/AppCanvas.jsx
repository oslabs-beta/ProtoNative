import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';

const AppCanvas = () => {
  const {
    originals: { app },
    copies,
  } = useContext(AppContext);
  let appComponents = app.children.map((child) => ElementBlock(child, copies));

  return (
    <div id='app-canvas'>
      <div id='phone-screen-container'>{appComponents}</div>
    </div>
  );
};

export default AppCanvas;
