import React, { useContext, useEffect, useState, useCallback} from 'react';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  ControlButton,
} from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';
import AppContext from '../../context/AppContext';
import generateTree from '../../utils/generateTree';
import { AppInterface } from '../../utils/interfaces';
import { Tree, TreeNode } from '../../utils/generateTree';
import CustomNode from './CustomNode';

const nodeTypes = {
  stateNode: CustomNode,
}

type CustomFlowNodesType = {
  id: string,
  type: string,
  data: {
    label: string,
    state: string[],
    direction: boolean,
    children: number,
    nodeId: string
  }
  position: {x: number, y: number}
}

type DefaultFlowNodesType = {
  id: string,
  type: string,
  data: {}
  position: {x: number, y: number}
}

type FlowEdges = {
  id: string,
  source: string,
  target: string,
  type: string,
}

const TreeHierarchy = (): JSX.Element => {
  const { originals, copies } = useContext(AppContext);
  const [tree, setTree] = useState<Tree>(generateTree(originals['App'] as AppInterface, originals, copies))
  const [horizontal, setHorizontal] = useState(false)
  
  
  useEffect(() => {
    setTree(generateTree(originals['App'] as AppInterface, originals, copies))
  }, [originals])
  
  const treeNodes: CustomFlowNodesType | DefaultFlowNodesType[] = [];
  const treeEdges: FlowEdges[] = [];
  const nodeIndex: {[key: string]: number} = {};

  //generate nodes and edges for React Flow tree hierarchy
  const makeNodes = (root: TreeNode) => {
    let newNode: CustomFlowNodesType | DefaultFlowNodesType;
    let newEdge: FlowEdges;

    //if component has state, type is custom state node
    if (root.data.state.length) {
      //if the tree node is App, id doesn't have to be hashed
      if (root.name === 'App') {
        newNode = {
          id: root.name,
          type: 'stateNode',
          data: {label: 'App', state: root.data.state, direction: horizontal, children: root.children.length, nodeId: root.name},
          position: {x: 0, y: 0},
        }
      }
      //normal components have to be hashed 
      else {
        newNode = {
          id: root.hashedName + nodeIndex[root.name],
          type: 'stateNode',
          data: {label: root.name, state: root.data.state, direction: horizontal, children: root.children.length, nodeId: root.hashedName + nodeIndex[root.name]},
          position: {x: 0, y: 0},
        }
      }
    } 
    //else, type is normal nodes (input, default, output)
    else {
      //app is always an input node
      if (root.name === 'App') {
          newNode = {
            id: root.name,
            type: 'input',
            data: { label: 'App' },
            position: { x: 0, y: 0 },
          };
      } else {
        //if component has children, node is default
        if (root.children.length) {
          newNode = {
            id: root.hashedName + nodeIndex[root.name],
            type: 'default',
            data: { label: root.name },
            position: { x: 0, y: 0 },
          };
        } 
        //otherwise, node is output
        else {
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

    //iterate through each child of root, make edge, recursively call function to make nodes for all the children
    root.children.forEach((node: TreeNode) => {
      //keeps track of hashing to ensure components are unique
      if (!nodeIndex.hasOwnProperty(node.name)) {
        nodeIndex[node.name] = 0;
      } else {
        nodeIndex[node.name]++;
      }
      //if root is app, edge source should be App
      if (root.name === 'App') {
        newEdge = {
          id: `App-to-${node.hashedName + nodeIndex[node.name].toString()}`,
          source: 'App',
          target: node.hashedName + nodeIndex[node.name].toString(),
          type: 'smoothstep'
        };
      }
      //otherwise, the source is the hashed name + the index 
      else {
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

  const nodeWidth: number = 160;
  const nodeHeight: number = 60;

  //set the positioning of the nodes so they render in different places.
  const getLayout = (treeNodes: any, treeEdges: any, horizontal: boolean) => {
    const direction = horizontal ? 'LR' : 'TB'
    dagreGraph.setGraph({ rankdir: direction });

    treeNodes.forEach((node: any) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    treeEdges.forEach((edge: any) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    //check the direction of the tree hierarchy (vertical vs horizontal)
    treeNodes.forEach((node: any) => {
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

  //store the nodes with their positions in layoutNodes and layoutEdges
  const { treeNodes: layoutNodes, treeEdges: layoutEdges } = getLayout(
    treeNodes,
    treeEdges,
    horizontal,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);


  useEffect(() => {
    //update the nodes based on the new tree + direction
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [tree, horizontal])

  //changes the direction
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
