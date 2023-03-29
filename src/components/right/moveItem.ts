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