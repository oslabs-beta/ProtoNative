import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import {
  AppInterface,
  OrigCustomComp,
  Originals,
  Copies,
  CopyCustomComp,
  CopyNativeEl,
} from '../../parser/interfaces';

type DropLayerProps = {
  component: string;
  position: string;
  index: number;
  setCounter: (value: number) => number;
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
  setCounter,
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
    parentComp: string, //dragged item's parent
    position: string
  ): void => {
    console.log('parentComp', parentComp);
    console.log('name', name);
    console.log(position);
    let dragArr: string[];
    let dropArr: string[];
    let item: string;
    let itemParent: { origin: string; key: string };
    let newSpot: any; //copy comp or originals comp type
    // const originalPosition = originals[parentComp] ? originals[parentComp] as AppInterface | OrigCustomComp: copies;

    //parentComp = dragged item's parent vs
    //parent = dragLayer's parent to know which array to be splicing
    console.log('dragIndex', dragIndex);
    console.log('hoverIndex', hoverIndex);
    //item is in the top level custom component
    if (originals[parentComp]) {
      item = originals[parentComp].children[dragIndex];
      //item being moved is in the same level
      if (parentComp === parent) {
        //if moving between top level aka switching siblings
        dropArr = dragArr = [...originals[parentComp].children];
      } else {
        //if moving between top level to a nested element (like a view)
        dragArr = [...originals[parentComp].children];
        dropArr = [...copies[parent].children];
        newSpot = copies[parent];
        itemParent = { origin: 'copies', key: newSpot.name };
      }
    } else {
      //item is in a child element
      item = copies[parentComp].children[dragIndex];
      dragArr = [...copies[parentComp].children];

      //moving to the top level component
      if (originals[parent]) {
        dropArr = [...originals[parent].children];
        newSpot = originals[parent];
        itemParent = { origin: 'originals', key: newSpot.name };
      }
      //moving to another nested element
      else {
        //moving in the same nested element
        if (parent === parentComp) {
          dragArr = [...copies[parent].children];
          newSpot = copies[parent];
        }
        dropArr = [...copies[parent].children];
        newSpot = copies[parent];
        itemParent = { origin: 'copies', key: newSpot.name };
      }
    }
    if (parent === parentComp) {
      dropArr.splice(dragIndex, 1);
      dropArr.splice(hoverIndex, 0, item);
    } else {
      dragArr.splice(dragIndex, 1);
      dropArr.splice(hoverIndex, 0, item);
    }
    console.log(dragArr);
    // console.log(dropArr);

    //item is from top layer element
    if (originals[parentComp]) {
      //if item is moving top level to nested level
      if (parentComp !== parent) {
        setCopies((prevState: any) => {
          const newParentObj = {
            ...prevState[parent],
            children: dropArr,
          };
          const newChildObj = {
            ...prevState[name],
            parent: itemParent,
          };
          return {
            ...prevState,
            [parent]: newParentObj,
            [name]: newChildObj,
          };
        });
      }
      //item is moving top level to top level, but also have to change originals if top to child
      setOriginals((prevState: any) => {
        prevState[parentComp].children = dragArr;
        return prevState;
      });
    }

    //nested item moved somewhere
    else {
      setCopies((prevState: any) => {
        prevState[parentComp].children = dragArr;
        return prevState;
      });
      //nested item to top level
      if (originals[parent]) {
        setOriginals((prevState: any) => {
          prevState[parent].children = dropArr;
          return prevState;
        });

        //nested item to another nested element
      } else {
        setCopies((prevState: any) => {
          prevState[parent].children = dropArr;
          return prevState;
        });
      }

      setCopies((prevState: any) => {
        const itemUpdate = { ...prevState[name] };
        itemUpdate.parent = itemParent;
        console.log('new parent', itemUpdate);
        return {
          ...prevState,
          [name]: itemUpdate,
        };
      });
    }
    setCounter((prev) => ++prev);
  };

  const addItem = (name: string, hoverIndex: number, parent: string) => {
    let newElement = {} as CopyCustomComp | CopyNativeEl;
    let newEleObj = originals[name];
    if (originals[name].type === 'custom') {
      newElement = {
        name: newEleObj.name + newEleObj.index,
        type: newEleObj.type,
        parent: { origin: 'original', key: parent },
        pointer: name,
      };
      // console.log(newElement);

      if (originals[parent]) {
        //drop array is correct and splices correctly
        const dropArr = [...originals[parent].children];
        // console.log('dropArr', dropArr);
        dropArr.splice(hoverIndex, 0, newElement.name);

        setOriginals((previous: Originals): Originals => {
          const prevDroppedElement = previous[name] as OrigCustomComp;
          const newDroppedElement = {
            ...prevDroppedElement,
            index: prevDroppedElement.index + 1,
            copies: [...prevDroppedElement.copies, newElement.name],
          };

          const prevUpdatedComponent = previous[parent] as OrigCustomComp;
          const newUpdatedComponent = {
            ...prevUpdatedComponent,
            children: dropArr,
          };

          return {
            ...previous,
            [name]: newDroppedElement,
            [parent]: newUpdatedComponent,
          };
        });
      } else {
        const dropArr = copies[parent].children;
        dropArr.splice(hoverIndex, 0, newElement.name);

        setOriginals((previous: Originals): Originals => {
          const prevDroppedElement = previous[name] as OrigCustomComp;
          const newDroppedElement = {
            ...prevDroppedElement,
            index: prevDroppedElement.index + 1,
            copies: [...prevDroppedElement.copies, newElement.name],
          };

          return {
            ...previous,
            [name]: newDroppedElement,
          };
        });

        setCopies((previous: Copies): Copies => {
          const prevUpdatedComponent = previous[parent] as
            | CopyNativeEl
            | CopyCustomComp;
          const newUpdatedComponent = {
            ...prevUpdatedComponent,
            children: dropArr,
          };

          return {
            ...previous,
            [newElement.name]: newUpdatedComponent,
          };
        });
      }
    } else {
    }
    setCounter((prev) => ++prev);
  };

  const [, drop] = useDrop({
    accept: ['elements', 'newElement'],
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
      } else {
        console.log('hi');
        addItem(item.name, hoverIndex, parent);
      }
    },
  });

  return (
    <div ref={drop} id='drop-layer-area'>
      <p>{parent}</p>
    </div>
  );
};

export default DropLayer;
