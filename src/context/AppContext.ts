import {createContext} from 'react';


interface AppContextTypes {
  originals: {}
  setOriginals: any
  copies: {}
  setCopies: any
  currentComponent: string | null
  setCurrentComponent: any
}


export default createContext<AppContextTypes | null> (null);

  
