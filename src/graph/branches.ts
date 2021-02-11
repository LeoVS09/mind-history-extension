import { AbstractNode, AbstractEdge, AbstractTreesGraph, NodeToBranchesDictionary } from "./AbstractTreesGraph"
import { TimeNode } from "./types"
import { descending } from './sort'


export function compudeNodesToBranchesDict<
    Node extends TimeNode & AbstractNode,
    Edge extends AbstractEdge
>(graph: AbstractTreesGraph<Node, Edge>): NodeToBranchesDictionary {
    const dict: NodeToBranchesDictionary = {}

    for (const rootId of graph.getAllTreeRoots()) {
        const [biggestBranchNumber] = Object.values(dict)
            .reduce((acc, branches) => {
                acc.push(...branches)
                return acc
            }, [] as Array<number>)
            .sort(descending)

        const nextBranchNumber = biggestBranchNumber ? biggestBranchNumber + 1 : 0

        Object.assign(dict, graph.branchesDictionary(rootId, nextBranchNumber))
    }

    console.log('nodesToBranchesDict', dict, Object.keys(dict).length)

    return dict
}
