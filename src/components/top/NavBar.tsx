import exp from 'constants';

import React, { useContext, useState } from 'react';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { generateCustomComponentCode, formatCode } from '../../parser/parser';
import { OrigCustomComp, OrigNativeEl, AppInterface } from '../../parser/interfaces';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import AppContext from '../../context/AppContext';
import { AppInterface, Originals, OrigNativeEl } from '../../parser/interfaces';
import Modal from '../left/Modal';
const isOrigCustomComp = (comp: OrigCustomComp | OrigNativeEl | AppInterface): comp is OrigCustomComp => {
  return comp.type === 'custom';
}

const NavBar = (): JSX.Element => {
  const { originals, copies } = useContext(AppContext);

  const exportFiles = (): void => {
    const zip = new JSZip();
    zip.file('App.jsx', formatCode(generateCustomComponentCode(originals['App'] as AppInterface, originals, copies)));
    for (const component in originals) {
      const currComponent = originals[component];
      if (isOrigCustomComp(currComponent)) {
        const fileName = `${currComponent.name}.jsx`;
        const componentCode = formatCode(generateCustomComponentCode(originals[currComponent.name] as OrigCustomComp, originals, copies));
        zip.file(fileName, componentCode);
      }
    }
    zip.generateAsync({ type: 'blob' }).then(function(allFiles) {
      saveAs(allFiles, 'App.zip');
  });
  }

  const { setCopies, setOriginals, setCurrentComponent } = useContext(AppContext);
  const [currentModal, setCurrentModal] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

  const clearAll = () => {
    setCurrentComponent('App');
    setOriginals({
        App: { type: 'App', children: [], state: [] } as AppInterface,
        View: { type: 'View', index: 0 } as OrigNativeEl,
        Button: { type: 'Button', index: 0 } as OrigNativeEl,
        Text: { type: 'Text', index: 0 } as OrigNativeEl,
        Image: { type: 'Image', index: 0 } as OrigNativeEl,
        TextInput: { type: 'TextInput', index: 0 } as OrigNativeEl,
        ScrollView: { type: 'ScrollView', index: 0 } as OrigNativeEl,
        FlatList: { type: 'FlatList', index: 0 } as OrigNativeEl,
        SectionList: { type: 'SectionList', index: 0 } as OrigNativeEl,
        Switch: { type: 'Switch', index: 0 } as OrigNativeEl,
        TouchableHighlight: { type: 'TouchableHighlight', index: 0 } as OrigNativeEl,
        TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
        StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
        ActivityIndicator: { type: 'ActivityIndicator', index: 0 } as OrigNativeEl,
    });
    setCopies({});
    setIsOpen(false);
  };

  const handleClearAllClick = () => {
    setCurrentModal('clearAll');
    setIsOpen(true);
  };

  const handleExportClick = () => {
    setCurrentModal('export');
    setIsOpen(true);
  };

  const exportApp = () => {
    // loop through all custom components in Originals context and create a new file for each one
    // fill each file with the appropriate code using the parser.ts file
    // ask users where they want to save the files
    // save the files
    // close the modal
    
  };

  const handleClick = () => {
		setIsOpen(false);
		console.log('close button clicked');
	}


  return (
    <>
      <div id='navbar-container'>
        <div id='logo-container'>
          <img id='actual-logo'src='./icons/logo-no-background.png'></img>
        </div>

        <div id='master-button-container'>
          <button className='master-button' onClick={() => handleClearAllClick()}>Clear All</button>
          <button onClick={exportFiles} className='master-button' onClick={() => handleExportClick()}>Export</button>
        </div>
      </div>

      {isOpen ? (
        <Modal handleClick={handleClick}>
        {currentModal === 'clearAll' ? (
          <div id='confirmModal'>
            <h3>Are you sure you want to clear all?</h3>
            <p>This will delete <b>absolutely everything</b> from your application!</p>
            <p>Please confirm to proceed.</p>
            <div>
              <button onClick={() => clearAll()}>Confirm</button>
              <button onClick={() => handleClick()}>Cancel</button>
            </div>
          </div>
        ) : currentModal === 'export' ? (
          <div id='confirmModal'>
            <h3>Export</h3>
            <p>Save a folder containing all created components to your local machine</p>
            <div>
              <button onClick={() => exportApp()}>Confirm</button>
              <button onClick={() => handleClick()}>Cancel</button>
            </div>
          </div>
        ) : null}
        </Modal>
      ) : null}
    </>
  )
}

export default NavBar;