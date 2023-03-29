import React, { useRef, useState, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  Copies,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  OrigCustomComp,
} from '../../parser/interfaces';
import DropLayer from './DropLayer';
// import { isCopyCustomComp } from '../../parser/parser';
type ElementBlockProps = {
  componentName: string;
  copies: Copies;
  setCopies: any;
  originals: Originals;
  setOriginals: any;
  index: number;
  location: string;
  parent: string;
  setCounter: (value: number) => number;
};

const isCopyCustomComp = (
  comp: CopyNativeEl | CopyCustomComp
): comp is CopyCustomComp => {
  return comp.type === 'custom';
};

const ElementBlock = ({
  componentName,
  copies,
  setCopies,
  originals,
  setOriginals,
  index,
  location,
  parent,
  setCounter,
}: ElementBlockProps) => {
  const componentDef = copies[componentName];
  let childElements = null;
  let children: string[] = null;
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

      if (item.type === 'elements') {
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

  drag(drop(ref));

  // console.log('component', componentDef);
  // console.log(originals);
  // console.log(copies);
  if (isCopyCustomComp(componentDef)) {
    // if (componentDef.type === 'custom') {
    const originalElement = originals[componentDef.pointer] as OrigCustomComp;
    children = originalElement.children;
  } else {
    children = componentDef.children;
  }

  if (children.length) {
    const arr: JSX.Element[] = [];
    children.forEach((childName: string, idx) => {
      if (location === 'app' && copies[childName].type === 'custom') {
        arr.push(
          <ElementBlock
            key={idx + childName}
            componentName={childName}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
            index={idx}
            location={'app'}
            parent={copies[childName].parent.key}
            setCounter={setCounter}
          />
        );
      } else if (location === 'details' && componentDef.type !== 'custom') {
        arr.push(
          <ElementBlock
            key={idx + childName}
            componentName={childName}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
            index={idx}
            location={'details'}
            parent={copies[childName].parent.key}
            setCounter={setCounter}
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
        position={'above'}
        index={index}
        setCounter={setCounter}
        parent={copies[componentName].parent.key}
        copies={copies}
        setCopies={setCopies}
        originals={originals}
        setOriginals={setOriginals}
      />
      <div
        style={{ border: '1px solid black', backgroundColor: 'rgba(0,0,0,.4)' }}
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
      <DropLayer
        component={componentName}
        position={'below'}
        index={index + 1}
        setCounter={setCounter}
        parent={copies[componentName].parent.key}
        copies={copies}
        setCopies={setCopies}
        originals={originals}
        setOriginals={setOriginals}
      />
    </div>
  );
};

export default ElementBlock;
