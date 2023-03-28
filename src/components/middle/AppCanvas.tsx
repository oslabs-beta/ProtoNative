import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import ElementBlock from '../right/ElementBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../left/AddableChild';
import {
  AppInterface,
  Originals,
  OrigNativeEl,
  OrigCustomComp,
  CopyCustomComp,
  CopyNativeEl,
  Copies,
} from '../../parser/interfaces';

const AppCanvas = (): JSX.Element => {
  const { setCopies, setOriginals, originals, copies } = useContext(AppContext);
  const App = originals.App as AppInterface;
  const [appComponents, setAppComponents] = useState([]);

  useEffect(() => {
    let appChildren: JSX.Element[] = App.children.map((child, index) => {
      if (copies[child].type === 'custom') {
        return (
          <ElementBlock
            key={index}
            componentName={child}
            copies={copies}
            originals={originals}
            index={index}
            location={'app'}
            parent={'App'}
            setChildrenOfCurrent={setAppComponents}
          />
        );
      } else {
        return (
          <ElementBlock
            key={index}
            componentName={child}
            copies={copies}
            originals={originals}
            index={index}
            location={'details'}
            parent={'App'}
            setChildrenOfCurrent={setAppComponents}
          />
        );
      }
    });
    setAppComponents(appChildren);
  }, [copies]);

  // make the phone screen container droppable accepting addableElement
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ADDABLE_ELEMENT,
    drop: (item: { name: string }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      const originalElement = originals[item.name] as
        | OrigNativeEl
        | OrigCustomComp;
      let newElement = {} as CopyCustomComp | CopyNativeEl;
      // if originalElement is a custom element use custom element template
      if (originalElement.type === 'custom') {
        newElement = {
          name: originalElement.name + originalElement.index,
          type: originalElement.type,
          parent: { origin: 'original', key: 'App' },
          pointer: item.name,
        };

        // increment index of originalElement, add newElement to copies, add newElement to App's children
        setOriginals((previous: Originals): Originals => {
          const prevApp = previous['App'] as AppInterface;
          const newApp = {
            ...prevApp,
            children: [...prevApp.children, newElement.name], // TODO: Put child element in correct location
          };
          const prevOriginalElement = previous[item.name] as OrigCustomComp;
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
