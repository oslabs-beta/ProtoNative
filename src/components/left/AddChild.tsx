import React, {useState, useContext, useEffect} from 'react';
import context from '../../context/AppContext';
import AddableChild from './AddableChild';

const AddChild = (): JSX.Element => {

  // Grab the original element list from the context
  const { originals } = useContext(context);

  // Create a state variable to hold the list of elements that can be added
  const [addableChildren, setAddableChildren] = useState([]);
  // Create a list of elements that can be added to the map
  useEffect(() => {
    const children: JSX.Element[] = [];
    for (const name in originals) {
      const element: any = originals[name as keyof typeof originals];
      if (element.type !== 'app') {
        children.push(
          <AddableChild name={name} key={name} />
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