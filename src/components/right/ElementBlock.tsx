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

  let elementTitle;
  if (components[componentName].type === 'custom') elementTitle = components[componentName].pointer;
  else elementTitle = components[componentName].type

  return (
    <div style={{border: '1px solid black'}} className='element'>
      <p>{elementTitle}</p>
      {childElements}
    </div>
  );
}



export default ElementBlock;
