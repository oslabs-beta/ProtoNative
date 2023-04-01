export const moveItem = (
  originals: any,
  setOriginals: any,
  copies: any,
  setCopies: any,
  dragIndex: number,
  hoverIndex: number,
  name: string,
  parentComp: string, //dragged item's parent
  parent: string,
): void => {

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
  } 
  //item is in a child element
  else {
    item = copies[parentComp].children[dragIndex];
    dragArr = [...copies[parentComp].children];
    //moving to the top level component
    if (originals[parent]) {
      dropArr = [...originals[parent].children];
      newSpot = originals[parent];
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
        dropArr = dragArr = [...copies[parent].children];
        // newSpot = copies[parent];
      } 
      //moving to a different native element
      else {
        dropArr = [...copies[parent].children];
        newSpot = copies[parent];
        itemParent = { origin: 'copies', key: newSpot.name };
      }
    }
  }
  //moving within the same element
  if (parent === parentComp) {
    dragArr.splice(dragIndex, 1);
    //splicing changes index of the hover index if you're moving component down
    //moving up
    if (hoverIndex < dragIndex) {
      dropArr.splice(hoverIndex, 0, item);
    } 
    //moving down
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
    } else {
      //item is moving top level to top level
      setOriginals((prevState: any) => {
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

    } 
    //nested item to another nested element
    else {
      setCopies((prevState: any) => {
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