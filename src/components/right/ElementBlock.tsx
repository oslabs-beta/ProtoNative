import React, { useRef, useContext} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {Copies} from '../../parser/interfaces';
import AppContext from '../../context/AppContext';

type ElementBlockProps = {
  componentName: string,
  // components: Copies,
  index: number,
  moveItem: (dragIndex: number, hoverIndex: number)=> void,
  location: string
}

const ElementBlock = ({
  componentName,
  index,
  moveItem,
  location,
}: ElementBlockProps) => {
  const {originals, copies} = useContext(AppContext);
  const componentDef = copies[componentName];
  let childElements = null;
  let children: any = null;
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ['elements', 'addableElement'],
    drop: (item: { name: number; index: number; type: string}, monitor) => {
      if (!ref.current) return;

      if (!monitor.canDrop()) {
        return;
      }
      console.log(item.name, 'dropped into', componentName);

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      if(item.type === 'elements') {
        moveItem(dragIndex, hoverIndex);
      
      }
      else if (item.type === 'addableElement') console.log('hi');
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'elements',
    item: { name: componentName, index: index, type: 'elements' },
    collect: (monitor) => ({
      //boolean to see if component is being dragged (isDragging)
      isDragging: monitor.isDragging(),
    }),
  }));
  //
  drag(drop(ref));
  //depending on if the current component is custom or not, we must get children differently
  if (componentDef.type === 'custom' && location === 'app') {
    children = originals[componentDef.pointer].children;
    
} else {
    children = componentDef.children;
  }

  if (children.length) {
    const arr: JSX.Element[] = [];
    children.forEach((childName: string) => {
      if (location === 'app' && copies[childName].type === 'custom') {
        // console.log(childName)
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            // components={copies}
            index={index}
            moveItem={moveItem}
            location={'app'}
          />
        );
      } else if (
        location === 'details' &&
        copies[childName].type !== 'custom'
      ) {
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            // components={copies}
            index={index}
            moveItem={moveItem}
            location={'details'}
          />
        );
      }
    });
    childElements = arr;
  }

  return (
    <div
      key={index}
      style={{ border: '1px solid black' }}
      className='element'
      ref={ref}
    >
      <p>
        {copies[componentName].type === 'custom'
          ? copies[componentName].pointer
          : copies[componentName].type}
      </p>

      {childElements}
    </div>
  );
};

export default ElementBlock;
