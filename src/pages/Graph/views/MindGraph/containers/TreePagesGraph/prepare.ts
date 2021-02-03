import { NodeDefinition, EdgeDefinition } from "cytoscape"
import { isTrackablePage, PageVisit } from "../../../../../../history"
import { PageDataDictanory } from "../../../../../../types"

export function filterPages(pages: PageDataDictanory) {
    const allowedPageUrls = Object.keys(pages)
        .filter(url => isTrackablePage(url))

    return copyKeys({}, pages, allowedPageUrls)
}

function copyKeys<T extends { [key: string]: any }>(target: T, source: T, keys: string[]): T {
    return keys.reduce<T>((target, key) => {
        // @ts-ignore
        target[key] = source[key]
        return target
    }, target)
}


export function mapToNodes(pages: PageDataDictanory): Array<NodeDefinition> {
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


export const mapToEdges = (history: Array<PageVisit>, existingUrls: Array<string>): Array<EdgeDefinition> => history
    .filter(visit => !!visit.from)
    .filter(visit => existingUrls.includes(visit.from!) && existingUrls.includes(visit.to))
    .map(visit => ({
        data: {
            id: `${visit.from}->${visit.to}`,
            source: visit.from!,
            target: visit.to,
        }
    }))

export const countEdges = (node: NodeDefinition, edges: Array<EdgeDefinition>): number => {
    let count = 0
    for (const edge of edges) {
        if (edge.data.source === node.data.id || edge.data.target === node.data.id)
            count++

    }

    return count
}