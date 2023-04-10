import {
  OrigNativeEl,
  AppInterface,
  OrigCustomComp,
  CopyNativeEl,
  CopyCustomComp,
  Originals,
  Copies
} from './interfaces';

declare const prettier: any;
declare const prettierPlugins: any;

/**
 * @method capitalizeFirst
 * @description - capitalizes first letter of input string
 * @input - string
 * @output - string with capitalized first letter
 */
const capitalizeFirst = (str: string): string => {
  if (str.length === 0) return '';
  return str[0].toUpperCase() + str.slice(1);
};

/**
 * @method importReact
 * @description - returns the main react import statement, with hooks if the component uses them
 */
const importReact = (component: OrigCustomComp | AppInterface): string => {
  let hooksToImport = '';
  if (component.state.length !== 0) {
    hooksToImport += 'useState';
  }
  return `import React ${hooksToImport !== '' ? `, { ${hooksToImport} }` : ''} from 'react';\n`;
};

/**
 * @method isDoubleTagElement
 * @description - checks whether element is a double tag element (i.e. if it can have children)
 * @input - string of the name of element
 * @output - boolean -> true if element is a double tag element, false if not
 */
export const isDoubleTagElement = (elementName: string): boolean => {
  const DOUBLE_TAG_ELEMENTS: {[key: string]: boolean} = {
    View: true,
    Text: true,
    ScrollView: true,
    TouchableHighlight: true,
    TouchableOpacity: true,
  };
  return DOUBLE_TAG_ELEMENTS[elementName] !== undefined;
};

/**
 * @method isCopyCustomComp
 * @description - checks whether comp is of interface CopyCustomComp
 * @input - either CopyNativeEl or CopyCustomComp (anything in copies)
 * @output - boolean -> true if input is of interface CopyCustomComp
 * (technically, output is a type guard -> lets typescript know that if this function returns true, the element passed in is of interface CopyCustomComp)
 */
export const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method isOrigCustomComp
 * @description - checks whether comp is of interface OrigCustomComp
 * @input - either OrigCustomComp or OrigNativeEl or AppInterface (anything in originals)
 * @output - boolean -> true if input is of interface OrigCustomComp
 * (technically, output is a type guard -> lets typescript know that if this function returns true, the element passed in is of interface OrigCustomComp)
 */
export const isOrigCustomComp = (comp: OrigCustomComp | OrigNativeEl | AppInterface): comp is OrigCustomComp => {
  return comp.type === 'custom';
}

/**
 * @method addState
 * @description - generates the strings for state variables
 * @input - array of the names of the state variables as strings
 * @output - all declarations for state variables
 */
const addState = (stateNames: string[]): string => {
  let stateVariables: string = '';
  for (const stateVar of stateNames) {
    stateVariables += `const [${stateVar}, set${capitalizeFirst(stateVar)}] = useState(null);\n`;
  }
  return stateVariables;
};

/**
 * @method addNativeImports
 * @description generates the import statement for importing react native core components
 * @input array containing the native core components to be imported as strings
 * @output import statement for importing the native core components passed in 
 */
const addNativeImports = (toImport: string[]): string => {
  let componentsToImport: string = '';
  for (const nativeElement of toImport) {
    componentsToImport += `${nativeElement},`;
  }
  // take off last comma
  return `import { ${componentsToImport.slice(0, -1)} } from 'react-native';\n`;
};

/**
 * @method addCustomCompImport
 * @description generates the import statement for importing custom components
 * @input name of the custom component as string, boolean to check whether the current component in generateCustomComponentCode is App
 * @output import statement for importing the custom component 
 */
const addCustomCompImport = (toImport: string, isCompApp: boolean): string => {
  return `import ${toImport} from '.${isCompApp ? '/Components' : ''}/${toImport}';\n`;
};

/**
 * @method addCustomCompExport
 * @description generates the export statement for exporting custom components
 * @input name of the custom component as string
 * @output export statement for exporting the custom component 
 */
const addCustomCompExport = (toExport: string): string => {
  return `export default ${toExport};\n`;
};

type CompCode = {
  JSXcode: string,
  allToImport: string[]
}

/**
 * @method generateComponentCode
 * @description generates the necessary code for a custom component or native core component in copies context (and gathers all necessary imports for that component), recursively goes through its children
 * @input component of interface CopyNativeEl or CopyCustomComp (any component in copies context)
 * @output string of the code necessary for the component passed in
 */
