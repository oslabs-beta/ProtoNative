import React from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';
import AddComponent from '../left/AddComponent';


const RightContainer = (): JSX.Element => {
  return (
    <div id='right-container'>
      <ComponentDetails />
      <AddComponent/>
      <CodeBlock />
    </div>
  )
}

export default RightContainer;