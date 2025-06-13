'use client';

import React, { useCallback, useState } from 'react';
import {
    Background,
    Edge,
    Node,
    NodeProps,
    Position,
    ReactFlow,
    addEdge,
    useEdgesState,
    useNodesState,
    Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import TriggerAppSelector from './TriggerAppSelector';
import TriggerAppConfigPanel from './TriggerAppConfigPanel';

type CustomNodeData = {
  label: string; // Ensure label is a required property
  kind: 'trigger' | 'action';
  appConfig?: {
    app?: string;
    event?: string;
    eventLabel?: string;
  };
  event?: string;
  subtitle?: string;
  onAdd?: (id: string) => void;
};


const VerticalNode = ({ data, id }: NodeProps<CustomNodeData>) => {
    const isAction = data.label === 'Action';
    return (
        <div style={{
            position: 'relative',
            border: '1px solid #2f2f2f',
            borderRadius: 12,
            background: 'linear-gradient(to bottom, #1a1a1a, #0f0f0f)',
            color: '#e5e5e5',
            width: 280,
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 500,
            padding: '24px 10px 20px',
            fontFamily: 'monospace',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{
                position: 'absolute',
                top: 6,
                left: 6,
                backgroundColor: '#1d4ed8',
                color: '#fff',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: 6,
                fontWeight: 600
            }}>
                {data.label}
            </div>
            {(data.label === 'Trigger' || data.label === 'Action') && (
                <div style={{ fontSize: '12px', color: '#999', marginTop: 10 }}>
                    {data.label === 'Trigger' ? 'Select an event to start your zap' : 'Select an event for your zap to perform'}
                </div>
            )}
            <Handle type="source" position={Position.Bottom} id="a" style={{ background: '#16a34a' }} />
            <Handle type="target" position={Position.Top} id="b" style={{ background: '#1d4ed8' }} />
            {isAction && (
                <button onClick={(e) => { e.stopPropagation(); data.onAdd?.(id); }} title="Add Action" style={{
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1d4ed8',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 'bold',
                    lineHeight: '18px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                }}>+</button>
            )}
        </div>
    );
};

const nodeTypes = { custom: VerticalNode };

export default function FlowEditor() {
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [showConfigPanel, setShowConfigPanel] = useState(false);
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([
  {
    id: '1',
    type: 'custom',
    position: { x: 200, y: 100 },
    data: {
      label: 'Trigger', // Ensure label is optional in the type
      kind: 'trigger',
      appConfig: {},
      subtitle: '',
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 200, y: 300 },
    data: {
      label: 'Action',
      kind: 'action',
      appConfig: {},
      subtitle: '',
    },
  },
]);



    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#666', strokeWidth: 1.5 } },
    ]);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
        setSelectedNodeId(node.id);
        setSelectedApp(node.data.appConfig?.app ?? null);
        if (node.data.kind === 'trigger') {
            const isConfigured = !!node.data.appConfig?.app;
            if (isConfigured) setShowConfigPanel(true);
            else setShowTriggerDialog(true);
        }
    }, []);

    const addActionNode = useCallback((parentId: string) => {
        const parentNode = nodes.find((node) => node.id === parentId);
        if (!parentNode) return;
        const newId = uuidv4();
        const newNode: Node<CustomNodeData> = {
            id: newId,
            type: 'custom',
            data: {
                label: 'Action',
                kind: 'action',
                appConfig: {},
                subtitle: '',
                onAdd: addActionNode,
            },
            position: { x: parentNode.position.x, y: parentNode.position.y + 120 },
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, {
            id: `e${parentId}-${newId}`,
            source: parentId,
            target: newId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#666', strokeWidth: 1.5 }
        }]);
    }, [nodes, setNodes, setEdges]);

    const nodesWithActions = nodes.map((n) => ({
        ...n,
        data: {
            ...n.data,
            onAdd: addActionNode
        }
    }));

    return (
        <>
            <ReactFlow
                nodes={nodesWithActions}
                edges={edges}
                onNodeClick={handleNodeClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds))}
                nodeTypes={nodeTypes}
                fitView={false}
                defaultViewport={{ zoom: 0.96, x: 0, y: 0 }}
                className="bg-black text-white"
            >
                <Background color="#111" gap={16} />
            </ReactFlow>

            {showTriggerDialog && (
                <TriggerAppSelector
                    onSelectApp={(app) => {
                        setSelectedApp(app);
                        setShowTriggerDialog(false);
                        setShowConfigPanel(true);
                        setNodes((prevNodes) =>
                            prevNodes.map((node) =>
                                node.id === selectedNodeId
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            label: app,
                                            kind: 'trigger',
                                            appConfig: { app },
                                        },
                                    }
                                    : node
                            )
                        );
                    }}
                    onClose={() => setShowTriggerDialog(false)}
                />
            )}

            {showConfigPanel && selectedApp && selectedNodeId && (
                <TriggerAppConfigPanel
                    app={selectedApp}
                    savedData={nodes.find((n) => n.id === selectedNodeId)?.data?.appConfig || {}}
                    onClose={() => setShowConfigPanel(false)}
                    onProceed={() => setShowConfigPanel(false)}
                    onChange={(data) => {
                        setNodes((prevNodes) =>
                            prevNodes.map((node) =>
                                node.id === selectedNodeId
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            appConfig: {
                                                ...node.data.appConfig,
                                                ...data,
                                            },
                                            label: data.app || node.data.label,
                                            event: data.event || node.data.event,
                                            subtitle: data.eventLabel || node.data.subtitle,
                                        },
                                    }
                                    : node
                            )
                        );
                    }}
                />
            )}
        </>
    );
}
