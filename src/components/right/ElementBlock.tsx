import React, { useRef, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useDrag, useDrop } from 'react-dnd';

const ElementBlock = (
  componentName: string,
  components: {},
  index: number,
  moveItem,
  location
): JSX.Element => {
  const ref = useRef(null);
  const componentDef = components[componentName];

  let childElements = null;
  let children = null;

  const [, drop] = useDrop({
    accept: 'elements',
    // collect(monitor) {
    //   return {
    //     handlerId: monitor.getHandlerId(),
    //   };
    // },
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
    },
    hover(item, monitor) {
      if (!ref.current) return;

      if (!monitor.canDrop()) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const mousePosition = monitor.getClientOffset();
      const hoveredRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const hoverClientY = mousePosition.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
      console.log('new item index', item.index);
      console.log(hoverIndex);
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

  childElements = componentDef.children.length
    ? componentDef.children.map((childName: string, index: number) => {
        if (components[childName].type !== 'custom') {
          return ElementBlock(
            childName,
            components,
            index,
            moveItem,
            'details'
          );
        }
      })
    : null;
  //depending on if the current component is custom or not, we must get children differently
  if (componentDef.type === 'custom' && location === 'app')
    children = componentDef.children();
  else {
    children = componentDef.children;
  }

  if (children.length) {
    const arr = [];

    children.forEach((childName) => {
      if (location === 'app' && components[childName].type === 'custom') {
        arr.push(ElementBlock(childName, components, index, moveItem, 'app'));
      } else if (
        location === 'details' &&
        components[childName].type !== 'custom'
      ) {
        arr.push(
          ElementBlock(childName, components, index, moveItem, 'details')
        );
      }
    });
    childElements = arr;
  }
  // const childElements = componentDef.children.length
  //   ? componentDef.children.map(childName => ElementBlock(childName, components))
  //   : null;

  return (
    <div
      key={componentName}
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
