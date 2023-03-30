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
} from '../../parser/interfaces';
import { moveItem } from './moveItem';
import { addItem } from './addItem';

type DropLayerProps = {
  index: number;
  setCounter: (value: number) => number;
  parent: string;
  copies: any;
  setCopies: any;
  originals: any;
  setOriginals: any;
};

const DropLayer = ({
  index,
  setCounter,
  parent,
  copies,
  setCopies,
  originals,
  setOriginals,
}: DropLayerProps) => {
  const [, drop] = useDrop({
    accept: ['elements', 'newElement'],
    drop: (
      item: { name: string; index: number; type: string; parentComp: string },
      monitor
    ) => {
      const dragIndex: number = item.index;
      const hoverIndex: number = index;
      // if (dragIndex === hoverIndex) return;
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
  });

  return (
    <div ref={drop} id='drop-layer-area'>
      {/* <p>{parent}</p> */}
      {index}
    </div>
  );
};

export default DropLayer;
