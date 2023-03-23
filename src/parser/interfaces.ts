export type NativeElements =
  | 'app'
  | 'view'
  | 'button'
  | 'text'
  | 'image'
  | 'textInput'
  | 'scrollView'
  | 'flatList'
  | 'sectionList'
  | 'switch'
  | 'touchableHighlight'
  | 'touchableOpacity'
  | 'statusBar'
  | 'activityIndicator';


export interface OrigNativeEl {
  type: NativeElements;
  // depends on key names in copies context
  children: string[];
  index: number;
}

export interface AppInterface {
  type: 'app';
  children: string[];
  state: string[];
}

export interface OrigCustomComp {
  type: 'custom';
  // depends on key names in copies context
  children: string[];
  state: string[];
  index: number;
  // depends on names of copies of this component in copies context
  copies: string[];
}

export interface Parent {
  origin: 'original' | 'copies';
  // depends on user's custom component names in originals
  key: NativeElements | string; 
}

export interface CopyNativeEl {
  type: NativeElements;
  parent: Parent;
  // depends on names of copies in copies context
  children: string[];
}

export interface CopyCustomComp {
  type: 'custom';
  // depends on key names in copies context
  parent: string; 
  // ALL depend on user's custom component names in originals
  pointer: NativeElements | string; 
  children(): (NativeElements | string)[];
  state(): (NativeElements | string)[];
}
