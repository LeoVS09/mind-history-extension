import { AbstractNode, AbstractEdge, AbstractTreesGraph } from "./AbstractTreesGraph"
import { TimeNode } from "./types"
import { ascending } from './sort'

export interface NodeToBranchesDictionary {
    [id: string]: number
}

export function compudeNodesToBranchesDict<
    Node extends TimeNode & AbstractNode,
    Edge extends AbstractEdge
>(graph: AbstractTreesGraph<Node, Edge>): NodeToBranchesDictionary {
    const dict: NodeToBranchesDictionary = {}

    for (const rootId of graph.getAllTreeRoots()) {
        const [biggestBranchNumber] = Object.values(dict).sort(ascending).slice(-1)
        const nextBranchNumber = biggestBranchNumber ? biggestBranchNumber + 1 : 0

        Object.assign(dict, graph.branchesDictionary(rootId, nextBranchNumber))
    }

    console.log('nodesToBranchesDict', dict, Object.keys(dict).length)

    return dict
}
