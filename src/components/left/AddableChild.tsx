import React from 'react';
import { useDrag } from 'react-dnd';

type Props = {
  name: string;
  type: string;
};

const AddChild = ({ name, type }: Props): JSX.Element => {
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

export default AddChild;
