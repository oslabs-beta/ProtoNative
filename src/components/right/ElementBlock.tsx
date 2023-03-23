import React from 'react';

const ElementBlock = (componentName, components, location): JSX.Element => {
  const componentDef = components[componentName];
  
  let childElements = null;
  let children = null;

  //depending on if the current component is custom or not, we must get children differently
  if (componentDef.type === 'custom' && location==='app') children = componentDef.children();
  else {children = componentDef.children};

  if (children.length) {
    const arr = [];

    children.forEach((childName) => {
 
      if (location === 'app' && components[childName].type === 'custom'){
        arr.push(ElementBlock(childName, components, 'app'));
      }
      else if (location ==='details' && components[childName].type !== 'custom') {
        arr.push(ElementBlock(childName, components, 'details'));
      }
    })
    childElements = arr;
  }
  // const childElements = componentDef.children.length
  //   ? componentDef.children.map(childName => ElementBlock(childName, components))
  //   : null;

  return (
    <div style={{border: '1px solid black'}} className='element'>
      <p>
        {components[componentName].type === 'custom'
          ?components[componentName].pointer
          :components[componentName].type}
      </p>
      {childElements}
    </div>
  );
}



export default ElementBlock;
