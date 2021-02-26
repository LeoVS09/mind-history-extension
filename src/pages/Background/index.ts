import '../../assets/img/icon-34.png'
import '../../assets/img/icon-128.png'
import { registerOnVisitPageHook } from './onVisitPage'
import { registerOnWillOpenPageHook } from './willOpenPage'
import { registerDataBasListener } from './data-bus'
import { updatePagesVisits } from './loadVisits'
import { TabsStateProducer, OpenTabsListener } from './eventProducers'
import { PageDatabasePouchDbAdapter } from './database/pages'
import { VisitsDatabasePouchDbAdapter } from './database/visits'
import { HistoryBuilder } from '../../buildHistory'
import { PagesHistory } from '../../closeOldPages'

console.log('Background script started...')

function main() {

    // database
    const pagesDatabase = new PageDatabasePouchDbAdapter()
    const visitsDatabase = new VisitsDatabasePouchDbAdapter()

    // core
    const historyBuilder = new HistoryBuilder(pagesDatabase, visitsDatabase)
    const pagesHistory = new PagesHistory(pagesDatabase, visitsDatabase) // TODO

    // event producers
    const tabsStateProducer = new TabsStateProducer(historyBuilder)
    const openTabsListener = new OpenTabsListener(historyBuilder, pagesHistory)

    openTabsListener.register()
    registerOnVisitPageHook()
    registerOnWillOpenPageHook()
    registerDataBasListener()

    tabsStateProducer.updateOpenPages()
    updatePagesVisits()
}

main()