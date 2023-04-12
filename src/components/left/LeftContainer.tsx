import React from 'react';
import AddComponent from './AddComponent';
import ComponentList from './ComponentList';
import AddChild from './AddChild';

/**
 * @description - container holding left side components
 * @parent - MainContainer.tsx
 * @children - AddComponent.tsx, ComponentList.tsx, AddChild.tsx
 *
 */

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