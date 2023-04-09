import React, {useEffect} from 'react';
import { useUpdateNodeInternals, Handle, Position, HandleType } from 'reactflow';


type Props = {
  nodeId: string,
  type: HandleType,
  position: string
}

//customHandle for tree orientation changes
const CustomHandle = ({ nodeId, type, position}: Props): JSX.Element => {
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
      updateNodeInternals(nodeId);
  }, [position]);

  let handlePosition: Position;
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