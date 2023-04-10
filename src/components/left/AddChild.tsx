import React, {useState, useContext, useEffect} from 'react';
import context from '../../context/AppContext';
import AddableChild from './AddableChild';
import { AppInterface, OrigCustomComp, OrigNativeEl } from '../../utils/interfaces';


/**
 * @description - container of dragable addable children components
 * @parent - LeftContainer.tsx
 * @children - AddableChild.tsx
 * 
 */

const AddChild = (): JSX.Element => {

  const { originals } = useContext(context);
  const [addableChildren, setAddableChildren] = useState([]);

  // map all custom components and native elements to addableChildren
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