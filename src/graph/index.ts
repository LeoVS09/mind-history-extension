import { Graph } from "graphlib"

export interface AbstractNode {
    id: string
}

export interface AbstractEdge {
    source: string,
    target: string
}

export interface BranchesDictionary {
    [id: string]: number
}

/** Graph which can contain multiple independentend trees */
export class AbstractTreesGraph<N extends AbstractNode = AbstractNode, E extends AbstractEdge = AbstractEdge> extends Graph {

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

    getTreeByLevels(rootId: string): Array<Array<N>> | undefined {
        if (!this.node(rootId))
            return

        const result: Array<Array<string>> = [[rootId]]

        while (true) {
            const lastRow = result[result.length - 1]
            const nextRow = []

            for (const nodeId of lastRow) {
                const childrenIds = this.children(nodeId)
                if (childrenIds && childrenIds.length)
                    nextRow.push(...childrenIds)
            }

            if (!nextRow.length)
                break

            result.push(nextRow)
        }

        return result
            .map(row =>
                row
                    .map(id => this.node(id) as N)
                    .filter(n => !!n)
            )
    }

    *getAllTrees(): Generator<Array<N>> {
        const rootsIds = this.getAllTreeRoots()

        for (const id of rootsIds) {
            const tree = this.getTree(id)
            if (!tree || !tree.length)
                continue

            yield tree
        }
    }

    getAllTreeRoots(): Array<string> {
        return this.nodes()
            .filter(id => !this.haveParent(id) && this.children(id)?.length)
            .filter(isUnique)
    }

    haveParent(id: string): boolean {
        return !!this.parent(id)
    }

    flatTree(rootId: string): Array<string> {
        const children = this.children(rootId) || []

        const result = []
        for (const child of children) {
            const flatten = this.flatTree(child)
            result.push(...flatten)
        }

        return injectInMiddle(result, rootId)
    }

    /** Will return dictanory of node id, where each value is branch number in which node placed */
    branchesDictionary(rootId: string, initialNumber = 0): BranchesDictionary {
        let branchIndex = initialNumber
        let dict: BranchesDictionary = {
            [rootId]: branchIndex,
        }

        const children = this.children(rootId) || []

        for (const child of children) {
            dict = {
                ...dict,
                ...this.branchesDictionary(child, branchIndex),
            }
            branchIndex++
        }

        return dict
    }

    /** Return all nodes values */
    nodesValues(): Array<N> {
        return this.nodes()
            .map(id => this.node(id))
            .filter(node => !!node)
    }

}

function isUnique<T>(value: T, index: number, self: Array<T>): boolean {
    return self.indexOf(value) === index
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

export function injectInMiddle<T>(arr: Array<T>, item: T): Array<T> {
    if (!arr.length)
        return [item]

    const middleIndex = Math.ceil(arr.length / 2)
    arr.splice(middleIndex, 0, item) // mutate array

    return arr
}