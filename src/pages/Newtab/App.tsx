import React from 'react';
import { useSelector } from 'react-redux'
import { PageVisit } from '../../history';
import { PageDataDictanory } from '../../types';
import Newtab from './Newtab';
import { PagesStore } from './store/reducer';

export const App: React.FC = () => {
    const pages = useSelector<PagesStore, PageDataDictanory>(state => state.pages)
    const history = useSelector<PagesStore, Array<PageVisit>>(state => state.history)

    return (
        <Newtab
            pages={pages}
            history={history}
        />
    )
}

export default App