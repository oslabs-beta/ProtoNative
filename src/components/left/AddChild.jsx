import React, {useState, useContext, useEffect} from 'react';
import context from '../../context/AppContext';
import AddableChild from './AddableChild';

const AddChild = () => {

  // Grab the original element list from the context
  const {originals, copies} = useContext(context);

  // Create a state variable to hold the list of elements that can be added
  const [addableChildren, setAddableChildren] = useState([]);
  console.log(copies['testComponent0'].children())
  // Create a list of elements that can be added to the map
  useEffect(() => {
    const children = [];
    for (const name in originals) {
      const element = originals[name];
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