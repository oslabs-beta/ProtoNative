import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../left/AddableChild';

const AppCanvas = (): JSX.Element => {
  
  const {setCopies, setOriginals, originals, originals: {App}, copies} = useContext(AppContext);
  console.log('AppCanvas originals: ', originals)
  console.log('AppCanvas copies: ', copies)
  const [appComponents, setAppComponents] = useState([]);
  useEffect(() => {
    let appChildren: JSX.Element[] = App.children.map((child, index) => {
      if (copies[child].type === 'custom'){
        return (<ElementBlock
        key={index}
        componentName={child}
        components={copies}
        index={index}
        moveItem={() => console.log('hi')}
        location={'app'}
      />)
      }
      else{
        return (<ElementBlock
          key={index}
          componentName={child}
          components={copies}
          index={index}
          moveItem={() => console.log('hi')}
          location={'details'}
        />)
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
          parent: {origin: 'original', key: 'App'},
          pointer: item.name,
          children: function() {
            return originals[this.pointer].children;
          },
          state: function() {
            return originals[this.pointer].state;
          }
          
        }

        // increment index of originalElement
        setOriginals((previous: typeof originals): typeof originals => {
          const newOriginal = {
            ...previous[item.name],
            index: previous[item.name].index + 1,
            copies: [...previous[item.name].copies, newElement.name],
          };
          console.log(newOriginal)
  
          return {
            ...previous,
            [item.name]: newOriginal,
          };
        });

        // TODO: check component's ancestry if it were to be added into a component instead of app
        // TODO: dont do this here in the AppCanvas component yet though, do it when adding adding a custom component into another component
        

        // if originalElement is a native element use native element template
      } else {
        newElement = {
          name: originalElement.type + originalElement.index,
          type: originalElement.type,
          parent: {origin: 'original', key: 'App'},
          children: [],
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
      }
      
      // add to children property of app
      setOriginals((previous: typeof originals): typeof originals => {
        const newApp = {
          ...App,
          children: [...App.children, newElement.name], // TODO: Put child element in correct location
        };
        return {
          ...previous,
          App: newApp,
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