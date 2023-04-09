import React, {useState} from 'react';
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

//custom node for stateful components

const CustomNode = ({ data }: Props):JSX.Element => {
  const [showState, setShowState] = useState(false);
  //create list element for each state
  const state: JSX.Element[] = data.state.map((ele: string, idx: number) => {
    return <li key={idx}>{ele}</li>
  })

  
  return (
    <div className="custom-node-container">
      {/* create input node for App, otherwise create handle at top */}
      {data.label === 'App' ? null : data.direction ? 
      <CustomHandle nodeId={data.nodeId} type='target' position='left'  /> : 
      <CustomHandle  nodeId={data.nodeId} type='target' position='top'  /> }
      <div className='custom-node'>
        <p>{data.label}</p>
        <div className='state-container'>
          <img className='state-button-img' src={'./icons/state-info.png'} onClick={() => setShowState(!showState)}/>
          {showState && <ul>
            {state}
          </ul>}
        </div>
      </div>
      {/* create output node if no children, else create handle at bottom */}
       {data.children ? data.direction ? 
      <CustomHandle nodeId={data.nodeId} type="source" position='right'  /> : 
      <CustomHandle  nodeId={data.nodeId} type="source" position='bottom' /> : null }
    </div>
  );
}

export default CustomNode;