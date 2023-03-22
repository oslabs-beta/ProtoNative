import React from 'react';
import AddComponent from './AddComponent';
import ComponentList from './ComponentList';
import AddChild from './AddChild';


const LeftContainer = (): JSX.Element => {
  return (
    <div id='left-container'>
      <AddComponent />
      <ComponentList />
      <AddChild />
    </div>
  )
}

export default LeftContainer;