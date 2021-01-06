import { Graph } from "graphlib"

export interface AbstractNode {
    id: string
}

export interface AbstractEdge {
    source: string,
    target: string
}

/** Graph which can contain multiple independentend trees */
export class AbstractTreesGraph<N extends AbstractNode, E extends AbstractEdge> extends Graph {

    constructor() {
        super({ compound: true })
    }

    addNodes(nodes: Array<N>) {
        for (const node of nodes)
            this.setNode(node.id!, node)

    }

    addEdges(edges: Array<E>) {
        for (const edge of edges) {
            this.setEdge(edge.source, edge.target, edge)
            try {
                this.setParent(edge.target, edge.source)
            } catch (e) {
                console.warn('Error on set parent for edge', edge, '\n', e)
            }
        }
    }

    getTree(rootId: string): Array<N> | undefined {
        const root = this.node(rootId) as N
        if (!root)
            return

        const children = getWholeTreeChildren(this, rootId)
            .map(id => this.node(id))
            .filter(node => !!node)

        return [root, ...children]
    }

}


/** 
 * Base children method returns only direct chidlren,
 * but this function recursively collect all childrens in whole tree
 */
function getWholeTreeChildren(graph: Graph, rootId: string): Array<string> {
    const children = graph.children(rootId) || []

    const result = []
    for (const child of children)
        result.push(child, ...getWholeTreeChildren(graph, child))


    return result
}
