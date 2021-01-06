import { PageDataDictanory } from "../../types"
import { getPageVisists } from "./onVisitPage"
import { store, actions } from './store'
import { PagesVisistTimeDictianory } from "./store/actions"

export async function updatePagesVisits() {
    const { pages } = store.getState()
    console.log('Start load visits for', Object.keys(pages).length, 'pages')

    const pagesAccessTime = await getAllPageVisists(pages)

    store.dispatch(actions.updatePagesVisitsTime(pagesAccessTime))
    console.log('Visists loading completed')
}

// TODO: add tests
export async function getAllPageVisists(pages: PageDataDictanory): Promise<PagesVisistTimeDictianory> {
    const urls = Object.keys(pages)

    const result: PagesVisistTimeDictianory = {}

    for (const pageUrl of urls) {
        await timeout(50) // debounce visit requests, for decrease load on process
        const visits = await getPageVisists({ url: pageUrl })
        if (visits.length === 0)
            continue

        const lastVisit = visits[visits.length - 1]
        if (lastVisit.visitTime)
            result[pageUrl] = lastVisit.visitTime
    }

    return result
}


const timeout = (time: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, time)
})

