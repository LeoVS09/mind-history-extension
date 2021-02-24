import { AbstractNode, AbstractEdge, AbstractTreesGraph } from "../graph"
import { PageModel, PageVisitModel } from "../domain"
import { PageDataDictanory } from "../types"


export interface PageGraphNode extends AbstractNode, PageModel {
    /** url */
    id: string
}

export interface GraphVisitEdge extends AbstractEdge, Pick<PageVisitModel, 'time'> {
}

export class PagesGraph extends AbstractTreesGraph<PageGraphNode, GraphVisitEdge> {

    addNodesFromDictionary(pages: PageDataDictanory) {
        const nodes = toNodes(pages)
        this.addNodes(nodes)
    }

    addEdgesFromHistory(history: Array<PageVisitModel>) {
        const edges = toEdges(history)
        this.addEdges(edges)
    }


    /** 
     * Return latest access node in graph, for given root node 
     * or undefined if some node not have access time
     * */
    getLatestAccessedNodeInTree(rootid: string): PageGraphNode | undefined {
        const nodes = this.getTree(rootid)
        if (!nodes || nodes.length === 0)
            return


        let latest: PageGraphNode = nodes[0]
        for (const node of nodes) {
            if (!node.lastAccessedAt)
                return


            if (latest.lastAccessedAt! < node.lastAccessedAt)
                latest = node

        }

        return latest
    }
}

const toNodes = (pages: PageDataDictanory): Array<PageGraphNode> =>
    Object.keys(pages).map(id => ({
        ...pages[id],
        id
    }))

const toEdges = (history: Array<PageVisitModel>): Array<GraphVisitEdge> =>
    history
        .filter((visit) => !!visit.from)
        .map(visit => ({
            source: visit.from!,
            target: visit.to,
            time: visit.time
        }))