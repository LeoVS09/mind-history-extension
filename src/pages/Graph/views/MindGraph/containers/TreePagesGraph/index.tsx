import React from "react"
import CytoscapeComponent from "react-cytoscapejs"
import { useHistory } from "react-router-dom"
import { AbstractTreesGraph, AbstractNode, AbstractEdge } from "../../../../../../graph"
import { PageVisit } from "../../../../../../history"
import { PageDataDictanory } from "../../../../../../types"
import { FullScreenTreesGraph } from "./components/FullScreenTreesGraph"
import { MAX_NODE_SIZE } from "./components/TreesGraph"
import { renderState, setupCyHooks } from "./graph"
import { buildMapByTime, mapToPositions, TimeNode } from "./position"
import { filterPages, mapToNodes, mapToEdges, countEdges } from "./prepare"

export interface TreePagesGraphProps {
    pages: PageDataDictanory
    history: Array<PageVisit>
    nodeUrl?: string | null
}

export const TreePagesGraph: React.FC<TreePagesGraphProps> = ({ pages, history, nodeUrl }) => {
    // TODO: reafactor
    const historyManager = useHistory()

    pages = filterPages(pages)

    let nodes = mapToNodes(pages)

    const edges = mapToEdges(history, Object.keys(pages))

    nodes.forEach(node => {
        node.data.score = countEdges(node, edges)
    })
    nodes = nodes.filter(node => node.data.score !== 0)

    const g = new AbstractTreesGraph<AbstractNode & TimeNode, AbstractEdge>()
    g.addNodes(nodes.map(({ data }) => data as AbstractNode & TimeNode))
    g.addEdges(edges.map(({ data }) => data))

    const map = buildMapByTime(g)
    const nodesWithPosition = [...mapToPositions(map, { nodeSize: MAX_NODE_SIZE, offset: Math.ceil(MAX_NODE_SIZE / 2) })]

    const elements = CytoscapeComponent.normalizeElements({ nodes: nodesWithPosition, edges })
    if (!elements.length)
        return null

    return <FullScreenTreesGraph
        elements={elements}
        onRerenderChange={core => renderState(core, g, nodeUrl)}
        onSetup={core => setupCyHooks(core, g, historyManager)}
    />
}
