import React from "react"
import CytoscapeComponent from "react-cytoscapejs"
import { useHistory } from "react-router-dom"
import { AbstractTreesGraph, AbstractNode } from "../../../../../../graph"
import { PageVisit } from "../../../../../../history"
import { PageDataDictanory } from "../../../../../../types"
import { FullScreenTreesGraph } from "./components/FullScreenTreesGraph"
import { renderState, setupCyHooks } from "./graph"
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

    const elements = CytoscapeComponent.normalizeElements({ nodes, edges })
    if (!elements.length)
        return null

    const g = new AbstractTreesGraph()
    g.addNodes(nodes.map(({ data }) => data as AbstractNode))
    g.addEdges(edges.map(({ data }) => data))

    return <FullScreenTreesGraph
        elements={elements}
        onRerenderChange={core => renderState(core, g, nodeUrl)}
        onSetup={core => setupCyHooks(core, g, historyManager)}
    />
}
