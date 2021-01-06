import { getPageVisists } from "./onVisitPage"
import { store, actions } from './store'
import { PagesVisistTimeDictianory } from "./store/actions"

export async function updatePagesVisits() {
    const { pages } = store.getState()
    const urls = Object.keys(pages)
    console.log('Start load visits for', urls.length, 'pages')
    const pagesAccessTime: PagesVisistTimeDictianory = {}

    for (const pageUrl of urls) {
        await timeout(50) // debounce visit requests, for decrease load on process
        const visits = await getPageVisists({ url: pageUrl })
        if (visits.length === 0) {
            continue
        }

        const lastVisit = visits[visits.length - 1]
        if (lastVisit.visitTime)
            pagesAccessTime[pageUrl] = lastVisit.visitTime
    }

    store.dispatch(actions.updatePagesVisitsTime(pagesAccessTime))
    console.log('Loading completed')
}


const timeout = (time: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, time)
})

