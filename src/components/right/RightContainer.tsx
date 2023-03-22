import React from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';


const RightContainer = (): JSX.Element => {
  return (
    <div>
      <ComponentDetails />
      <CodeBlock />
    </div>
  )
}

export default RightContainer;