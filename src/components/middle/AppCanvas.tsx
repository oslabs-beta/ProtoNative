import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../left/AddableChild';

const AppCanvas = (): JSX.Element => {
  
  const {setCopies, setOriginals, originals, originals: {app}, copies} = useContext(AppContext);

  const [appComponents, setAppComponents] = useState([]);

  useEffect(() => {
    let appChildren: JSX.Element[] = app.children.map(child => {
      if (copies[child].type === 'custom'){
        return ElementBlock(child, copies, 'app')
      }
      else{
        return ElementBlock(child, copies, 'details')
      }
    });
    setAppComponents(appChildren);
  }, [copies]);

  // make the phone screen container droppable accepting addableElement
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ADDABLE_ELEMENT,
    drop: (item: {name: string}, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      const originalElement: any = originals[item.name as keyof typeof originals];
      let newElement: any = {};
      // if originalElement is a custom element use custom element template
      if (originalElement.type === 'custom'){
        newElement = {
          name: originalElement.name + originalElement.index,
          type: originalElement.type,
          parent: 'app',
          pointer: item.name,
          children: function() {
            return originals[this.pointer].children;
          },
          state: function() {
            return originals[this.pointer].state;
          }
        }
        // TODO: check component's ancestry if it were to be added into a component instead of app
        // TODO: dont do this here in the AppCanvas component yet though, do it when adding adding a custom component into another component
        

        // if originalElement is a native element use native element template
      } else {
        newElement = {
          name: originalElement.type + originalElement.index,
          type: originalElement.type,
          parent: 'app',
          children: [],
        }
      }

      // increment index of originalElement
      setOriginals((previous: typeof originals): typeof originals => {
        const newOriginal = {
          ...previous[item.name],
          index: previous[item.name].index + 1,
        };

        return {
          ...previous,
          [item.name]: newOriginal,
        };
      });
      
      // add to children property of app
      setOriginals((previous: typeof originals): typeof originals => {
        const newApp = {
          ...app,
          children: [...app.children, newElement.name], // TODO: Put child element in correct location
        };
        return {
          ...previous,
          app: newApp,
        };
      })
      
      // add to copies
      setCopies((previous: typeof copies): typeof copies => {
        return {
          ...previous,
          [newElement.name]: newElement,
        };
      });
      // console.log('App before drop: ', app.children)
      // console.log('Newly created element: ', newElement);
      // console.log('App after drop: ', app.children)
      // console.log('Keys of copies: ', Object.keys(copies));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div id='app-canvas'>
      <h1>My App</h1>
      <div id='phone-screen-container' ref={drop}>
        {appComponents}
      </div>
    </div>
  );
};

export default AppCanvas;