import React from 'react';
import { useDrag } from 'react-dnd';
import {
  Copies,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  OrigCustomComp,
  AppInterface,
} from '../../utils/interfaces';
import DropLayer from './DropLayer';
import { isDoubleTagElement } from '../../utils/parser';

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
}: ElementBlockProps): JSX.Element => {
  const componentDef = copies[componentName] as CopyCustomComp | CopyNativeEl;
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

  //function to create uncle-nephew relations
  const pushCustoms = (array: string[], allNested: string[] = []) => {
    array.forEach((child) => {
      const children = copies[child] as CopyNativeEl;
      if (isDoubleTagElement(copies[child].type)) {
        pushCustoms(children.children, allNested);
      } else if (copies[child].type === 'custom') {
        allNested.push(child);
      }
    });
    return allNested;
  };

  const copiesParent = copies[parent] as CopyNativeEl;
  
  //check to see if ancestor is a custom component
  const hasCustomAncestor = (
    ancestor: CopyCustomComp | CopyNativeEl,
    name: string
    ): boolean => {
      if (ancestor.type === 'custom') return true;
      const origAncestorParent = originals[ancestor.parent.key] as OrigCustomComp;
      return ancestor.parent.key === 'App'
      ? false
      : ancestor.parent.origin === 'original'
      ? origAncestorParent.copies.some((copyName: string) =>
      hasCustomAncestor(copies[copyName], name)
      )
      : hasCustomAncestor(copies[ancestor.parent.key], name);
    };
    
    //show bottom drop layer for native elements
    const inNative =
      copiesParent && copiesParent.children.length - 1 === index
        ? true
        : false;
  
    let nestedComponentInApp: boolean; // unable to drag nested custom components in app canvas
    let showLayers: boolean; //show top dropLayer between elements

  //component is custom component copy
  if (isCopyCustomComp(componentDef)) {
    const originalElement = originals[componentDef.pointer] as OrigCustomComp;
    children = originalElement.children;
    //component is in app canvas
    if (location === 'app') {
      //create children array of uncle/nephew relations
      children = pushCustoms(originalElement.children);
      //drop layer at top of elements in top level of app canvas, allow them to drag
      const appObj = originals.App as AppInterface
      if (appObj.children.includes(componentDef.name)) {
        nestedComponentInApp = false;
        showLayers = true;
      }
      //custom component is in native element
      else if (
        componentDef.parent.origin === 'copies' &&
        componentDef.type === 'custom'
      ) {
        //check to see if the ancestor is a custom component
        //if ancestor is custom component, don't show the dropLayer, don't allow it to drag within the app canvas
        if (hasCustomAncestor(copies[componentDef.parent.key], componentName)) {
          showLayers = false;
          nestedComponentInApp = true;
        }
        //if it is a custom component within a native element, add top dropLayer
        else showLayers = true;
      }
      //if custom component is in the app canvas, nested custom components can't move
      else if (
        componentDef.parent.origin === 'original' &&
        componentDef.parent.key !== 'App'
      ) nestedComponentInApp = true;
      
    }
    //location is component details, show layers between all elements
    //don't need other logic because only showing 1 level deep for custom components
    else {
      showLayers = true;
      nestedComponentInApp = false;
    }
  }
  //native element displayed, need to show top dropLayer
  else {
    children = componentDef.children;
    showLayers = true;
    nestedComponentInApp = false;
  }

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

  const copyNativeEle = copies[componentName] as CopyNativeEl;

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
          transform: 'translate(0, 0)',
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
        {isDoubleTagElement(copyNativeEle.type) &&
          copyNativeEle.children.length === 0 && (
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
