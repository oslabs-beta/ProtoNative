import React from 'react';

const ElementBlock = (componentName, components): JSX.Element => {
  const componentDef = components[componentName];
  
  let childElements = null;;

  if (componentDef.children.length) {
    const arr = [];
    componentDef.children.forEach((childName) => {
      if (components[childName].type !== 'custom') {
        arr.push(ElementBlock(childName, components));
      }
    })
    childElements = arr;
  }
  // const childElements = componentDef.children.length
  //   ? componentDef.children.map(childName => ElementBlock(childName, components))
  //   : null;

  return (
    <div style={{border: '1px solid black'}} className='element'>
      <p>{components[componentName].type}</p>
      {childElements}
    </div>
  );
}



export default ElementBlock;
