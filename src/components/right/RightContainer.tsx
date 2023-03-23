import React, {useContext} from 'react';
import ComponentDetails from './ComponentDetails';
import CodeBlock from './CodeBlock';
import AppContext from '../../context/AppContext';


const RightContainer = (): JSX.Element => {
  return (
    <div id='right-container'>
      <ComponentDetails />
      <CodeBlock />
    </div>
  )
}

export default RightContainer;