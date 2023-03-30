import React from 'react';
import { useDrag } from 'react-dnd';
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
  setCounter: (prev: number) => void;
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
  let childElements: JSX.Element[];
  let children: string[];

  const [, drag] = useDrag(
    () => ({
      type: 'elements',
      item: {
        name: componentName,
        index: index,
        type: 'elements',
        parentComp: parent,
      },
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
    childElements = children.map((childName, idx) => {
      if (location === 'app' && copies[childName].type === 'custom') {
        return (
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
        return (
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
      } else if (location === 'app' && componentDef.type !== 'custom') {
        return (
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
  }

  // Button2: {
  //   name: 'Button2',
  //   type: 'Button',
  //   parent: { origin: 'original', key: 'CoolComponent' },
  //   children: [],
  // }
  // CoolComponent: {
  //   name: 'CoolComponent',
  //   type: 'custom',
  //   children: ['Button2', 'View1', 'View2', 'BruhComponent0'],
  //   state: [],
  //   index: 1,
  //   copies: ['CoolComponent0'],
  // } as OrigCustomComp,
  let showLayers;
  if (location === 'details') showLayers = true;
  else if (location === 'app') {
    if (componentDef.parent.key === 'App') showLayers = true;
    else if (copies[parent]) {
      if (isDoubleTagElement(copies[parent].type)) showLayers = true;
    }
  }

  const inNative: boolean =
    copies[parent] && copies[parent].children.length - 1 === index
      ? true
      : false;

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
        style={{
          border: '1px solid black',
          backgroundColor: 'rgba(50, 2, 59, 0.8)',
        }}
        className='element'
        ref={drag}
      >
        <p>
          {copies[componentName].type === 'custom'
            ? copies[componentName].pointer
            : copies[componentName].type}
        </p>

        {isDoubleTagElement(copies[componentName].type) &&
          copies[componentName].children.length === 0 && (
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
      {inNative && (
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