const generateComponentCode = (comp: CopyNativeEl | CopyCustomComp, originals: Originals, copies: Copies): CompCode => {

  const toImport: string[] = [];

  const getCompCode = (comp: CopyNativeEl | CopyCustomComp) => {

    const currElement: string = isCopyCustomComp(comp) ? comp.pointer : comp.type;

    let necessaryProps: string = '';
    if (currElement === 'Button') necessaryProps += `title=''`;
    else if (currElement === 'SectionList') necessaryProps += `sections={[]}`;
    else if (currElement === 'TextInput') necessaryProps += `value={''}`;

    const originalsComp = originals[comp.pointer] as OrigCustomComp;
    const componentChildren: string[] = isCopyCustomComp(comp) ? originalsComp.children : comp.children;

    if (componentChildren.length === 0 || comp.type === 'custom') {
      isCopyCustomComp(comp) ? toImport.push(comp.pointer) : toImport.push(comp.type);
      return isDoubleTagElement(currElement)
        ? `<${currElement} ${necessaryProps}>
          </${currElement} ${necessaryProps}>`
        : `<${currElement} ${necessaryProps}/>`;
    }

    if (!isCopyCustomComp(comp)) {
      toImport.push(comp.type);
    }

    let childrenNodes: string = '';
    for (const child of componentChildren) {
      const childInCopies = copies[child];
      isCopyCustomComp(childInCopies) ? toImport.push(childInCopies.pointer) : toImport.push(childInCopies.type);
      childrenNodes += `${getCompCode(childInCopies)}\n`;
    }
    return  `<${currElement} ${necessaryProps}> 
                ${childrenNodes} 
          </${currElement} ${necessaryProps}>`;
  }

  return { JSXcode: getCompCode(comp), allToImport: toImport };
};

/**
 * @method generateCustomComponentCode
 * @description generates all necessary code for a custom component in originals context
 * @input the custom component to generate the code for
 * @output string of the code necessary for the custom component passed in
 */
const generateCustomComponentCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  // store to save all react native core components and custom components to be imported
  // always import View 
  const allImports: Set<string> = new Set(['View']);
  // returnedComponentCode will contain everything that goes into the return statement of component
  let returnedComponentCode: string = '';
  // generate code for JSX element in return statement
  // get all native/ custom components we need
  for (const child of component.children) {
    const foundChild: CopyNativeEl | CopyCustomComp = copies[child];

    // generate all code for the JSX element that will be returned, and get all imports necessary for the child
    const { JSXcode, allToImport } = generateComponentCode(foundChild, originals, copies);

    returnedComponentCode += JSXcode;

    allToImport.forEach(compToImport => allImports.add(compToImport));
  }
  // generate all import statements
  let importStatements: string = '';
  // import react and all hooks necessary
  importStatements += importReact(component);

  // loop through all imports and determine which imports are react native and which imports and custom components and save them separately
  const allNativeImports: string[] = [];
  let allCustomImports: string = '';

  for (const toImport of allImports.values()) {
    if (isOrigCustomComp(originals[toImport])) {
      allCustomImports += component.type === 'App' ? addCustomCompImport(toImport, true) : addCustomCompImport(toImport, false)
    } else {
      allNativeImports.push(toImport);
    }
  }
  // add all react native imports
  importStatements += addNativeImports(allNativeImports);
  // add all custom component imports
  importStatements += allCustomImports;
  // generate all state variables
  const stateVariables: string = addState(component.state);

  return `
      ${importStatements}
      const ${component.type === 'App' ? component.type : component.name} = () => {
        ${stateVariables}
        return (
          <View>
            ${returnedComponentCode}
          </View>
        );
      };\n
      ${addCustomCompExport(component.type === 'App' ? component.type : component.name)}
  `;
};

const formatCode = (code: string) => {
  return prettier.format(code, {
    parser: 'babel',
    plugins: prettierPlugins,
    jsxBracketSameLine: true,
    singleQuote: true
  });
}

export const formattedCompCode = (component: OrigCustomComp | AppInterface, originals: Originals, copies: Copies): string => {
  return formatCode(generateCustomComponentCode(component, originals, copies));
}