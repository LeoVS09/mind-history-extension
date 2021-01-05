import { NodeDefinition, EdgeDefinition } from "cytoscape"
import { Graph } from "graphlib"
import * as H from 'history'
import qs from "query-string"

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

export function setupCyHooks(
    cy: cytoscape.Core,
    graph: Graph,
    historyManager: H.History<H.LocationState>
): void {
    console.log('Setup cytoscape hooks...')
    // on tap or left mouse click
    cy.on('tap', 'node', function () {
        // @ts-ignore
        const self = this as cytoscape.NodeCollection & cytoscape.SingularData
        toggleChildren(self, graph, historyManager)
    })

    // on right mouse click or two finger tap
    cy.on('cxttap', 'node', function () {
        // @ts-ignore
        const self = this as cytoscape.NodeCollection & cytoscape.SingularData
        console.log('cxttap', self)
        openPage(self)
    })

}

export function renderState(
    cy: cytoscape.Core,
    graph: Graph,
    nodeUrl: string | null | undefined
) {
    const roots = graph.sources()
    console.log('roots', roots)

    for (const root of roots) {
        const node = cy.getElementById(root)
        if (nodeUrl && root === nodeUrl) {
            showChildren(node)
            continue
        }

        hideChildren(node)
    }
}

function toggleChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData, graph: Graph, historyManager: H.History<H.LocationState>) {
    const roots = graph.sources()
    const nodeUrl = nodes.id()
    if (!roots.includes(nodeUrl)) {
        return
    }

    const query = qs.parse(historyManager.location.search)
    const encodedUrl = encodeURIComponent(nodeUrl)

    if (query.node === encodedUrl) {
        console.log('Will hide', nodeUrl)
        delete query['node']
        historyManager.push({
            search: `?${qs.stringify(query)}`,
        })
        return
    }

    console.log('Will switch to', nodeUrl)

    query['node'] = encodedUrl
    historyManager.push({
        search: `?${qs.stringify(query)}`
    })
}

// Save node data and remove
function hideChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    if (!isChildrenVisible(nodes)) {
        // if hide same nodes multiple times cytoscape fails to render newly showed children
        return
    }
    const children = nodes.successors().targets().remove()
    console.log('Will hide children', children)
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE, children)
}

// Restore the removed nodes from saved data if need
function showChildren(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    const children = nodes.scratch(HIDDEN_CHILDREN_NAMESPACE)
    console.log('Will show children', children)
    if (children) {
        children.restore()
    }
    nodes.scratch(HIDDEN_CHILDREN_NAMESPACE, null)
}

const isChildrenVisible = (nodes: cytoscape.NodeCollection & cytoscape.SingularData): boolean =>
    !nodes.scratch(HIDDEN_CHILDREN_NAMESPACE)

function openPage(nodes: cytoscape.NodeCollection & cytoscape.SingularData) {
    const nodeUrl = nodes.id()
    window.open(nodeUrl)
}