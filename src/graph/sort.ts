import { AbstractNode } from "./AbstractTreesGraph"
import { TimeNode } from "./types"

export const ascending = (a: number, b: number) => a - b

export const descending = (a: number, b: number) => b - a

// Need wrap isFinite for correctly typescript checks
const isNumber = (a: any): a is number => Number.isFinite(a)

/** Comparator function for sort nodes in chronicle order */
export function inChronicleOrder<Node extends TimeNode & AbstractNode>(
    { timestamp: a }: Node,
    { timestamp: b }: Node
): number {
    if (!isNumber(a) || !isNumber(b))
        return 0

    return ascending(a, b)
}
