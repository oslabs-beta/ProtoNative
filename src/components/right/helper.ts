
const addItem = (name: string, hoverIndex: number, parent: string) => {
  let newElement = {} as CopyCustomComp | CopyNativeEl;
  let newEleObj;
  if (originals[name].type === 'custom') {
    newEleObj = originals[name];
    newElement = {
      name: newEleObj.name + newEleObj.index,
      type: newEleObj.type,
      parent: { origin: 'original', key: parent },
      pointer: name,
    };
    // console.log(newElement);

    if (originals[parent]) {
      //drop array is correct and splices correctly
      const dropArr = originals[parent].children;
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
      
      setChildrenOfCurrent(dropArr);
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
    newElement = {
      name: .type + originalElement.index,
      type: originalElement.type,
      parent: { origin: 'original', key: 'App' },
      children: [],
    };

  }
};

  //increment the originals index + add copies
  //need to test if it's parent drop index is originals or in copy

  
  
  
  
  
//   const appChildren = originals.App.children;
  
  // increment index of originalElement, add newElement to copies, add newElement to App's children
  setOriginals((previous: Originals): Originals => {
    const prevApp = previous['App'] as AppInterface;
    const newApp = {
      ...prevApp,
      children: [...prevApp.children, newElement.name], // TODO: Put child element in correct location
    };
    const prevOriginalElement = previous[name] as OrigCustomComp;
    const newOriginalElement = {
      ...prevOriginalElement,
      index: prevOriginalElement.index + 1,
      copies: [...prevOriginalElement.copies, newElement.name],
    };
    return {
      ...previous,
      [item.name]: newOriginalElement,
      App: newApp,
    };
  });

  // TODO: check component's ancestry if it were to be added into a component instead of app
  // TODO: dont do this here in the AppCanvas component yet though, do it when adding adding a custom component into another component

  // if originalElement is a native element use native element template
} else {
  newElement = {
    name: originalElement.type + originalElement.index,
    type: originalElement.type,
    parent: { origin: 'original', key: 'App' },
    children: [],
  };
  // increment index of originalElement, add newElement to copies, add newElement to App's children
  setOriginals((previous: Originals): Originals => {
    const prevApp = previous['App'] as AppInterface;

    //splicing
    const newApp = {
      ...prevApp,
      children: [...prevApp.children, newElement.name], // TODO: Put child element in correct location
    };

    const prevOriginalElement = previous[item.name] as
      | OrigNativeEl
      | OrigCustomComp;
    const newOriginalElement = {
      ...prevOriginalElement,
      index: prevOriginalElement.index + 1,
    };

    return {
      ...previous,
      [item.name]: newOriginalElement,
      App: newApp,
    };
  });
}

// add to copies
setCopies((previous: Copies): Copies => {
  return {
    ...previous,
    [newElement.name]: newElement,
  };
});

}