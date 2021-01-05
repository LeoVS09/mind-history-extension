import { Graph } from "graphlib"

export interface AbstractNode {
    id: string
}

export interface AbstractEdge {
    source: string,
    target: string
}

export class AbstractGraph extends Graph {

    addNodes<T extends AbstractNode>(nodes: Array<T>) {
        for (const node of nodes) {
            this.setNode(node.id!, node)
        }
    }

    addEdges<T extends AbstractEdge>(edges: Array<T>) {
        for (const edge of edges) {
            this.setEdge(edge.source, edge.target, edge)
        }
    }
}