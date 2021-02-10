import { compudeBranchToTimelineDict, compudeNodesToBranchesDict, inChronicleOrder, TimeNode } from "../../../../../../graph"
import { AbstractEdge, AbstractNode, AbstractTreesGraph } from "../../../../../../graph/AbstractTreesGraph"
import * as matrix from '../../../../../../matrix'



export type NodesMap = Array<Array<string | null>>;

/**
 * Will build nodes positions map
 * based on timestamp when they was created
 * and on their relationship to each other
 * nodes in one tree will be on same row
 */
export function buildMapByTime<
    Node extends TimeNode & AbstractNode,
    Edge extends AbstractEdge
>(graph: AbstractTreesGraph<Node, Edge>): NodesMap {

    const nodeToBranchesDict = compudeNodesToBranchesDict(graph)
    const branchToTimeline = compudeBranchToTimelineDict(graph, nodeToBranchesDict)

    const byTime = graph.nodesValues()
        .sort(inChronicleOrder)
        .map(({ id }) => id)

    const map = matrix.create<string, null>(Object.keys(nodeToBranchesDict).length, byTime.length, null)

    byTime.forEach((nodeId, moment) => {
        const branchNumber = nodeToBranchesDict[nodeId]
        if (branchNumber === undefined)
            return

        const timeline = branchToTimeline[branchNumber]
        if (!timeline) {
            // branch without timeline
            // probably because not have timestamps in nodes
            // TODO: fix
            return
        }

        map[timeline][moment] = nodeId
    })

    return map
}

export interface NodeWithPosition {
    node: string
    position: { x: number, y: number }
}

export interface MapToPositionsOptions {
    nodeSize: number
    offset?: number
}

export function* mapToPositions(map: NodesMap, { nodeSize, offset = 0 }: MapToPositionsOptions): Generator<NodeWithPosition> {
    const nodeRadius = Math.ceil(nodeSize / 2)

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            const node = map[i][j]
            if (!node)
                continue

            const x = nodeSize * i + nodeRadius + offset
            const y = nodeSize * j + nodeRadius + offset

            yield { node, position: { x, y } }
        }
    }
}
