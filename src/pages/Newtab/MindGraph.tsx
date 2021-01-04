import { Core, EdgeDefinition, NodeDefinition } from 'cytoscape'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { PageVisit } from '../../history'
import { PageDataDictanory } from '../../types'
import { Graph } from 'graphlib'
export interface MindGraphProps {
    pages: PageDataDictanory
    history: Array<PageVisit>
}

// TODO: calculate width and height on start
const MAX_WIDTH = 1440
const MAX_HEIGHT = 720

export const MindGraph: React.FC<MindGraphProps> = ({ pages, history }) => {
    let nodes = mapToNodes(pages)

    const edges = mapToEdges(history, Object.keys(pages))

    nodes.forEach(node => {
        node.data.score = countEdges(node, edges)
    })
    nodes = nodes.filter(node => node.data.score !== 0)

    const elements = CytoscapeComponent.normalizeElements({
        nodes,
        edges
    })

    console.log({ elements })

    const g = setupGraphEngine(nodes, edges)

    return (
        <div>
            <h1>Mind Graph</h1>
            <p>Found items {elements.length}</p>

            {elements.length && (
                <CytoscapeComponent
                    elements={elements}
                    layout={{
                        name: 'cose',
                        randomize: true,
                    }}
                    style={{ width: `${MAX_WIDTH}px`, height: `${MAX_HEIGHT}px` }}
                    stylesheet={graphStyles}
                    cy={core => setupCyHooks(core, g)}
                />)}
        </div>
    )

}

function setupGraphEngine(nodes: Array<NodeDefinition>, edges: Array<EdgeDefinition>): Graph {
    const g = new Graph()

    for (const node of nodes) {
        g.setNode(node.data.id!, node.data)
    }

    for (const edge of edges) {
        g.setEdge(edge.data.source, edge.data.target, edge.data)
    }

    return g
}

function mapToNodes(pages: PageDataDictanory): Array<NodeDefinition> {
    const result: Array<NodeDefinition> = []

    for (const url in pages) {
        const page = pages[url]

        result.push({
            data: {
                id: url,
                label: page.title || url,
                favIconUrl: page.favIconUrl,
            },
            // position: { x: getRandomInt(0, MAX_WIDTH), y: getRandomInt(0, MAX_HEIGHT) }
        })
    }

    return result
}

const mapToEdges = (history: Array<PageVisit>, existingUrls: Array<string>): Array<EdgeDefinition> => history
    .filter(visit => !!visit.from)
    .filter(visit => existingUrls.includes(visit.from!) && existingUrls.includes(visit.to))
    .map(visit => ({
        data: {
            id: `${visit.from}->${visit.to}`,
            source: visit.from!,
            target: visit.to,
        }
    }))

const countEdges = (node: NodeDefinition, edges: Array<EdgeDefinition>): number => {
    let count = 0
    for (const edge of edges) {
        if (edge.data.source === node.data.id || edge.data.target === node.data.id) {
            count++
        }
    }

    return count
}

// function getRandomInt(min: number, max: number): number {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

const graphStyles = [{
    "selector": "core",
    "style": {
        "selection-box-color": "#AAD8FF",
        "selection-box-border-color": "#8BB0D0",
        "selection-box-opacity": "0.5"
    }
}, {
    "selector": "node",
    "style": {
        "width": "mapData(score, 1, 3, 30, 60)",
        "height": "mapData(score, 1, 3, 30, 60)",
        "label": "data(label)",
        "font-size": "14px",
        "text-valign": "bottom",
        "text-halign": "center",
        "background-color": "#777",
        "background-image": 'data(favIconUrl)',
        "color": "#fff",
        "overlay-padding": "6px",
        "z-index": "10"
    }
}, {
    "selector": "edge",
    "style": {
        'width': 1,
        "curve-style": "haystack",
        "haystack-radius": "0.1",
        "opacity": "0.4",
        "line-color": "blue",
        "overlay-padding": "5px"
    }
},
]

const HIDDEN_CHILDREN_NAMESPACE = 'hidden_children'

function setupCyHooks(cy: Core, graph: Graph): void {
    cy.on('tap', 'node', function () {
        // @ts-ignore
        const self = this as cytoscape.NodeCollection & cytoscape.SingularData;
        toggleChildren(self)
    })

    const roots = graph.sources()
    console.log('roots', roots)

    for (const root of roots) {
        const node = cy.getElementById(root)
        toggleChildren(node)
    }
}

function toggleChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    if (nodes.scratch(HIDDEN_CHILDREN_NAMESPACE) == null) {
        // Save node data and remove
        hideChildren(nodes)
        return
    }

    // Restore the removed nodes from saved data
    showChildren(nodes)
}

function hideChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE, nodes.successors().targets().remove())
}

function showChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE).restore();
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE, null);
}