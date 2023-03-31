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
  setCopies: React.Dispatch<React.SetStateAction<Copies>>;
  originals: Originals;
  setOriginals: React.Dispatch<React.SetStateAction<Originals>>;
  index: number;
  location: string;
  parent: string;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
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
      type: location,
      item: {
        name: componentName,
        index: index,
        type: 'elements',
        parentComp: parent,
      },
    }),
    [componentName, index]
  );

  const pushCustoms = (array) => {};

  if (isCopyCustomComp(componentDef)) {
    const originalElement = originals[componentDef.pointer] as OrigCustomComp;
    children = originalElement.children;
    if (location === 'app') {
    }
  } else {
    children = componentDef.children;
  }

  //copies[childName] -> looks at children of the currenent component
  //componentDef -> current component object

  if (children.length) {
    childElements = children.map((childName, idx) => {
      //showing custom components within custom components in app
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
      }
      //showing native elements within native elements in app
      else if (location === 'app' && componentDef.type !== 'custom') {
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
      }
      //showing only first level of custom components in component details
      else if (location === 'details' && componentDef.type !== 'custom') {
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
  //creating a top drop layer at the top level (app or in component details)
  let showLayers: boolean;
  if (location === 'details') showLayers = true;
  else if (location === 'app') {
    if (componentDef.parent.key === 'App') showLayers = true;
    else if (copies[parent]) {
      if (isDoubleTagElement(copies[parent].type)) showLayers = true;
    }
  }

  //creating a drop layer at the bottom of nested native elements
  const inNative: boolean =
    copies[parent] && copies[parent].children.length - 1 === index
      ? true
      : false;

  console.log(originals[componentDef.parent.key]);
  const nestedComponentInApp =
    (location === 'app' &&
      componentDef.parent.origin === 'original' &&
      componentDef.parent.key !== 'App') ||
    undefined
      ? true
      : false;

  console.log(nestedComponentInApp);
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
          elementLocation={location}
          area={'drop-layer-area'}
        />
      )}
      <div
        style={{
          border: '2px solid black',
          backgroundColor: 'rgba(50, 2, 59, 0.6)',
        }}
        className='element'
        ref={nestedComponentInApp ? null : drag}
      >
        <p>
          {copies[componentName].type === 'custom'
            ? copies[componentName].pointer
            : copies[componentName].type}
        </p>
        {/* creating a starter drop layer for empty native elements */}
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
              elementLocation={location}
              area={'drop-layer-area'}
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
          elementLocation={location}
          area={'drop-layer-area'}
        />
      )}
    </div>
  );
};

export default ElementBlock;
