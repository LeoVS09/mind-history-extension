import { EdgeDefinition, NodeDefinition } from 'cytoscape'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { PageVisit } from '../../history'
import { PageDataDictanory } from '../../types'

export interface MindGraphProps {
    pages: PageDataDictanory
    history: Array<PageVisit>
}

// TODO: calculate width and height on start
const MAX_WIDTH = 1440
const MAX_HEIGHT = 720

export const MindGraph: React.FC<MindGraphProps> = ({ pages, history }) => {
    let nodes = mapToNodes(pages)

    const edges = mapToEdges(history, Object.keys(pages))

    nodes.forEach(node => {
        node.data.score = countEdges(node, edges)
    })
    nodes = nodes.filter(node => node.data.score !== 0)

    return (
        <div>
            <h1>Mind Graph</h1>
            <p>Fount items {history.length}</p>

            {history.length && (
                <CytoscapeComponent
                    elements={CytoscapeComponent.normalizeElements({
                        nodes,
                        edges
                    })}
                    cy={() => console.log("update cy")}
                    layout={{
                        name: 'cose',
                        randomize: true
                    }}
                    style={{ width: `${MAX_WIDTH}px`, height: `${MAX_HEIGHT}px` }}
                    stylesheet={graphStyles}
                />)}
        </div>
    )

}

function mapToNodes(pages: PageDataDictanory): Array<NodeDefinition> {
    const result: Array<NodeDefinition> = []

    for (const url in pages) {
        const page = pages[url]

        result.push({
            data: {
                id: url,
                label: page.title || url,
            },
            // position: { x: getRandomInt(0, MAX_WIDTH), y: getRandomInt(0, MAX_HEIGHT) }
        })
    }

    return result
}

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
        "width": "mapData(score, 1, 3, 60, 100)",
        "height": "mapData(score, 1, 3, 60, 100)",
        "label": "data(label)",
        "font-size": "18px",
        "text-valign": "center",
        "text-halign": "center",
        "background-color": "#777",
        "color": "#fff",
        "overlay-padding": "6px",
        "z-index": "10"
    }
}, {
    "selector": "edge",
    "style": {
        "curve-style": "haystack",
        "haystack-radius": "0.5",
        "opacity": "0.4",
        "line-color": "blue",
        "overlay-padding": "3px"
    }
},]