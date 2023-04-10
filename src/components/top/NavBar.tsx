import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { formattedCompCode, isOrigCustomComp } from '../../utils/parser';
import {
  OrigCustomComp,
  OrigNativeEl,
  AppInterface,
} from '../../utils/interfaces';
import Modal from '../left/Modal';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { expoFiles } from '../../utils/expoFiles';

const NavBar = (): JSX.Element => {
  const { setCopies, setOriginals, setCurrentComponent, originals, copies } =
    useContext(AppContext);
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
      TouchableHighlight: {
        type: 'TouchableHighlight',
        index: 0,
      } as OrigNativeEl,
      TouchableOpacity: { type: 'TouchableOpacity', index: 0 } as OrigNativeEl,
      StatusBar: { type: 'StatusBar', index: 0 } as OrigNativeEl,
      ActivityIndicator: {
        type: 'ActivityIndicator',
        index: 0,
      } as OrigNativeEl,
    });
    setCopies({});
    setIsOpen(false);
  };

  const handleClearAllClick = () => {
    setIsOpen(true);
  };

  const exportFiles = (): void => {
    const zip = new JSZip();
    zip.file(
      'App.js',
      formattedCompCode(originals['App'] as AppInterface, originals, copies)
    );

    const allCustomComponents = zip.folder('Components');
    for (const component in originals) {
      const currComponent = originals[component];
      if (isOrigCustomComp(currComponent)) {
        const fileName = `${currComponent.name}.js`;
        const componentCode = formattedCompCode(
          originals[currComponent.name] as OrigCustomComp,
          originals,
          copies
        );
        allCustomComponents.file(fileName, componentCode);
      }
    }
    for (const file of expoFiles) {
      zip.file(file.name, file.contents);
    }
    zip.generateAsync({ type: 'blob' }).then(function (allFiles) {
      saveAs(allFiles, 'App.zip');
    });
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div id='navbar-container'>
        <div id='logo-container'>
          <img id='actual-logo' src='./icons/logo-no-background.png'></img>
        </div>

        <div id='master-button-container'>
          <button
            className='master-button'
            onClick={() => handleClearAllClick()}
          >
            Clear All
          </button>
          <button onClick={exportFiles} className='master-button'>
            Export
          </button>
        </div>
      </div>

      {isOpen && (
        <Modal handleClick={handleClick}>
          {
            <div id='confirmModal'>
              <h3>Are you sure you want to clear all?</h3>
              <p>
                This will delete everything from your application!
              </p>
              <p>Please confirm to proceed.</p>
              <div id='confirm-modal-buttons'>
                <button id='confirm' onClick={() => clearAll()}>
                  Confirm
                </button>
                <button id='cancel' onClick={() => handleClick()}>
                  Cancel
                </button>
              </div>
            </div>
          }
        </Modal>
      )}
    </>
  );
};

export default NavBar;
