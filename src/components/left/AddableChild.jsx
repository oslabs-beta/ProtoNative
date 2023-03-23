import React from 'react';
// import { useDrag } from 'react-dnd';

const AddChild = ({ name } = props) => {

  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: 'addableElement',
  //   item: { name },
  // }));

  return (
    <div className='addableElement'>
      {name}
    </div>
  )
}

export default AddChild;