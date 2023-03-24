import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import Modal from '../left/Modal';

const AppCanvas = () => {
  
  const {originals: {app}, copies} = useContext(AppContext);
  let appComponents = app.children.map(child => {
    
    if (copies[child].type === 'custom'){
      return ElementBlock(child, copies, 'app')
    }
    else{
      return ElementBlock(child, copies, 'details')
    }
  });

  return (
    <div id='app-canvas'>
      <Modal/>
      <h1>My App</h1>
      <div id='phone-screen-container'>
        {appComponents}
      </div>
    </div>
  );
};

export default AppCanvas;
