import { createReducer } from "@reduxjs/toolkit"
import { isTrackablePage, PageData, PageVisit } from "../../../history"
import { toGraphPage } from "../../../routing"
import { closePages } from "../onOpenTab"
import * as actions from "./actions"
import { getOldTrees } from "./oldPages"
import { PagesState, initialState } from "./state"

export const pagesReducer = createReducer<PagesState>(initialState, {

    [actions.setCurrentPage.type]: (state, { payload: url }: ReturnType<typeof actions.setCurrentPage>) => {
        state.current = url
    },

    [actions.openPage.type]: (state, { payload: { url, time } }: ReturnType<typeof actions.openPage>) => {
        const pageVisit: PageVisit = {
            from: state.current,
            to: url,
            time
        }
        if (!isTrackablePage(pageVisit.to))
            return

        if (pageVisit.from && !isTrackablePage(pageVisit.from))
            return


        state.history.push(pageVisit)
        printHistory(state.history)
    },

    [actions.savePageData.type]: (state, { payload: { url, page } }: ReturnType<typeof actions.savePageData>) => {
        if (!isTrackablePage(url))
            return

        // Need prevent overriding fields with data, by undefined values
        const oldData: PageData = state.pages[url] || {}

        state.pages[url] = {
            ...oldData,
            title: page.title || oldData.title,
            favIconUrl: page.favIconUrl || oldData.favIconUrl,
            lastAccessTime: getLastOrExistedTime(page.lastAccessTime, oldData.lastAccessTime)
        }
        if (process.env.DEBUG)
            console.debug('Page data saved', JSON.stringify(state, null, 2))

    },

    [actions.updatePagesVisitsTime.type]: (state, { payload: visitsTime }: ReturnType<typeof actions.updatePagesVisitsTime>): void => {

        for (const pageUrl of Object.keys(visitsTime)) {
            const page = state.pages[pageUrl] || {}
            const lastPageTime = visitsTime[pageUrl]

            state.pages[pageUrl] = {
                ...page,
                lastAccessTime: getLastOrExistedTime(lastPageTime, page.lastAccessTime)
            }
        }

        console.log('Pages without last access time:', Object.keys(state.pages).map(url => state.pages[url]).filter(p => !p.lastAccessTime))
    },

    [actions.tryCloseOldPages.type]: (state) => {
        if (!state.settings.isClosePagesAutomatically)
            return

        const old = getOldTrees(state)
        console.log('old pages:', old)

        for (const rootUrl of Object.keys(old)) {
            const nodes = old[rootUrl]
                .map(({ id }) => id)

            if (state.current && nodes.includes(state.current)) {
                // Prevent acidental close tree whch currently used
                continue
            }

            nodes.forEach(url => {
                const page = state.pages[url] || {}
                state.pages[url] = {
                    ...page,
                    isClosed: true,
                }
            })

            replaceTabsWithGraph(rootUrl, nodes)
        }
    },

    [actions.setOpenPages.type]: ({ pages }, { payload: tabs }: ReturnType<typeof actions.setOpenPages>) => {
        const urls = Object.keys(pages)
        for (const url of urls)
            pages[url].isClosed = !tabs.includes(url)
    },

    [actions.setSettings.type]: (state, { payload: settings }: ReturnType<typeof actions.setSettings>) => {
        state.settings = settings
    }
})

async function replaceTabsWithGraph(rootUrl: string, nodes: Array<string>) {
    const closedTabs = await closePages(nodes)

    if (!closedTabs.length) {
        // If nothing was closed, then not need open graph for it
        return
    }

    let index = 0

    // Will set new tab at index of first closed tab
    const [smallestIndex] = closedTabs
        .map(tab => tab.index)
        .filter(index => index !== undefined)
        .sort()

    index = smallestIndex !== undefined ? smallestIndex : index

    toGraphPage(rootUrl, { selected: false, index })
}

function getLastOrExistedTime(a: number | undefined, b: number | undefined): number | undefined {
    if (a && b)
        return getLastTime(a, b)

    return a || b
}

function getLastTime(a: number, b: number): number {
    if (a > b)
        return a

    return b
}

const printHistory = (history: Array<PageVisit>) => {
    const result = []
    for (const visit of history)
        result.push(`${visit.from} -> ${visit.to} | ${new Date(visit.time)}`)


    console.log(result.join('\n\n '))
}