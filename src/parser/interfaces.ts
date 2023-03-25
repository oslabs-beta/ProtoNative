export type NativeElements =
  | 'App'
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
  type: NativeElements;
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
  key: NativeElements | string;
}

export interface CopyNativeEl {
  name: string;
  type: NativeElements;
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
  pointer: NativeElements | string;
  children(): (NativeElements | string)[];
  state(): (NativeElements | string)[];
}
