import {createContext} from 'react';
import {OrigNativeEl, OrigCustomComp, AppInterface, CopyNativeEl, CopyCustomComp} from '../parser/interfaces';

type originals = {
  [key: string]: OrigNativeEl | OrigCustomComp | AppInterface
}

type copies = {
  [key: string]: CopyNativeEl | CopyCustomComp
}

interface AppContextTypes {
  originals: originals
  setOriginals: any
  copies: copies
  setCopies: any
  currentComponent: string | null
  setCurrentComponent: any
}


export default createContext<AppContextTypes | null> (null);

  
