import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ComponentListItem from './ComponentListItem';
import { OrigCustomComp, AppInterface, OrigNativeEl } from '../../parser/interfaces';

// these components should be from originals
// display  with a scroll bar
// the components in this list need to have a delete button and a state button: modal opens up
// delete asks are you sure?, state asks you to input state & save
// when you click on one of these components, it opens up in comp details (use setCurrentComponents() to change the context of the current component)
// current component should be highlighted
const ComponentList = (): JSX.Element => {

  const { originals, copies } = useContext(AppContext);

  // create a state variable to hold list of elements
  const [components, setComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newComponents: JSX.Element[] = [];
    for (const name in originals) {
      const element: (OrigCustomComp | AppInterface | OrigNativeEl) = originals[name as keyof typeof originals];
      if (element.type === 'app' || element.type === 'custom') {
        // push component block elements to array. They have the original context component name in them
        newComponents.push(<ComponentListItem key={name} name={name} />);
      }
    }
    setComponents(newComponents);

  }, [originals])

  return (
    <div id="componentListContainer">
      <h2>Components</h2>
      <div id="customComps" >
        {components}
      </div>
    </div>
  )
}

export default ComponentList;