const addItem = (name: string, hoverIndex: number, parent: string) => {
  let newElement = {} as CopyCustomComp | CopyNativeEl;
  let newEleObj = originals[name];

  //dropping custom element
  if (originals[name].type === 'custom') {
    //dropped to top level
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

      //dropped to a nested array
    } else {
      //new element points to copies array instead
      newElement = {
        name: newEleObj.name + newEleObj.index,
        type: newEleObj.type,
        parent: { origin: 'copies', key: parent },
        pointer: name,
      };

      //also splicing correctly
      const dropArr = copies[parent].children;
      dropArr.splice(hoverIndex, 0, newElement.name);

      //incrementing index + adding copies to the originals!
      setOriginals((previous: Originals): Originals => {
        const prevDroppedElement = previous[name] as OrigCustomComp;

        const newDroppedElement = {
          ...prevDroppedElement,
          index: prevDroppedElement.index + 1,
          copies: [...prevDroppedElement.copies, newElement.name],
        };
        console.log('new', newDroppedElement);
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
        console.log(newUpdatedComponent);
        return {
          ...previous,
          [parent]: newUpdatedComponent,
          [newElement.name]: newElement,
        };
      });
    }
  } else {
    newElement = {
      name: newEleObj.name + newEleObj.index,
      type: newEleObj.type,
      parent: { origin: 'original', key: parent },
      children: [],
    };
    //dropped to a top level component WORKS
    if (originals[parent]) {
      //drop array is correct and splices correctly
      const dropArr = [...originals[parent].children];
      dropArr.splice(hoverIndex, 0, newElement.name);

      setOriginals((previous: Originals): Originals => {
        const prevDroppedElement = previous[name] as OrigCustomComp;
        const newDroppedElement = {
          ...prevDroppedElement,
          index: prevDroppedElement.index + 1,
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

      //dropped native element !!fix
    } else {
      const dropArr = copies[parent].children;
      dropArr.splice(hoverIndex, 0, newElement.name);

      setOriginals((previous: Originals): Originals => {
        const prevDroppedElement = previous[name] as OrigCustomComp;
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
  }
  setCounter((prev) => ++prev);
};