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

describe('getOldTrees', () => {
    it('should return only old trees', () => {
        // Increase time and add /old in url of base tree
        const oldPages: PageDataDictanory = Object.keys(baseState.pages)
            .map(url => ({ url, lastAccessTime: baseState.pages[url].lastAccessTime }))
            .map(page => ({ url: `${page.url}/old`, lastAccessTime: addHours(page.lastAccessTime, -3) }))
            .reduce((dict, page) => ({
                ...dict,
                [page.url]: { lastAccessTime: page.lastAccessTime }
            }), {})

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
            [rootUrl]: oldUrls.map(id => ({ id, lastAccessTime: oldPages[id].lastAccessTime }))
        })
    })
})