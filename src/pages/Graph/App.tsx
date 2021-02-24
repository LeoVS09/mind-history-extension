import React from 'react'
import { useSelector } from 'react-redux'
import { PageVisitModel } from '../../domain'
import { PageDataDictanory } from '../../types'
import Routes from './Routes'
import { PagesStore } from './store/reducer'
import './App.scss'

export const App: React.FC = () => {
    const pages = useSelector<PagesStore, PageDataDictanory>(state => state.pages)
    const history = useSelector<PagesStore, Array<PageVisitModel>>(state => state.history)

    return (
        <div className="App">
            <Routes
                pages={pages}
                history={history}
            />
        </div>
    )
}

export default App