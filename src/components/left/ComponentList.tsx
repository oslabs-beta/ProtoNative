import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ComponentListItem from './ComponentListItem';
import { OrigCustomComp, AppInterface, OrigNativeEl } from '../../utils/interfaces';


/**
 * @description - lists App and custom components
 * @parent - LeftContainer.tsx
 * @children - ComponentListItem.tsx
 *
 */

const ComponentList = (): JSX.Element => {
  const { originals } = useContext(AppContext);
  const [components, setComponents] = useState<JSX.Element[]>([]);

  // update component list with all custom components + App
  useEffect(() => {
    const newComponents: JSX.Element[] = [];
    for (const name in originals) {
      const element: (OrigCustomComp | AppInterface | OrigNativeEl) = originals[name];
      if (element.type === 'App' || element.type === 'custom') {
        newComponents.push(<ComponentListItem key={name} comp={element} />);
      }
    }
    setComponents(newComponents);
  }, [originals])

  return (
    <div id='componentList'>
      <h2>Components</h2>
        <div id="customComps" >
          {components}
        </div>
    </div>
  )
}

export default ComponentList;