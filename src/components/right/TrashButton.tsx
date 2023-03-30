import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import AppContext from '../../context/AppContext';
import { trashCan } from '../../utils/trashCan';
import { deepCopy } from '../../utils/deepCopy';
import { Originals, Copies } from '../../utils/interfaces';

const TrashButton = (): JSX.Element => {
  const { setCopies, setOriginals, originals, copies } = useContext(AppContext);
  // create drop area
  const [{ isOver }, drop] = useDrop({
    accept: 'elements',
    drop: (item: { name: string }) => {
      // create a deep copy of the two contexts
      const comp = copies[item.name];
      const copyOriginals = deepCopy(originals) as Originals;
      const copyCopies = deepCopy(copies) as Copies;
      trashCan(comp, copyOriginals, copyCopies, true);
      setOriginals(copyOriginals);
      setCopies(copyCopies);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  // accept type of 'element'
  // use the item object in the drop method that we will declare
  // deep copy the two contexts' and feed that as well as item.name to the trashCan function

  const hover = isOver ? 'yellow' : null;

  return (
    <div
      id='trash-button-container'
      ref={drop}
      style={{ backgroundColor: hover }}
    >
      <h1>Trash</h1>
    </div>
  );
};

export default TrashButton;
