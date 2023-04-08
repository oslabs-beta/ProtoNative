import React, { useContext, useEffect, useState, useCallback} from 'react';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  ControlButton,
  Background
} from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';
import AppContext from '../../context/AppContext';
import generateTree from '../../utils/generateTree';
import { AppInterface } from '../../utils/interfaces';
import CustomNode from './CustomNode';

const nodeTypes = {
  stateNode: CustomNode,
}
const TreeHierarchy = (): JSX.Element => {
  const treeNodes: any[] = [];
  const treeEdges: any[] = [];
  const { originals, copies } = useContext(AppContext);
  const [tree, setTree] = useState(generateTree(originals['App'] as AppInterface, originals, copies))
  const [horizontal, setHorizontal] = useState(false)
  

  useEffect(() => {
    setTree(generateTree(originals['App'] as AppInterface, originals, copies))
  }, [originals])
  
  const nodeIndex: any = {};
  const makeNodes = (root) => {
    let newNode;
    let newEdge;

    if (root.data.state.length) {
      if (root.name === 'App') {
        newNode = {
          id: root.name,
          type: 'stateNode',
          data: {label: 'App', state: root.data.state, direction: horizontal, children: root.children.length, nodeId: root.name},
          position: {x: 0, y: 0},
        }
      } else {
        newNode = {
          id: root.hashedName + nodeIndex[root.name],
          type: 'stateNode',
          data: {label: root.name, state: root.data.state, direction: horizontal, children: root.children.length, nodeId: root.hashedName + nodeIndex[root.name]},
          position: {x: 0, y: 0},
        }
      }
    } else {
      if (root.name === 'App') {
          newNode = {
            id: root.name,
            type: 'input',
            data: { label: 'App' },
            position: { x: 0, y: 0 },
          };
      } else {
        if (root.children.length) {
          newNode = {
            id: root.hashedName + nodeIndex[root.name],
            type: 'default',
            data: { label: root.name },
            position: { x: 0, y: 0 },
          };
        } else {
          newNode = {
            id: root.hashedName + nodeIndex[root.name],
            type: 'output',
            data: { label: root.name },
            position: { x: 0, y: 0 },
          };
        }
      }
    }
    treeNodes.push(newNode);
    root.children.forEach((node) => {
      if (!nodeIndex.hasOwnProperty(node.name)) {
        nodeIndex[node.name] = 0;
      } else {
        nodeIndex[node.name]++;
      }
      if (root.name === 'App') {
        newEdge = {
          id: `App-to-${node.hashedName + nodeIndex[node.name]}`,
          source: 'App',
          target: node.hashedName + nodeIndex[node.name],
          type: 'smoothstep'
        };
      } else {
        newEdge = {
          id: `${root.hashedName +  nodeIndex[root.name].toString()}-to-${node.hashedName + nodeIndex[node.name].toString()}`,
          source: root.hashedName +  nodeIndex[root.name].toString(),
          target: node.hashedName +  nodeIndex[node.name].toString(),
          type: 'smoothstep'
        };
      }

      treeEdges.push(newEdge);
      return makeNodes(node);
    });
  };
  
  makeNodes(tree.root);


  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 160;
  const nodeHeight = 60;

  const getLayout = (treeNodes, treeEdges, horizontal: boolean) => {
    const direction = horizontal ? 'LR' : 'TB'
    dagreGraph.setGraph({ rankdir: direction });

    treeNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    treeEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    treeNodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = horizontal ? 'left' : 'top';
      node.sourcePosition = horizontal ? 'right' : 'bottom';

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });
    return { treeNodes, treeEdges };
  };

  const { treeNodes: layoutNodes, treeEdges: layoutEdges } = getLayout(
    treeNodes,
    treeEdges,
    horizontal,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);


  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [tree, horizontal])

  const onLayout = useCallback(
    (horizontal: boolean) => {
      const { treeNodes: layoutNodes, treeEdges: layoutEdges } = getLayout(
        nodes,
        edges,
       horizontal,
      );
      setHorizontal(horizontal);
      setNodes([...layoutNodes]);
      setEdges([...layoutEdges]);
    },
    [nodes, edges]
  );


  return (
    <div id='tree-hierarchy'
      style={{height: '95%', width: '95%'}}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={{ x: 0, y: 260, zoom: 1.8 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        >
        <Controls>
          <ControlButton onClick={() => onLayout(!horizontal)}>
            <div>
              {horizontal ? 
              <img className='direction' src={'./icons/vertical-arrows.png'} />: 
              <img className='direction' src={'./icons/horizontal-arrows.png'} />}
            </div>
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
};

export default TreeHierarchy;
