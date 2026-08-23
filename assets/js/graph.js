let network = null;

function buildNodes(nodes) {
    return new vis.DataSet(
        nodes.map((node) => {
            const base = {
                id: node.id,
                label: node.label,

                // Metadados
                type: node.type,
                path: node.path,
                sha: node.sha,

                font: {
                    face: 'Inter, system-ui, sans-serif',
                    color: '#E5E7EB',
                    size: 14
                },

                borderWidth: 0,
                shadow: false
            };

            switch (node.type) {
                case 'root':
                    return {
                        ...base,
                        shape: 'dot',
                        size: 30,
                        color: {
                            background: '#FFFFFF',
                            border: '#FFFFFF',
                            highlight: {
                                background: '#FFFFFF',
                                border: '#FFFFFF'
                            }
                        },
                        font: {
                            ...base.font,
                            color: '#FFFFFF',
                            size: 24,
                            bold: true
                        },
                        mass: 6
                    };

                case 'folder':
                    return {
                        ...base,
                        shape: 'dot',
                        size: 18,
                        color: {
                            background: '#2563EB',
                            border: '#3B82F6',
                            highlight: {
                                background: '#3B82F6',
                                border: '#60A5FA'
                            }
                        },
                        font: {
                            ...base.font,
                            size: 16,
                            bold: true
                        },
                        mass: 3
                    };

                default:
                    return {
                        ...base,
                        shape: 'dot',
                        size: 10,
                        color: {
                            background: '#E5E7EB',
                            border: '#F9FAFB',
                            highlight: {
                                background: '#FFFFFF',
                                border: '#FFFFFF'
                            }
                        },
                        mass: 1
                    };
            }
        })
    );
}

function buildEdges(edges) {
    return new vis.DataSet(
        edges.map((edge) => ({
            from: edge.from,
            to: edge.to,
            color: {
                color: 'rgba(148, 163, 184, 0.28)',
                highlight: '#60A5FA',
                hover: '#93C5FD'
            },
            width: 1,
            selectionWidth: 2,
            smooth: {
                enabled: true,
                type: 'dynamic'
            }
        }))
    );
}

function getOptions() {
    return {
        autoResize: true,
        width: '100%',
        height: '100%',

        nodes: {
            scaling: {
                min: 8,
                max: 36
            }
        },

        edges: {
            physics: true
        },

        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',

            forceAtlas2Based: {
                gravitationalConstant: -90,
                centralGravity: 0.01,
                springLength: 160,
                springConstant: 0.05,
                damping: 0.9,
                avoidOverlap: 1
            },

            stabilization: false,

            timestep: 0.35,
            adaptiveTimestep: true
        },

        interaction: {
            hover: true,
            hoverConnectedEdges: true,
            selectConnectedEdges: false,
            dragNodes: true,
            dragView: true,
            zoomView: true,
            multiselect: false,
            navigationButtons: false,
            keyboard: true
        },

        layout: {
            improvedLayout: true
        }
    };
}

function registerEvents(networkInstance, nodesDataSet) {
    networkInstance.on('dragStart', (params) => {
        if (params.nodes.length > 0) {
            networkInstance.physics.options.enabled = true;
        }
    });

    networkInstance.on('dragEnd', () => {
        networkInstance.physics.options.enabled = true;
    });

    networkInstance.on('hoverNode', (params) => {
        const node = nodesDataSet.get(params.node);

        if (typeof window.handleNodeHover === 'function') {
            window.handleNodeHover(node);
        }
    });

    networkInstance.on('blurNode', () => {
        if (typeof window.handleNodeBlur === 'function') {
            window.handleNodeBlur();
        }
    });

    networkInstance.on('click', (params) => {

        if (params.nodes.length === 0) return;

        console.log("ID:", params.nodes[0]);

        const node = nodesDataSet.get(params.nodes[0]);

        console.log("NODE:", node);

    });

    networkInstance.on('doubleClick', (params) => {
        if (params.nodes.length === 0) return;

        networkInstance.focus(params.nodes[0], {
            scale: 1.2,
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    });
}

function createGraph(elements) {
    const container = document.getElementById('cy');

    if (!container) {
        throw new Error('Graph container #cy not found');
    }

    if (network) {
        network.destroy();
        network = null;
    }

    const nodes = buildNodes(elements.nodes);
    const edges = buildEdges(elements.edges);

    network = new vis.Network(
        container,
        { nodes, edges },
        getOptions()
    );

    registerEvents(network, nodes);

    network.once('afterDrawing', () => {
        const root = elements.nodes.find((n) => n.type === 'root');

        if (root) {
            network.focus(root.id, {
                scale: 0.9,
                animation: {
                    duration: 800,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
    });

    return network;
}

function getNetwork() {
    return network;
}

function fitGraph() {
    if (!network) return;

    network.fit({
        animation: {
            duration: 600,
            easingFunction: 'easeInOutQuad'
        }
    });
}


function focusNode(nodeId, scale = 1.2) {
    if (!network) return;

    network.focus(nodeId, {
        scale,
        animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
        }
    });

    network.selectNodes([nodeId]);
}