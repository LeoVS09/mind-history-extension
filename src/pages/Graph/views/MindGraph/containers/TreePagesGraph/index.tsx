import React from "react"
import CytoscapeComponent from "react-cytoscapejs"
import { useHistory } from "react-router-dom"
import { TimeNode } from "../../../../../../graph"
import { AbstractTreesGraph, AbstractNode, AbstractEdge } from "../../../../../../graph/AbstractTreesGraph"
import { PageVisit } from "../../../../../../history"
import { PageDataDictanory } from "../../../../../../types"
import { FullScreenTreesGraph } from "./components/FullScreenTreesGraph"
import { MAX_NODE_SIZE } from "./components/TreesGraph"
import { setupCyHooks } from "./graph"
import { buildMapByTime, mapToPositions } from "./layout"
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

    if (!nodes.length)
        return null

    const g = new AbstractTreesGraph<AbstractNode & TimeNode, AbstractEdge>()
    g.addNodes(nodes.map(({ data }) => data as AbstractNode & TimeNode))
    g.addEdges(edges.map(({ data }) => data))

    const map = buildMapByTime(g)
    const nodesWithPosition = [...mapToPositions(map, { nodeSize: MAX_NODE_SIZE, offset: Math.ceil(MAX_NODE_SIZE / 2) })]
    console.log('nodes with position:', nodesWithPosition)

    const resultNodes = nodesWithPosition
        .map(node => ({
            ...node,
            data: g.node(node.node)
        }))
        .filter(node => !!node.data)

    const existingUrls = resultNodes.map(({ data: { id } }) => id)

    const resultEdges = edges
        .filter(({ data: edge }) => existingUrls.includes(edge.source) && existingUrls.includes(edge.target))

    const elements = CytoscapeComponent.normalizeElements({ nodes: resultNodes, edges: resultEdges })
    console.log('result elements:', elements)
    if (!elements.length)
        return null

    console.log('nodes input', g.nodes().length, 'nodes with position', nodesWithPosition.length, 'result nodes', resultNodes.length)

    return <FullScreenTreesGraph
        elements={elements}
        onSetup={core => setupCyHooks(core, g, historyManager)}
    />
}
