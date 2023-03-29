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
  const moveItem = (
    dragIndex: number,
    hoverIndex: number,
    name: string,
    parentComp: string, //dragged item's parent
    position: string
  ): void => {
    console.log('parentComp', parentComp);
    console.log('name', name);
    let dragArr: string[];
    let dropArr: string[];
    let item: string;
    let itemParent: { origin: string; key: string };
    let newSpot: any; //copy comp or originals comp type

    // const originalPosition = originals[parentComp] ? originals[parentComp] as AppInterface | OrigCustomComp: copies;

    //parentComp = dragged item's parent vs
    //parent = dragLayer's parent to know which array to be splicing
    //item is in the top level custom component
    if (originals[parentComp]) {
      item = originals[parentComp].children[dragIndex];
      //item being moved is in the same level
      if (parentComp === parent) {
        //if moving between top level aka switching siblings
        dragArr = dropArr = [...originals[parentComp].children];
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
          dropArr = dragArr = [...copies[parent].children];
          console.log('hello buddy');
          // newSpot = copies[parent];
        } else {
          dropArr = [...copies[parent].children];
          newSpot = copies[parent];
          itemParent = { origin: 'copies', key: newSpot.name };
        }
      }
    }

    dragArr.splice(dragIndex, 1);
    dropArr.splice(hoverIndex, 0, item);

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
        const oldParentObj = prevState[parentComp];
        const newParentObj = {
          ...oldParentObj,
          children: dragArr,
        };
        return {
          ...prevState,
          [parentComp]: newParentObj,
        };
      });
    }
    //nested item moved somewhere
    else {
      setCopies((prevState: any) => {
        const oldParentObj = prevState[parentComp];
        const newParentObj = {
          ...oldParentObj,
          children: dragArr,
        };
        return {
          ...prevState,
          [parentComp]: newParentObj,
        };
      });
      //nested item to top level
      if (originals[parent]) {
        setOriginals((prevState: any) => {
          const oldDropObj = prevState[parent];
          const newDropObj = {
            ...oldDropObj,
            children: dropArr,
          };
          return {
            ...prevState,
            [parent]: newDropObj,
          };
        });

        //nested item to another nested element
      } else {
        setCopies((prevState: any) => {
          const oldDropObj = prevState[parent];
          // console.log(oldDropObj);
          const newDropObj = {
            ...oldDropObj,
            children: dropArr,
          };
          return {
            ...prevState,
            [parent]: newDropObj,
          };
        });
      }

      if (parentComp !== parent) {
        setCopies((prevState: any) => {
          console.log('in updating parent');
          const itemUpdate = { ...prevState[name] };
          itemUpdate.parent = itemParent;
          return {
            ...prevState,
            [name]: itemUpdate,
          };
        });
      }
    }
    setCounter((prev) => ++prev);
  };

  const addItem = (name: string, hoverIndex: number, parent: string) => {
    let newElement = {} as CopyCustomComp | CopyNativeEl;
    let newEleObj = originals[name];
    //adding a  custom element
    if (originals[name].type === 'custom') {
      //custom component dropped to top level
      if (originals[parent]) {
        newElement = {
          name: newEleObj.name + newEleObj.index,
          type: newEleObj.type,
          parent: { origin: 'original', key: parent },
          pointer: name,
        };
        //drop array is correct and splices correctly
        const dropArr = [...originals[parent].children];
        dropArr.splice(hoverIndex, 0, newElement.name);
        console.log('dropArr', dropArr);

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

        setCopies((previous: Copies): Copies => {
          return {
            ...previous,
            [newElement.name]: newElement,
          };
        });

        //custom component dropped to a nested element (FIX: code block breaks here)
      } else {
        //new element points to copies array instead
        newElement = {
          name: newEleObj.name + newEleObj.index,
          type: newEleObj.type,
          parent: { origin: 'copies', key: parent },
          pointer: name,
        };

        //also splicing correctly
        const dropArr = [...copies[parent].children];
        dropArr.splice(hoverIndex, 0, newElement.name);

        //incrementing index + adding copies to the originals!
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
            [parent]: newUpdatedComponent,
            [newElement.name]: newElement,
          };
        });
      }
    }
    //adding a new native element
    else {
      //dropped to a top level component
      if (originals[parent]) {
        newElement = {
          name: newEleObj.type + newEleObj.index,
          type: newEleObj.type,
          parent: { origin: 'original', key: parent },
          children: [],
        };
        //drop array is correct and splices correctly
        const dropArr = [...originals[parent].children];
        dropArr.splice(hoverIndex, 0, newElement.name);

        setOriginals((previous: any) => {
          const prevDroppedElement = previous[name];
          const newDroppedElement = {
            ...prevDroppedElement,
            index: prevDroppedElement.index + 1,
          };

          const prevUpdatedComponent = previous[parent];
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

        setCopies((previous: Copies): Copies => {
          return {
            ...previous,
            [newElement.name]: newElement,
          };
        });

        //dropped native element into native element
      } else {
        newElement = {
          name: newEleObj.type + newEleObj.index,
          type: newEleObj.type,
          parent: { origin: 'copies', key: parent },
          children: [],
        };

        const dropArr = [...copies[parent].children];
        dropArr.splice(hoverIndex, 0, newElement.name);

        setOriginals((previous: Originals): Originals => {
          const prevDroppedElement = previous[name] as OrigNativeEl;
          const newDroppedElement = {
            ...prevDroppedElement,
            index: prevDroppedElement.index + 1,
          };

          return {
            ...previous,
            [name]: newDroppedElement,
          };
        });

        setCopies((previous: Copies): Copies => {
          const prevUpdatedComponent = previous[parent] as CopyNativeEl;
          const newUpdatedComponent = {
            ...prevUpdatedComponent,
            children: dropArr,
          };

          return {
            ...previous,
            [parent]: newUpdatedComponent,
            [newElement.name]: newElement,
          };
        });
      }
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
        addItem(item.name, hoverIndex, parent);
      }
    },
  });

  return (
    <div ref={drop} id='drop-layer-area'>
      {/* <p>{parent}</p> */}
      {/* {index} */}
    </div>
  );
};

export default DropLayer;
