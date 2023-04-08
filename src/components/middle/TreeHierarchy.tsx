import React, { useContext, useEffect, useState} from 'react';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  SetViewport
} from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';
import AppContext from '../../context/AppContext';
import generateTree from '../../utils/generateTree';
import { AppInterface } from '../../utils/interfaces';

const TreeHierarchy = (): JSX.Element => {
  const treeNodes: any[] = [];
  const treeEdges: any[] = [];
  const { originals, copies } = useContext(AppContext);
  const [tree, setTree] = useState(generateTree(originals['App'] as AppInterface, originals, copies))

  const nodeIndex: any = {};

  useEffect(() => {
    setTree(generateTree(originals['App'] as AppInterface, originals, copies))
  }, [originals])

  console.log(tree.root)
  const makeNodes = (root) => {
    let newNode;
    let newEdge;

    if (root.name === 'App') {
      newNode = {
        id: root.name,
        type: 'input',
        data: { label: 'App' },
        position: { x: 0, y: 0 },
        width: 80,
        height: 80,
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
        };
      } else {
        newEdge = {
          id: `${root.hashedName +  nodeIndex[root.name].toString()}-to-${node.hashedName + nodeIndex[node.name].toString()}`,
          source: root.hashedName +  nodeIndex[root.name].toString(),
          target: node.hashedName +  nodeIndex[node.name].toString(),
        };
      }

      treeEdges.push(newEdge);
      return makeNodes(node);
    });
  };
  
  makeNodes(tree.root);
  
    console.log(treeNodes)
    console.log(treeEdges)

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 140;
  const nodeHeight = 36;

  const getLayout = (treeNodes, treeEdges, direction = 'LR') => {
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
      node.targetPosition = 'left';
      node.sourcePosition = 'right';

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
    treeEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);


  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [tree])

  // const onLayout = useCallback(
  //   (direction) => {
  //     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  //       nodes,
  //       edges,
  //       direction
  //     );

  //     setNodes([...layoutedNodes]);
  //     setEdges([...layoutedEdges]);
  //   },
  //   [nodes, edges]
  // );



  return (
    <div id='tree-hierarchy'
      style={{height: '95%', width: '95%'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={{ x: 0, y: 260, zoom: 1.8 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        >
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TreeHierarchy;