import exp from 'constants';

import React from 'react';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { generateCustomComponentCode, formatCode } from '../../parser/parser';
import { OrigCustomComp, OrigNativeEl, AppInterface } from '../../parser/interfaces';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

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

  return (
    <div id='navbar-container'>
      <div id='logo-container'>
        <img id='actual-logo'src='/icons/logo-no-background.png'></img>
      </div>

      <div id='master-button-container'>
        <button className='master-button'>Clear All</button>
        <button onClick={exportFiles} className='master-button'>Export</button>
      </div>
    </div>
  )
}

export default NavBar;