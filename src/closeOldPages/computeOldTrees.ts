
import { PageModelDictanory, PageVisitModel } from "../domain"
import { PageGraphNode, PagesGraph } from "./PagesGraph"

export interface TreesDictionary {
    [rootUrl: string]: Array<PageGraphNode>
}

export interface GetOldTreesOptions {
    /** Need for mock at testing runtime */
    currentTime?: number
    pageExirationTime: number
}


// TODO: add tests
/**
 * Will return flatten trees which contain expired pages
 */
export function computeOldTrees(
    pages: PageModelDictanory,
    history: Array<PageVisitModel>,
    {
        pageExirationTime,
        currentTime = (new Date()).getTime()
    }: GetOldTreesOptions
): TreesDictionary {
    const graph = new PagesGraph()

    graph.addNodesFromDictionary(pages)
    graph.addEdgesFromHistory(history)

    // Build roots for all trees in graph with last access time
    // of any page in tree
    const roots = graph.sources()
        .filter(id => graph.nodeEdges(id)!.length > 0) // root must have at least one children
        .map(id => ({
            id,
            time: graph.getLatestAccessedNodeInTree(id)?.lastAccessedAt
        }))
        .filter(({ time }) => !!time)
        .sort((a, b) => b.time! - a.time!) // will sort descending, most new at start
        .slice(1) // remove last access tree

    const oldTrees: TreesDictionary = {}

    for (const root of roots) {
        if (root.time && (currentTime - root.time) > pageExirationTime) {
            // if graph was accessed more then pageExirationTime
            const treeNodes = graph.getTree(root.id)!
            const openPages = treeNodes.filter(({ isOpen }) => isOpen)
            if (!openPages.length)
                continue

            if (openPages[0] !== treeNodes[0]) {
                // add root node even if it not exists
                openPages.unshift(treeNodes[0])
            }
            oldTrees[root.id] = openPages
        }
    }

    return oldTrees
}

