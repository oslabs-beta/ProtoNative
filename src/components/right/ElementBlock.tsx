import React, { useRef, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {Copies, CopyNativeEl, CopyCustomComp, Originals} from '../../parser/interfaces';
type ElementBlockProps = {
  componentName: string,
  components: Copies,
  originals: Originals,
  index: number,
  moveItem: (dragIndex: number, hoverIndex: number)=> void,
  location: string
}

const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
  return comp.type === 'custom';
}

const ElementBlock = ({
  componentName,
  components,
  originals,
  index,
  moveItem,
  location,
}: ElementBlockProps) => {
  const componentDef = components[componentName];
  let childElements = null;
  let children: string[] = null;
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'elements',
    drop: (item: { name: string; index: number }, monitor) => {
      if (!ref.current) return;

      if (!monitor.canDrop()) {
        return;
      }
      console.log(item.name, 'dropped into', componentName);

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveItem(dragIndex, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'elements',
    item: { name: componentName, index: index },
    collect: (monitor) => ({
      //boolean to see if component is being dragged (isDragging)
      isDragging: monitor.isDragging(),
    }),
  }));
  //
  drag(drop(ref));

  //depending on if the current component is custom or not, we must get children differently
  // if (componentDef.type === 'custom' && location === 'app')
  //   children = componentDef.children();
  // else {
  //   children = componentDef.children;
  // }

  if (isCopyCustomComp(componentDef))
    children = originals[componentDef.pointer].children; // originals[componentDef.pointer].children
  else {
    children = componentDef.children;
  }


  // TestComponent0
  // TestComponent original context
  // TestComponent.children = ['Button0', 'CoolComponent0']
  console.log('CHILDREN IN ELEMENT BLOCK ', children)
  if (children.length) {
    const arr: JSX.Element[] = [];
    children.forEach((childName: string) => {
      if (location === 'app' && components[childName].type === 'custom') {
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            components={components}
            originals={originals}
            index={index}
            moveItem={moveItem}
            location={'app'}
          />
        );
      } else if (
        location === 'details' &&
        components[childName].type !== 'custom'
      ) {
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            components={components}
            originals={originals}
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
        {components[componentName].type === 'custom'
          ? components[componentName].pointer
          : components[componentName].type}
      </p>

      {childElements}
    </div>
  );
};

export default ElementBlock;
