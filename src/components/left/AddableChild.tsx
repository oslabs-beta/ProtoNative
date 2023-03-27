import React from 'react';
import { useDrag } from 'react-dnd';

type ItemTypesType = {
  ADDABLE_ELEMENT: string,
};

export const ItemTypes: ItemTypesType = {
  ADDABLE_ELEMENT: 'addableElement',
};

type Props = {
  name: string;
};

const AddChild = ({ name }: Props): JSX.Element => {
  // make this component draggable
  const [{ isDragging }, drag] = useDrag({
    type: 'addableElement',
    item: { name, type: 'addableElement' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className='addableElement' ref={drag}>
      {name}
    </div>
  )
}

export default AddChild;