import { Graph } from "graphlib"

export interface AbstractNode {
    id: string
}

export interface AbstractEdge {
    source: string,
    target: string
}

export interface NodeToBranchesDictionary {
    [id: string]: Array<number>
}

/** Graph which can contain multiple independentend trees */
export class AbstractTreesGraph<N extends AbstractNode = AbstractNode, E extends AbstractEdge = AbstractEdge> extends Graph {

    constructor() {
        super({ compound: true, multigraph: false })
    }

    addNodes(nodes: Array<N>) {
        for (const node of nodes)
            this.setNode(node.id!, node)

    }

    addEdges(edges: Array<E>) {
        for (const edge of edges) {
            try {
                this.setEdgeWithCheck(edge.source, edge.target, edge)
                this.setParent(edge.target, edge.source)
            } catch (e) {
                console.warn('Error on set edge or parent for edge', edge, '\n', e)
            }
        }
    }

    // Multigraph check not working in graphlib
    setEdgeWithCheck(from: string, to: string, value?: any) {
        // TODO: still not working
        if (this.edge(from, to) || this.edge(to, from))
            throw new Error("Cannot set second edge between nodes")

        this.setEdge(from, to, value)
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
    branchesDictionary(rootId: string, initialNumber = 0): NodeToBranchesDictionary {

        const rootBranches = [initialNumber]
        let dict: NodeToBranchesDictionary = {
            [rootId]: rootBranches,
        }

        const children = this.children(rootId) || []
        let branchIndex = initialNumber
        for (const child of children) {
            if (branchIndex !== initialNumber)
                rootBranches.push(branchIndex)

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