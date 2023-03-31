import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Modal from '../left/Modal';
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
import { compileFunction } from 'vm';

type DropLayerProps = {
  hasChildren: number;
  index: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  parent: string;
  copies: any;
  setCopies: any;
  originals: any;
  setOriginals: any;
};

const DropLayer = (props: DropLayerProps) => {
  const {
    hasChildren,
    index,
    setCounter,
    parent,
    copies,
    setCopies,
    originals,
    setOriginals,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [{ isOver }, drop] = useDrop({
    accept: ['elements', 'newElement'],
    drop: (
      item: { name: string; index: number; type: string; parentComp: string },
      monitor
    ) => {
      // function to check if a component is its own ancestor
      const isItsOwnAncestor = (
        ancestor: CopyCustomComp | CopyNativeEl,
        name: string
      ): boolean => {
        if (name === ancestor.parent.key) return true;
        console.log(1);
        return ancestor.parent.key === 'App'
          ? false
          : ancestor.parent.origin === 'original'
          ? originals[ancestor.parent.key].copies.some((copyName: string) =>
              isItsOwnAncestor(copies[copyName], name)
            )
          : isItsOwnAncestor(copies[ancestor.parent.key], name);
      };

      // prevent circular references by checking full component lineage
      if (item.name === parent) {
        setErrorMsg('Cannot add a component to itself!');
        setIsOpen(true);
        return;
      } else if (
        copies[parent] &&
        parent !== 'App' &&
        isItsOwnAncestor(copies[parent], item.name)
      ) {
        setErrorMsg(`"${item.name}" cannot be its own ancestor!`);
        setIsOpen(true);
        return;
      } else if (
        originals[parent] &&
        parent !== 'App' &&
        originals[parent].copies.some((copyName: string) =>
          isItsOwnAncestor(copies[copyName], item.name)
        )
      ) {
        setErrorMsg(`"${item.name}" cannot be its own ancestor!`);
        setIsOpen(true);
        return;
      }

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

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={drop}
        id={lastChild ? 'drop-layer-large' : 'drop-layer-area'}
        style={{ backgroundColor: backgroundColor }}
      ></div>
      {isOpen && (
        <Modal handleClick={handleClose}>
          <div id='error-modal'>
            <h2>{errorMsg}</h2>
            <button id='error-close-button' onClick={() => handleClose()}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DropLayer;
