import { PageData } from '../src/history'
import { PagesState } from '../src/pages/Background/store/state'
import { getOldTrees } from '../src/pages/Background/store/oldPages'
import { PageDataDictanory } from '../src/types'

const now = 1609954664667 // Mock current timestamp | Wed Jan 06 2021 20:37:44 GMT+0300 (Moscow Standard Time) 

const TWO_HOURS = 2 * 60 * 60 * 1000 // in ms 

const addHours = (time: number, hours: number): number =>
    addMinutes(time, hours * 60)

const addMinutes = (time: number, minutes: number): number =>
    new Date(time + minutes * 60 * 1000).getTime()

const baseState: PagesState = {
    settings: {
        pageExirationTime: TWO_HOURS
    },
    pages: {
        // One base tree
        'www.google.com/search/a': {
            lastAccessTime: addMinutes(now, -30),
        },
        'www.wikipedia.com/a_letter': {
            lastAccessTime: addMinutes(now, -25),
        },
        'www.wikipedia.com/b1_letter': {
            lastAccessTime: addMinutes(now, -20),
        },
        'www.twiiter.com/a_man': {
            lastAccessTime: addMinutes(now, -24),
        },
    },
    history: [
        {
            from: 'www.google.com/search/a',
            to: 'www.wikipedia.com/a_letter',
            time: addMinutes(now, -26),
        },
        {
            from: 'www.wikipedia.com/a_letter',
            to: 'www.wikipedia.com/b1_letter',
            time: addMinutes(now, -21),
        },
        {
            from: 'www.google.com/search/a',
            to: 'www.twiiter.com/a_man',
            time: addMinutes(now, -25),
        },
    ]
}

interface PageDataItem {
    url: string,
    lastAccessTime?: number
    isClosed?: boolean
}

function toArray(pages: PageDataDictanory): Array<PageDataItem> {
    return Object.keys(pages)
        .map(url => ({
            url,
            lastAccessTime: baseState.pages[url].lastAccessTime,
            isClosed: baseState.pages[url].isClosed,
        }))
}

function toDictionary(list: Array<PageDataItem>): PageDataDictanory {
    return list.reduce((dict, page) => ({
        ...dict,
        [page.url]: {
            lastAccessTime: page.lastAccessTime,
            isClosed: page.isClosed,
        }
    }), {})
}

describe('getOldTrees', () => {
    it('should return only old trees', () => {

        const oldPagesList = toArray(baseState.pages)
            // Increase time and add /old in url of base tree
            .map(page => ({ ...page, url: `${page.url}/old`, lastAccessTime: addHours(page.lastAccessTime, -3) }))

        const oldPages: PageDataDictanory = toDictionary(oldPagesList)

        const oldPagesHistory = baseState.history.map(visit => ({
            from: `${visit.from}/old`, to: `${visit.to}/old`,
            time: addHours(visit.time, -3)
        }))

        // www.google.com/search/nothing
        const OneOldPage: PageData = {
            lastAccessTime: addHours(now, -4)
        }

        const state: PagesState = {
            settings: {
                ...baseState.settings,
            },
            pages: {
                ...baseState.pages,
                ...oldPages,
                'www.google.com/search/nothing': OneOldPage
            },
            history: [
                ...baseState.history,
                ...oldPagesHistory
            ]
        }

        const oldNodes = getOldTrees(state, { currentTime: now })

        const oldUrls = Object.keys(oldPages)
        const [rootUrl] = oldUrls
        expect(oldNodes).toEqual({
            [rootUrl]: oldPagesList.map(page => ({ ...page, id: page.url, url: undefined }))
        })
    })

    it('should return only old trees even if root is closed', () => {
        // Increase time and add /old in url of base tree
        const oldPagesList = toArray(baseState.pages)
            .map(page => ({ ...page, url: `${page.url}/old`, lastAccessTime: addHours(page.lastAccessTime, -3) }))
        // close root page
        oldPagesList[0].isClosed = true
        const oldPages: PageDataDictanory = toDictionary(oldPagesList)

        const oldPagesHistory = baseState.history.map(visit => ({
            from: `${visit.from}/old`, to: `${visit.to}/old`,
            time: addHours(visit.time, -3)
        }))

        // www.google.com/search/nothing
        const OneOldPage: PageData = {
            lastAccessTime: addHours(now, -4)
        }

        const state: PagesState = {
            settings: {
                ...baseState.settings,
            },
            pages: {
                ...baseState.pages,
                ...oldPages,
                'www.google.com/search/nothing': OneOldPage
            },
            history: [
                ...baseState.history,
                ...oldPagesHistory
            ]
        }

        const oldNodes = getOldTrees(state, { currentTime: now })

        const oldUrls = Object.keys(oldPages)
        const [rootUrl] = oldUrls
        expect(oldNodes).toEqual({
            [rootUrl]: oldPagesList.map(page => ({ ...page, id: page.url, url: undefined }))
        })
    })

    it('should not return closed tree', () => {
        // Increase time and add /old in url of base tree, and close
        const oldPages: PageDataDictanory = toDictionary(toArray(baseState.pages)
            .map(page => ({
                ...page,
                url: `${page.url}/old`,
                lastAccessTime: addHours(page.lastAccessTime, -3),
                isClosed: true
            }))
        )

        const oldPagesHistory = baseState.history.map(visit => ({
            from: `${visit.from}/old`, to: `${visit.to}/old`,
            time: addHours(visit.time, -3)
        }))

        // www.google.com/search/nothing
        const OneOldPage: PageData = {
            lastAccessTime: addHours(now, -4)
        }

        const state: PagesState = {
            settings: {
                ...baseState.settings,
            },
            pages: {
                ...baseState.pages,
                ...oldPages,
                'www.google.com/search/nothing': OneOldPage
            },
            history: [
                ...baseState.history,
                ...oldPagesHistory
            ]
        }

        const oldNodes = getOldTrees(state, { currentTime: now })

        expect(oldNodes).toEqual({})
    })
})