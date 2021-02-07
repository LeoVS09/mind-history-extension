import { AbstractEdge, AbstractNode, AbstractTreesGraph } from "../../../../../../graph"
import * as matrix from '../../../../../../matrix'

export interface TimeNode {
    timestamp: number | undefined;
}

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
    const byTree = []

    for (const rootId of graph.getAllTreeRoots())
        byTree.push(...graph.flatTree(rootId))

    const byTime = graph.nodes().sort((a, b) => {
        const { timestamp: tA } = graph.node(a) || {}
        const { timestamp: tB } = graph.node(b) || {}

        if (!a || !b)
            return 0

        return tA - tB
    })

    const map = matrix.create<string, null>(byTree.length, byTime.length, null)

    byTree.forEach((nodeId, x) => {
        const y = byTime.indexOf(nodeId)
        if (!y)
            return

        map[x][y] = nodeId
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

function alignByTime<Node extends TimeNode & AbstractNode>(tree: Array<Array<Node>>): Array<Array<Node | null>> {
    const result = []

    // Will make one node per lavel
    // for allow sort this levels
    for (let i = 0; i < tree.length; i++) {
        const level = tree[i]

        for (let j = 0; j < level.length; j++) {
            const node = level[j]

            const newLayer = (new Array(j)).fill(null)
            newLayer[j] = node

            result.push(newLayer)
        }
    }


    return result.sort((firstLevel, secondLevel) => {
        const { timestamp: a } = getLevelFirstNode(firstLevel) || {}
        const { timestamp: b } = getLevelFirstNode(secondLevel) || {}

        if (!a || !b)
            return 0

        return a - b
    })
}

function getLevelFirstNode<N>(level: Array<N>): N | undefined {
    const [node] = level.filter(n => !!n)
    return node
}

// /** 
//  * Will split trees array into matrix of trees, 
//  * where trees in one column not have intersections in time
//  * */
// function treesLevelsToMatrix<Node extends TimeNode & AbstractNode>(trees: Array<Array<Array<Node | null>>>): Array<Array<Array<Array<Node | null>>>> {

//     const treesWithIntervals = trees.map(tree => {
//         const [from, to] = getTreeTimeframe(tree) as Array<number>
//         return { from, to, data: tree }
//     })

//     const splited = splitIntervals(treesWithIntervals)

//     return splited.map(row =>
//         row.map(({ data }) => data)
//     )
// }

// export interface TimeInterval<T> {
//     from: number
//     to: number
//     data: T
// }

// /** 
//  * Will split time intervals into multiple timelines,
//  * for prevent overlap into one timeline
//  * */
// function splitIntervals<T>(intervals: Array<TimeInterval<T>>): Array<Array<TimeInterval<T>>> {
//     return []
// }