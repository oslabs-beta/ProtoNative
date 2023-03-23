import React from 'react';

const ElementBlock = (componentName: string, components: {}): JSX.Element => {
  const componentDef = components[componentName];

  const childElements: JSX.Element[] | null = componentDef.children.length ? componentDef.children.map((childName: string) => {
    if(components[childName].type !== 'custom') {
      return ElementBlock(childName, components)
    }
  }) : null

  const elementTitle: string = components[componentName].type === 'custom' ? components[componentName].pointer : components[componentName].type;

  return (
    <div style={{border: '1px solid black'}} className='element'>
      <p>{elementTitle}</p>
      {childElements}
    </div>
  );
}



export default ElementBlock;
