import {createContext} from 'react';
import { Originals, Copies } from '../parser/interfaces';

interface AppContextTypes {
  originals: Originals
  setOriginals: React.Dispatch<React.SetStateAction<Originals>>
  copies: Copies
  setCopies: React.Dispatch<React.SetStateAction<Copies>>
  currentComponent: string | null
  setCurrentComponent: React.Dispatch<React.SetStateAction<string | null>>
}


export default createContext<AppContextTypes | null> (null);

  
