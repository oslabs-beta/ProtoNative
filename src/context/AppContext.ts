import {createContext} from 'react';


interface AppContextTypes {
  originals: {}
  setOriginals: any
  copies: {}
  setCopies: any
  currentComponent: number
  setCurrentComponent: any
}


export default createContext<AppContextTypes | null> (null);

  
