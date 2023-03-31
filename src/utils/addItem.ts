
import {
  AppInterface,
  OrigCustomComp,
  Originals,
  Copies,
  CopyCustomComp,
  CopyNativeEl,
  OrigNativeEl,
} from './interfaces';


export const addItem = 
  (originals: Originals,
  setOriginals: any,
  copies: Copies, 
  setCopies: any,
  name: string, 
  hoverIndex: number, 
  parent: string) => {
  let newElement = {} as CopyCustomComp | CopyNativeEl;
  let newEleObj = originals[name] as OrigNativeEl | OrigCustomComp;
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
      const dropArr: string[] = [...originals[parent].children];
      dropArr.splice(hoverIndex, 0, newElement.name);

      //incrementing index + adding copies to the originals 
      //update children of the parent 
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

      //custom component dropped to a nested element
    } else {
      //new element points to copies array instead
      newElement = {
        name: newEleObj.name + newEleObj.index,
        type: newEleObj.type,
        parent: { origin: 'copies', key: parent },
        pointer: name,
      };

      const dropArr: string[] = [...copies[parent].children];
      dropArr.splice(hoverIndex, 0, newElement.name);

      //incrementing index + adding copies to the originals
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

      //updatng children array and making a copy of the added element
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
      //add the new element to copies
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

      //update index of dropped element
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
      
      //update children array and create new copy
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
};