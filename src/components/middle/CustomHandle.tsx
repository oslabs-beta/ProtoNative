import React, {useEffect} from 'react';
import { useUpdateNodeInternals, Handle, Position } from 'reactflow';


const CustomHandle = ({ nodeId, type, position}: any) => {
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
      updateNodeInternals(nodeId);
  }, [position]);

  let handlePosition;
  if (position === 'top') handlePosition = Position.Top;
  else if (position === 'bottom') handlePosition = Position.Bottom;
  else if (position === 'left') handlePosition = Position.Left;
  else handlePosition = Position.Right;

  return <Handle 
    type={type}
    position={handlePosition}
  />;
};

export default CustomHandle;