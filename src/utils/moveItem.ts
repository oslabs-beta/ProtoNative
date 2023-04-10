import { Originals, Copies, CopyCustomComp, OrigCustomComp, CopyNativeEl, AppInterface, } from "./interfaces";

/**
 * @method moveItem
 * @description - moves an already existing elementBlock to a new position
 * @input - dragIndex (index of the dragged item in its respective child array), 
 *          hoverIndex (index of where the item is dropped in the respective child array)
 *          name (name of the item dragged/dropped)
 *          parentComp (dragged item's parent)
 *          parent (dragLayer's parent)
 * @output - none, but will update the state of the respective arrays
 */

export const moveItem = (
  originals: Originals,
  setOriginals: React.Dispatch<React.SetStateAction<Originals>>,
  copies: Copies,
  setCopies: React.Dispatch<React.SetStateAction<Copies>>,
  dragIndex: number,
  hoverIndex: number,
  name: string,
  parentComp: string, 
  parent: string,
): void => {
  let dragArr: string[];
  let dropArr: string[];
  let item: string;
  let itemParent: { origin: string; key: string };
  let newSpot: any; //copy comp or originals comp type

  //item is in the top level custom component
  if (originals[parentComp]) {
    const draggedItemsParent = originals[parentComp] as OrigCustomComp 
    const dropzone = copies[parent] as CopyNativeEl
    item = draggedItemsParent.children[dragIndex];
    //item being moved is in the same level
    if (parentComp === parent) {
      //if moving between top level aka switching siblings
      dragArr = dropArr = [...draggedItemsParent.children];
    } else {
      //if moving between top level to a nested element (like a view)
      dragArr = [...draggedItemsParent.children];
      dropArr = [...dropzone.children];
      newSpot = copies[parent];
      itemParent = { origin: 'copies', key: newSpot.name };
    }
  } 
  //item is in a child element
  else {
    const draggedItemsParent = copies[parentComp] as CopyNativeEl;
    const dropzoneCustomComp = originals[parent] as OrigCustomComp;
    const dropzoneNativeEl = copies[parent] as CopyNativeEl;
    item = draggedItemsParent.children[dragIndex];
    dragArr = [...draggedItemsParent.children];
    //moving to the top level component
    if (originals[parent]) {
      dropArr = [...dropzoneCustomComp.children];
      newSpot = dropzoneCustomComp;
      //if moving around to app
      if (parent === 'App') {
        itemParent = {origin: 'original', key: 'App'}
      } else {
        itemParent = { origin: 'original', key: newSpot.name };
      }
    }
    //moving to a native element
    else {
      //moving in the same native  element
      if (parent === parentComp) {
        dropArr = dragArr = [...dropzoneNativeEl.children];
        // newSpot = dropzoneNativeEl;
      } 
      //moving to a different native element
      else {
        dropArr = [...dropzoneNativeEl.children];
        newSpot = dropzoneNativeEl;
        itemParent = { origin: 'copies', key: newSpot.name };
      }
    }
  }
  //moving within the same element
  if (parent === parentComp) {
    dragArr.splice(dragIndex, 1);
    //splicing changes index of the hover index if you're moving component down
    //moving element block up
    if (hoverIndex < dragIndex) {
      dropArr.splice(hoverIndex, 0, item);
    } 
    //moving element block down
    else {
      dropArr.splice(hoverIndex - 1, 0, item);
    }
  } 
  //moving between different elements
  else {
    dragArr.splice(dragIndex, 1);
    dropArr.splice(hoverIndex, 0, item);
  }

  //item is from top layer element
  if (originals[parentComp]) {
    //if item is moving top level to nested level
    if (parentComp !== parent) {
      //change children + change parent of the item that was moved
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
      //change children array of top level component
      setOriginals((prevState: Originals) => {
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
    //item is moving top level to top level
    else {
      setOriginals((prevState: Originals) => {
        const oldParentObj = prevState[parentComp];
        const newParentObj = {
          ...oldParentObj,
          children: dropArr,
        };
        return {
          ...prevState,
          [parentComp]: newParentObj,
        };
      });
    }
  }
  //nested item moved somewhere
  else {
    setCopies((prevState: Copies) => {
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
      setOriginals((prevState: Originals) => {
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

    } 
    //nested item to another nested element
    else {
      setCopies((prevState: Copies) => {
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
    }

    //change parent pointer if moving to different element
    if (parentComp !== parent) {
      setCopies((prevState: any) => {
        const itemUpdate = { ...prevState[name] };
        itemUpdate.parent = itemParent;
        return {
          ...prevState,
          [name]: itemUpdate,
        };
      });
    }
  }
};