import { EdgeDefinition, NodeDefinition } from 'cytoscape'
import React, { useState } from 'react'
import CytoscapeComponent, { CytoscapeHook } from 'react-cytoscapejs'
import { PageVisit } from '../../../history'
import { PageDataDictanory } from '../../../types'
import { setupGraphEngine, setupCyHooks, renderState } from '../graph'
import { useHistory } from 'react-router-dom'
import { useQuery } from '../router'

export interface MindGraphProps {
    pages: PageDataDictanory
    history: Array<PageVisit>
    nodeUrl?: string | null
}

// TODO: calculate width and height on start
const MAX_WIDTH = 1440
const MAX_HEIGHT = 720

export const MindGraph: React.FC<MindGraphProps> = ({ pages, history, nodeUrl }) => {
    pages = filterPages(pages)

    let nodes = mapToNodes(pages)

    const edges = mapToEdges(history, Object.keys(pages))

    nodes.forEach(node => {
        node.data.score = countEdges(node, edges)
    })
    nodes = nodes.filter(node => node.data.score !== 0)

    const elements = CytoscapeComponent.normalizeElements({
        nodes,
        edges
    })

    console.log({ elements })

    const g = setupGraphEngine(nodes, edges)

    const historyManager = useHistory()

    const [isCoreSetupComplete, setCoreSetupStatus] = useState(false)
    const coreSetupComplete = () => setCoreSetupStatus(true)

    // prevent multiple setups on updates
    const coreHookCallback: CytoscapeHook = core => {
        renderState(core, g, nodeUrl)
        if (isCoreSetupComplete) {
            return
        }

        setupCyHooks(core, historyManager)
        coreSetupComplete()
    }

    return (
        <div>
            <h1>Mind Graph</h1>
            <p>Found nodes {nodes.length}</p>

            {elements.length && (
                <CytoscapeComponent
                    elements={elements}
                    layout={{
                        name: 'cose',
                        randomize: true,
                    }}
                    style={{ width: `${MAX_WIDTH}px`, height: `${MAX_HEIGHT}px` }}
                    stylesheet={graphStyles}
                    cy={coreHookCallback}
                />)}
        </div>
    )

}

function filterPages(pages: PageDataDictanory) {
    const allowedPageUrls = Object.keys(pages)
        .filter(url => !isSpecialPage(url))

    return copyKeys({}, pages, allowedPageUrls)
}

function copyKeys<T extends { [key: string]: any }>(target: T, source: T, keys: string[]): T {
    return keys.reduce<T>((target, key) => {
        // @ts-ignore
        target[key] = source[key]
        return target
    }, target)
}


function mapToNodes(pages: PageDataDictanory): Array<NodeDefinition> {
    const result: Array<NodeDefinition> = []

    for (const url in pages) {
        const page = pages[url]

        result.push({
            data: {
                id: url,
                label: page.title || url,
                favIconUrl: page.favIconUrl,
            },
            // position: { x: getRandomInt(0, MAX_WIDTH), y: getRandomInt(0, MAX_HEIGHT) }
        })
    }

    return result
}

const isSpecialPage = (url: string): boolean => url.startsWith('chrome:') || url.startsWith('chrome-extension:')

const mapToEdges = (history: Array<PageVisit>, existingUrls: Array<string>): Array<EdgeDefinition> => history
    .filter(visit => !!visit.from)
    .filter(visit => existingUrls.includes(visit.from!) && existingUrls.includes(visit.to))
    .map(visit => ({
        data: {
            id: `${visit.from}->${visit.to}`,
            source: visit.from!,
            target: visit.to,
        }
    }))

const countEdges = (node: NodeDefinition, edges: Array<EdgeDefinition>): number => {
    let count = 0
    for (const edge of edges) {
        if (edge.data.source === node.data.id || edge.data.target === node.data.id) {
            count++
        }
    }

    return count
}

// function getRandomInt(min: number, max: number): number {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

const graphStyles = [{
    "selector": "core",
    "style": {
        "selection-box-color": "#AAD8FF",
        "selection-box-border-color": "#8BB0D0",
        "selection-box-opacity": "0.5"
    }
}, {
    "selector": "node",
    "style": {
        "width": "mapData(score, 1, 3, 30, 60)",
        "height": "mapData(score, 1, 3, 30, 60)",
        "label": "data(label)",
        "font-size": "14px",
        "text-valign": "bottom",
        "text-halign": "center",
        "background-color": "#777",
        "background-image": 'data(favIconUrl)',
        "color": "#fff",
        "overlay-padding": "6px",
        "z-index": "10"
    }
}, {
    "selector": "edge",
    "style": {
        'width': 1,
        "curve-style": "haystack",
        "haystack-radius": "0.1",
        "opacity": "0.4",
        "line-color": "red",
        "overlay-padding": "5px"
    }
},
]