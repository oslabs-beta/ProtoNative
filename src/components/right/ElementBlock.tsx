import React, { useRef, useState, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Copies } from '../../parser/interfaces';
import AppContext from '../../context/AppContext';
import DropLayer from './DropLayer';

type ElementBlockProps = {
  componentName: string;
  // components: Copies,
  index: number;
  setChildrenOfCurrent: (copy: string[]) => void;
  location: string;
  parent: string;
  topLevel: boolean;
};

const ElementBlock = ({
  componentName,
  index,
  setChildrenOfCurrent,
  location,
  parent,
  topLevel,
}: ElementBlockProps) => {
  const { originals, copies, currentComponent, setOriginals } =
    useContext(AppContext);
  const componentDef = copies[componentName];
  let childElements = null;
  let children: any = null;
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ['elements', 'addableElement'],
    drop: (
      item: { name: number; index: number; type: string; parentComp: string },
      monitor
    ) => {
      console.log(item.name, 'dropped in', componentName);
      // if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      // if (dragIndex === hoverIndex) return;

      if (item.type === 'elements') {
        // moveItem(dragIndex, hoverIndex);
      } else if (item.type === 'addableElement') console.log('hi');
    },
    // collect: (monitor) => ({
    //   isOver: monitor.isOver(),
    //   isOverCurrent: monitor.isOver({ shallow: true }),
    // }),
  });

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'elements',
      item: {
        name: componentName,
        index: index,
        type: 'elements',
        parentComp: parent,
      },
      collect: (monitor) => ({
        //boolean to see if component is being dragged (isDragging)
        isDragging: monitor.isDragging(),
      }),
    }),
    [componentName, index]
  );
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
        arr.push(
          <ElementBlock
            key={index + childName}
            componentName={childName}
            index={index}
            setChildrenOfCurrent={setChildrenOfCurrent}
            location={'app'}
            parent={copies[childName].parent.key}
            topLevel={false}
          />
        );
      } else if (
        location === 'details' &&
        copies[childName].type !== 'custom'
      ) {
        arr.push(
          <ElementBlock
            key={index + childName}
            componentName={childName}
            index={index}
            setChildrenOfCurrent={setChildrenOfCurrent}
            location={'details'}
            parent={copies[childName].parent.key}
            topLevel={false}
          />
        );
      }
    });
    childElements = arr;
  }

  return (
    <div>
      <DropLayer
        component={componentName}
        position='above'
        index={index}
        setChildrenOfCurrent={setChildrenOfCurrent}
        parent={copies[componentName].parent.key}
      />
      <div style={{ border: '1px solid black' }} className='element' ref={ref}>
        <p>
          {copies[componentName].type === 'custom'
            ? copies[componentName].pointer
            : copies[componentName].type}
        </p>
        {childElements}
      </div>
      <DropLayer
        component={componentName}
        position='below'
        index={index}
        setChildrenOfCurrent={setChildrenOfCurrent}
        parent={copies[componentName].parent.key}
      />
    </div>
  );
};

export default ElementBlock;
