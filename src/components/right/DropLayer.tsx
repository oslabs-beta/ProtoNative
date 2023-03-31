import React from 'react';
import { useDrop } from 'react-dnd';
import {
  AppInterface,
  OrigCustomComp,
  Originals,
  Copies,
  CopyCustomComp,
  CopyNativeEl,
  OrigNativeEl,
} from '../../utils/interfaces';
import { moveItem } from '../../utils/moveItem';
import { addItem } from '../../utils/addItem';

type DropLayerProps = {
  hasChildren: number;
  index: number;
  setCounter: (value: number) => number;
  parent: string;
  copies: any;
  setCopies: any;
  originals: any;
  setOriginals: any;
};

const DropLayer = ({
  hasChildren,
  index,
  setCounter,
  parent,
  copies,
  setCopies,
  originals,
  setOriginals,
}: DropLayerProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['elements', 'newElement'],
    drop: (
      item: { name: string; index: number; type: string; parentComp: string },
      monitor
    ) => {
      const dragIndex: number = item.index;
      const hoverIndex: number = index;
      if (item.type === 'elements') {
        moveItem(
          originals,
          setOriginals,
          copies,
          setCopies,
          dragIndex,
          hoverIndex,
          item.name,
          item.parentComp,
          parent
        );
      } else {
        addItem(
          originals,
          setOriginals,
          copies,
          setCopies,
          item.name,
          hoverIndex,
          parent
        );
      }
      setCounter((prev) => ++prev);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  //hover color
  const backgroundColor = isOver ? '#f0c142' : null;

  //make the last drop layer take up the rest of the screen
  let lastChild: boolean = false;
  if (hasChildren === 0) lastChild = true;
  if (originals[parent]) {
    if (index === originals[parent].children.length) {
      lastChild = true;
    }
  }

  return (
    <div
      ref={drop}
      id={lastChild ? 'drop-layer-large' : 'drop-layer-area'}
      style={{ backgroundColor: backgroundColor }}
    ></div>
  );
};

export default DropLayer;
