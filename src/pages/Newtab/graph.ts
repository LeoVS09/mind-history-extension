import { NodeDefinition, EdgeDefinition } from "cytoscape"
import { Graph } from "graphlib"

export function setupGraphEngine(nodes: Array<NodeDefinition>, edges: Array<EdgeDefinition>): Graph {
    const g = new Graph()

    for (const node of nodes) {
        g.setNode(node.data.id!, node.data)
    }

    for (const edge of edges) {
        g.setEdge(edge.data.source, edge.data.target, edge.data)
    }

    return g
}

const HIDDEN_CHILDREN_NAMESPACE = 'hidden_children'

export function setupCyHooks(cy: cytoscape.Core, graph: Graph): void {
    // on tap or left mouse click
    cy.on('tap', 'node', function () {
        // @ts-ignore
        const self = this as cytoscape.NodeCollection & cytoscape.SingularData
        toggleChildren(self)
    })

    // on right mouse click or two finger tap
    cy.on('cxttap', 'node', function () {
        // @ts-ignore
        const self = this as cytoscape.NodeCollection & cytoscape.SingularData
        openPage(self)
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
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE).restore()
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE, null)
}

function openPage(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    const nodeUrl = nodes.id()
    window.open(nodeUrl)
}