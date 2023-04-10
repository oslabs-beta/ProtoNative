import React, {useState, useContext, useEffect} from 'react';
import context from '../../context/AppContext';
import AddableChild from './AddableChild';
import { AppInterface, OrigCustomComp, OrigNativeEl } from '../../utils/interfaces';

const AddChild = (): JSX.Element => {

  // Grab the original element list from the context
  const { originals } = useContext(context);

  // Create a state variable to hold the list of elements that can be added
  const [addableChildren, setAddableChildren] = useState([]);
  // Create a list of elements that can be added to the map
  useEffect(() => {
    const children: JSX.Element[] = [];
    for (const name in originals) {
      const element: (OrigCustomComp | OrigNativeEl | AppInterface) = originals[name];
      if (element.type !== 'App') {
        const type = element.type;
        children.push(
          <AddableChild name={name} type={type} key={name} />
        );
      }
    }
    setAddableChildren(children);
  }, [originals]);

  return (
    <div  id='addChild'>
      <h2>Add Child</h2>
      <div id='addableElementsContainer'>
        {addableChildren}
      </div>
    </div>
  )
}

export default AddChild;