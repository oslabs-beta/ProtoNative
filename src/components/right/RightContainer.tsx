import React from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';


const RightContainer = (): JSX.Element => {
  return (
    <div id='right-container'>
      <ComponentDetails />
      <CodeBlock />
    </div>
  )
}

export default RightContainer;