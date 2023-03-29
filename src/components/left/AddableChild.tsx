import React from 'react';
import { useDrag } from 'react-dnd';

type Props = {
  name: string;
};

const AddChild = ({ name }: Props): JSX.Element => {
  // make this component draggable
  const [, drag] = useDrag({
    type: 'newElement',
    item: { name, type: 'newElement' },
  });

  return (
    <div className='addableElement' ref={drag}>
      {name}
    </div>
  );
};

export default AddChild;
