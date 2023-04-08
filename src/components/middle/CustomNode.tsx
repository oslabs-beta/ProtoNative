import React from 'react';
import CustomHandle from './CustomHandle';

type Props = {
  data: {
    label: string,
    state: string[],
    direction: boolean,
    children: number,
    nodeId: string
  }
}

const CustomNode = ({ data }: Props):JSX.Element => {


  const state: JSX.Element[] = data.state.map((ele: string, idx: number) => {
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
       {data.children ? data.direction ? 
      <CustomHandle nodeId={data.nodeId} type="source" position='right'  /> : 
      <CustomHandle  nodeId={data.nodeId} type="source" position='bottom' /> : null }
    </div>
  );
}

export default CustomNode;