import React, { useContext, useState } from 'react';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
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

  const tree = generateTree(
    originals['App'] as AppInterface,
    originals,
    copies
  );

  const makeNodes = (root) => {
    let newNode;
    let newEdge;
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
          id: root.name,
          type: 'default',
          data: { label: root.name },
          position: { x: 0, y: 0 },
        };
      } else {
        newNode = {
          id: root.name,
          type: 'output',
          data: { label: root.name },
          position: { x: 0, y: 0 },
        };
      }
    }
    treeNodes.push(newNode);
    root.children.forEach((node) => {
      newEdge = {
        id: `${root.name}-to-${node.name}`,
        source: root.name,
        target: node.name,
        type: 'smoothstep',
      };

      treeEdges.push(newEdge);
      return makeNodes(node);
    });
  };

  makeNodes(tree.root);
  console.log(treeNodes, treeEdges);

  // console.log(treeNodes);
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 140;
  const nodeHeight = 36;

  const getLayout = (treeNodes, treeEdges, direction = 'TB') => {
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
      node.targetPosition = 'top';
      node.sourcePosition = 'bottom';

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });
    return { treeNodes, treeEdges };
  };

  const { treeNodes: layoutedNodes, treeEdges: layoutedEdges } = getLayout(
    treeNodes,
    treeEdges
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // const onConnect = useCallback(
  //   (params) =>
  //     setEdges((eds) =>
  //       addEdge({ ...params, type: ConnectionLineType.SmoothStep }, eds)
  //     ),
  //   []
  // );

  return (
    <div id='tree-hierarchy'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      />
    </div>
  );
};

export default TreeHierarchy;
