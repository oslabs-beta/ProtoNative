import React from 'react';
import CustomHandle from './CustomHandle';


const CustomNode = ({ data }):JSX.Element => {


  const state = data.state.map((ele: string, idx: number) => {
    return <li key={idx}>{ele}</li>
  })

  return (
    <div className="custom-node">
      {data.label === 'App' ? null : data.direction ? 
      <CustomHandle nodeId={data.nodeId} type='target' position='left'  /> : 
      <CustomHandle  nodeId={data.nodeId} type='target' position='top'  /> }
      <div>
        <p>{data.label}</p>
        <ul>
          {state}
        </ul>
      </div>
       {data.children > 0 ? data.direction ? 
      <CustomHandle nodeId={data.nodeId} type="source" position='right'  /> : 
      <CustomHandle  nodeId={data.nodeId} type="source" position='bottom' /> : null }
    </div>
  );
}

export default CustomNode;