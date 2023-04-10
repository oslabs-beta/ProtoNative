import React from 'react';
import { useDrag } from 'react-dnd';

type Props = {
  name: string;
  type: string;
};


/**
 * @description - displays a draggable element with its name
 * @parent - AddChild.tsx
 * @children - none
 *
 */

const AddableChild = ({ name, type }: Props): JSX.Element => {
  // make this component draggable
  const [, drag] = useDrag({
    type: 'newElement',
    item: { name, type: 'newElement' },
  });

  return (
      type === 'custom'
      ? <div className='addableComponent' ref={drag}>
          {name}
        </div>
      : <div className='addableElement' ref={drag}>
          {name}
        </div>
  );
};

export default AddableChild;
