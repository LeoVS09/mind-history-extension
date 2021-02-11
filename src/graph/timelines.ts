import { AbstractEdge, AbstractNode, AbstractTreesGraph } from "./AbstractTreesGraph"
import { NodeToBranchesDictionary } from "./branches"
import { inChronicleOrder } from "./sort"
import { TimeNode } from "./types"

export function compudeBranchToTimelineDict<
    Node extends TimeNode & AbstractNode,
    Edge extends AbstractEdge
>(graph: AbstractTreesGraph<Node, Edge>, nodeToBranchesDict: NodeToBranchesDictionary) {
    const branches = [] as Array<Array<string>>

    Object.keys(nodeToBranchesDict)
        .forEach(id => {
            const branchNumber = nodeToBranchesDict[id]

            if (!branches[branchNumber])
                branches[branchNumber] = []

            branches[branchNumber].push(id)
        })

    const branchesWithTimePeriod = branches
        .map((nodesIds, index) => {
            const nodes = nodesIds.map(id => graph.node(id))

            const period = getTimePeriod(nodes)
            if (!period)
                return undefined

            return { ...period, index }
        })
        .filter(b => !!b) as Array<TimePeriod & { index: number }>

    const timelines = compudeTimelines(branchesWithTimePeriod)

    const branchToTimeline = {} as { [branch: number]: number }

    timelines.forEach((timeline, i) =>
        timeline.forEach(branch =>
            branchToTimeline[branch.index] = i
        )
    )

    return branchToTimeline
}

export interface TimePeriod {
    start: number
    end: number
}

function getTimePeriod<Node extends TimeNode & AbstractNode>(nodes: Array<Node>): TimePeriod | undefined {
    const times = nodes
        .sort(inChronicleOrder)
        .map(({ timestamp }) => timestamp)
        .filter(t => t !== undefined)

    if (!times.length)
        return

    const [first] = times
    const last = times[times.length - 1]

    return {
        start: first!,
        end: last!
    }
}

function compudeTimelines<T extends TimePeriod>(periods: Array<T>): Array<Array<T>> {
    const timelines: Array<Array<T>> = []
    let rest = periods

    while (rest.length) {
        const computed = compudeMainTimeline(rest)

        timelines.push(computed.main)
        rest = computed.rest
    }

    return timelines
}

function compudeMainTimeline<T extends TimePeriod>(periods: Array<T>): { main: Array<T>, rest: Array<T> } {
    // sort chronically/ascending based on period start
    const [first, ...sorted] = periods
        .sort((a, b) => a.start - b.start)

    const main: Array<T> = [first]
    const rest: Array<T> = []

    sorted.forEach(period => {
        const last = main[main.length - 1]

        if (period.start > last.end) {
            main.push(period)
            return
        }

        rest.push(period)
    })

    return { main, rest }
}