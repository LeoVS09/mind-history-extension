import { AbstractEdge, AbstractGraph, AbstractNode } from "../../../graph"
import { PageData, PageVisit } from "../../../history"
import { PageDataDictanory } from "../../../types"
import { PagesStore } from "./reducer"

export interface PageGraphNode extends AbstractNode, PageData {
    /** url */
    id: string
    lastAccessTime?: number
    isClosed?: boolean
}

export interface GraphVisitEdge extends AbstractEdge, Pick<PageVisit, 'time'> {
}

export class PagesGraph extends AbstractGraph<PageGraphNode, GraphVisitEdge> {

    addNodesFromDictionary(pages: PageDataDictanory) {
        const nodes = toNodes(pages)
        this.addNodes(nodes)
    }

    addEdgesFromHistory(history: Array<PageVisit>) {
        const edges = toEdges(history)
        this.addEdges(edges)
    }


    /** 
     * Return latest access node in graph, for given root node 
     * or undefined if some node not have access time
     * */
    getLatestAccessedNodeInTree(rootid: string): PageGraphNode | undefined {
        const nodes = this.getTree(rootid)
        if (!nodes || nodes.length === 0) {
            return
        }

        let latest: PageGraphNode = nodes[0]
        for (const node of nodes) {
            if (!node.lastAccessTime) {
                return
            }

            if (latest.lastAccessTime! < node.lastAccessTime) {
                latest = node
            }
        }

        return latest
    }
}

export interface TreesDictionary {
    [rootUrl: string]: Array<PageGraphNode>
}


// TODO: add tests
/**
 * Will get old pages (full independent graph),
 * when user start new search (new independent graph)
 * and all pages in old search (independent graph) not was accessed long time
 */
export function getOldTrees(state: PagesStore): TreesDictionary {
    const { settings: { pageExirationTime } } = state
    const graph = new PagesGraph()

    graph.addNodesFromDictionary(state.pages)
    graph.addEdgesFromHistory(state.history)

    // Build roots for all trees in graph with last access time
    // of any page in tree
    const roots = graph.sources()
        .filter(id => graph.nodeEdges(id)!.length > 0) // root must have at least one children
        .map(id => ({
            id,
            time: graph.getLatestAccessedNodeInTree(id)?.lastAccessTime
        }))
        .filter(({ time }) => !!time)
        .sort((a, b) => a.time! - b.time!) // will sort ascending
        .slice(1) // remove last access tree

    const now = new Date().getTime()

    const oldTrees: TreesDictionary = {}

    for (const root of roots) {
        if (!root.time || (now - root.time) > pageExirationTime) {
            // if graph was accessed more then pageExirationTime
            const treeNodes = graph.getTree(root.id)!
            const openPages = treeNodes.filter(({ isClosed }) => !isClosed)
            if (!openPages.length) {
                continue
            }
            if (openPages[0] !== treeNodes[0]) {
                // add root node even if it not exists
                openPages.unshift(treeNodes[0])
            }
            oldTrees[root.id] = openPages
        }
    }

    return oldTrees
}

const toNodes = (pages: PageDataDictanory): Array<PageGraphNode> =>
    Object.keys(pages).map(id => ({
        ...pages[id],
        id
    }))

const toEdges = (history: Array<PageVisit>): Array<GraphVisitEdge> =>
    history
        .filter((visit) => !!visit.from)
        .map(visit => ({
            source: visit.from!,
            target: visit.to,
            time: visit.time
        }))