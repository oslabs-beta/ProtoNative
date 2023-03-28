import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { AppInterface, OrigCustomComp } from '../../parser/interfaces';

import AppContext from '../../context/AppContext';

type DropLayerProps = {
  component: string;
  position: string;
  index: number;
  setChildrenOfCurrent: (arr: string[]) => void;
  parent: string;
  copies: any;
  setCopies: any;
  originals: any;
  setOriginals: any;
};

const DropLayer = ({
  component,
  position,
  index,
  setChildrenOfCurrent,
  parent,
  copies,
  setCopies,
  originals,
  setOriginals,
}: DropLayerProps) => {
  // const { originals, copies, setOriginals, currentComponent, setCopies } =
  //   useContext(AppContext);

  const moveItem = (
    dragIndex: number,
    hoverIndex: number,
    name: string,
    parentComp: string,
    position: string
  ): void => {
    console.log('parentComp', parentComp);
    console.log('name', name);
    console.log(position);
    let dragArr: string[];
    let dropArr: string[];
    let item: string;
    //item is in the top level custom component

    // const originalPosition = originals[parentComp] ? originals[parentComp] as AppInterface | OrigCustomComp: copies;
    console.log('dragIndex', dragIndex);
    console.log('hoverIndex', hoverIndex);
    if (originals[parentComp]) {
      item = originals[parentComp].children[dragIndex];
      if (parentComp === parent) {
        //if moving between top level aka switching siblings
        dropArr = dragArr = [...originals[parentComp].children];
      } else {
        //if moving between top level to a nested element (like a view)
        dragArr = [...originals[parentComp].children];
        dropArr = [...copies[parent].children];
      }
    } else {
      //item is in a child element
      // dragIndex = copies[parentComp].children.indexOf(name); //FIX: index of items nested in an element are mapped as the same index of the nested component
      item = copies[parentComp].children[dragIndex];
      dragArr = [...copies[parentComp].children];
      //moving to the top level component
      if (originals[parent]) {
        dropArr = [...originals[parent].children];
      } else {
        //moving to another nested element
        dropArr = [...copies[parent].children];
        if (position === 'below') hoverIndex++;
      }
    }
    dragArr.splice(dragIndex, 1);
    dropArr.splice(hoverIndex, 0, item);
    console.log(dragArr);
    console.log(dropArr);

    if (originals[parentComp]) {
      if (parentComp !== parent) {
        setCopies((prevState: any) => {
          prevState[parent].children = dropArr;
          return prevState;
        });
      }
      setOriginals((prevState: any) => {
        prevState[parentComp].children = dragArr;
        return prevState;
      });
      setChildrenOfCurrent(dragArr);
    } else {
      setCopies((prevState: any) => {
        prevState[parentComp].children = dragArr;
        return prevState;
      });
      if (originals[parent]) {
        setOriginals((prevState: any) => {
          prevState[parent].children = dropArr;
          return prevState;
        });
        setChildrenOfCurrent(dropArr);
      } else {
        setCopies((prevState: any) => {
          prevState[parent].children = dropArr;
          return prevState;
        });
      }
    }
  };

  const [, drop] = useDrop({
    accept: ['elements', 'addableElement'],
    drop: (
      item: { name: string; index: number; type: string; parentComp: string },
      monitor
    ) => {
      const dragIndex: number = item.index;
      const hoverIndex: number = index;
      const positionRelative: string = position;
      // if (dragIndex === hoverIndex) return;
      if (item.type === 'elements') {
        moveItem(
          dragIndex,
          hoverIndex,
          item.name,
          item.parentComp,
          positionRelative
        );
      }
    },
  });

  return (
    <div ref={drop} id='drop-layer-area'>
      <span>{index}</span>
    </div>
  );
};

export default DropLayer;
