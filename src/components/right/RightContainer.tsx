import React from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';
import AddComponent from '../left/AddComponent';
import TrashButton from './TrashButton';


const RightContainer = (): JSX.Element => {
  return (
    <div id='right-container'>
      <ComponentDetails />
      <TrashButton/>
      <CodeBlock />
    </div>
  )
}

export default RightContainer;