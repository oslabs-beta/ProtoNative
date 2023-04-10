import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Modal from '../left/Modal';
import {
  OrigCustomComp,
  Originals,
  Copies,
  CopyCustomComp,
  CopyNativeEl,
} from '../../utils/interfaces';
import { moveItem } from '../../utils/moveItem';
import { addItem } from '../../utils/addItem';

type DropLayerProps = {
  index: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  parent: string;
  copies: Copies;
  setCopies: React.Dispatch<React.SetStateAction<Copies>>;
  originals: Originals;
  setOriginals: React.Dispatch<React.SetStateAction<Originals>>;
  elementLocation: string;
  area: string;
};

const DropLayer = (props: DropLayerProps) => {
  const {
    index,
    setCounter,
    parent,
    copies,
    setCopies,
    originals,
    setOriginals,
    elementLocation,
    area,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const acceptLocation = elementLocation === 'app' ? 'app' : 'details';

  const [{ isOver }, drop] = useDrop({
    accept: [acceptLocation, 'newElement'],
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
        const origAncestorParent = originals[ancestor.parent.key] as OrigCustomComp;
        return ancestor.parent.key === 'App'
          ? false
          : ancestor.parent.origin === 'original'
          ? origAncestorParent.copies.some((copyName: string) =>
              isItsOwnAncestor(copies[copyName], name)
            )
          : isItsOwnAncestor(copies[ancestor.parent.key], name);
      };

      // prevent circular references by checking full component lineage
      const origCustom = originals[parent] as OrigCustomComp;
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
        origCustom.copies.some((copyName: string) =>
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

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={drop}
        id={area}
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
