import { Graph } from "graphlib"

export interface AbstractNode {
    id: string
}

export interface AbstractEdge {
    source: string,
    target: string
}

export class AbstractGraph<N extends AbstractNode, E extends AbstractEdge> extends Graph {

    addNodes(nodes: Array<N>) {
        for (const node of nodes) {
            this.setNode(node.id!, node)
        }
    }

    addEdges(edges: Array<E>) {
        for (const edge of edges) {
            this.setEdge(edge.source, edge.target, edge)
        }
    }

    getTree(rootId: string): Array<N> | undefined {
        const root = this.node(rootId)
        if (!root) {
            return
        }
        const children = (this.children(rootId) || [])
            .map(id => this.node(id))

        return [root, ...children]
    }
}