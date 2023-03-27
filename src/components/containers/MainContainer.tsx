import React from 'react';
import LeftContainer from '../left/LeftContainer';
import AppCanvas from '../middle/AppCanvas';
import RightContainer from '../right/RightContainer';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const MainContainer = (): JSX.Element => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div id='main-container'>
        <LeftContainer />
        <AppCanvas />
        {/* <RightContainer /> */}
      </div>
    </DndProvider>
  );
};

export default MainContainer;
