import React, { useState, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  Copies,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  OrigCustomComp,
} from '../../utils/interfaces';
import DropLayer from './DropLayer';
import { isDoubleTagElement } from '../../utils/parser';
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

  if (isCopyCustomComp(componentDef)) {
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
  let showLayers;
  if (
    location === 'details' ||
    (location === 'app' && componentDef.parent.key === 'App')
  )
    showLayers = true;
  else showLayers = false;

  return (
    <div>
      {showLayers && (
        <DropLayer
          index={index}
          setCounter={setCounter}
          parent={copies[componentName].parent.key}
          copies={copies}
          setCopies={setCopies}
          originals={originals}
          setOriginals={setOriginals}
        />
      )}
      <div
        style={{ border: '1px solid black', backgroundColor: 'rgba(50, 2, 59, 0.8)' }}
        className='element'
        ref={drag}
      >
        <p>
          {copies[componentName].type === 'custom'
            ? copies[componentName].pointer
            : copies[componentName].type}
        </p>

        {isDoubleTagElement(copies[componentName].type) && (
          <DropLayer
            index={0}
            setCounter={setCounter}
            parent={componentDef.name}
            copies={copies}
            setCopies={setCopies}
            originals={originals}
            setOriginals={setOriginals}
          />
        )}
        {childElements}
      </div>
      {showLayers && (
        <DropLayer
          index={index + 1}
          setCounter={setCounter}
          parent={copies[componentName].parent.key}
          copies={copies}
          setCopies={setCopies}
          originals={originals}
          setOriginals={setOriginals}
        />
      )}
    </div>
  );
};

export default ElementBlock;
