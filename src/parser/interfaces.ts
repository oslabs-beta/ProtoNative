export type NativeElement =
  | 'View'
  | 'Button'
  | 'Text'
  | 'Image'
  | 'TextInput'
  | 'ScrollView'
  | 'FlatList'
  | 'SectionList'
  | 'Switch'
  | 'TouchableHighlight'
  | 'TouchableOpacity'
  | 'StatusBar'
  | 'ActivityIndicator';

export interface OrigNativeEl {
  type: NativeElement;
  // depends on key names in copies context
  children: string[];
  index: number;
  state?: string[];
  copies?: string[];
}

export interface AppInterface {
  type: 'App';
  children: string[];
  state: string[];
  copies?: string[];
  index?: number;
  name?: string;
}

export interface OrigCustomComp {
  name: string;
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
  key: NativeElement | string;
}

export interface CopyNativeEl {
  name: string;
  type: NativeElement;
  parent: Parent;
  // depends on names of copies in copies context
  children: string[];
}

export interface CopyCustomComp {
  name: string;
  type: 'custom';
  // depends on key names in copies context
  parent: Parent;
  // ALL depend on user's custom component names in originals
  pointer: NativeElement | string;
  children(): (NativeElement | string)[];
  state(): (NativeElement | string)[];
}

export interface Originals { [key: string]: AppInterface | OrigNativeEl | OrigCustomComp }

export interface Copies { [key: string]: CopyNativeEl | CopyCustomComp }