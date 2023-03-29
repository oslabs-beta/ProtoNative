import React from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';
import TrashButton from './TrashButton';

const RightContainer = (): JSX.Element => {
  return (
    <div id='right-container'>
      <ComponentDetails />
      <TrashButton />
      <CodeBlock />
    </div>
  );
};

export default RightContainer;
