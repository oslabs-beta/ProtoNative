import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Copies } from '../../parser/interfaces';
import AppContext from '../../context/AppContext';

type ElementBlockProps = {
  componentName: string;
  // components: Copies,
  index: number;
  setChildrenOfCurrent: (copy: string[]) => void;
  location: string;
};

const ElementBlock = ({
  componentName,
  index,
  setChildrenOfCurrent,
  location,
}: ElementBlockProps) => {
  const { originals, copies, currentComponent, setOriginals } =
    useContext(AppContext);
  const componentDef = copies[componentName];
  let childElements = null;
  let children: any = null;
  const ref = useRef(null);

  const moveItem = (dragIndex: number, hoverIndex: number): void => {
    const item = originals[currentComponent].children[dragIndex];
    const copy = [...originals[currentComponent].children];
    copy.splice(dragIndex, 1);
    copy.splice(hoverIndex, 0, item);
    setOriginals((prevState: any) => {
      prevState[currentComponent].children = copy;
      return prevState;
    });
    setChildrenOfCurrent(copy);
  };

  const [, drop] = useDrop({
    accept: ['elements', 'addableElement'],
    drop: (item: { name: number; index: number; type: string }, monitor) => {
      if (!ref.current) return;

      if (!monitor.canDrop()) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      if (item.type === 'elements') {
        moveItem(dragIndex, hoverIndex);
      } else if (item.type === 'addableElement') console.log('hi');
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'elements',
    item: { name: componentName, index: index, type: 'elements' },
    collect: (monitor) => ({
      //boolean to see if component is being dragged (isDragging)
      isDragging: monitor.isDragging(),
    }),
  }));
  //
  drag(drop(ref));
  //depending on if the current component is custom or not, we must get children differently
  if (componentDef.type === 'custom' && location === 'app') {
    children = originals[componentDef.pointer].children;
    // children = componentDef.children();
  } else {
    children = componentDef.children;
  }

  if (children.length) {
    const arr: JSX.Element[] = [];
    children.forEach((childName: string) => {
      if (location === 'app' && copies[childName].type === 'custom') {
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            index={index}
            setChildrenOfCurrent={setChildrenOfCurrent}
            location={'app'}
          />
        );
      } else if (
        location === 'details' &&
        copies[childName].type !== 'custom'
      ) {
        arr.push(
          <ElementBlock
            key={index}
            componentName={childName}
            index={index}
            setChildrenOfCurrent={setChildrenOfCurrent}
            location={'details'}
          />
        );
      }
    });
    childElements = arr;
  }

  return (
    <div>
      <div className='above'></div>
      <div
        key={index}
        style={{ border: '1px solid black' }}
        className='element'
        ref={ref}
      >
        <p>
          {copies[componentName].type === 'custom'
            ? copies[componentName].pointer
            : copies[componentName].type}
        </p>
        {childElements}
      </div>
      <div className='below'></div>
    </div>
  );
};

export default ElementBlock;
