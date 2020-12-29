import React, { useState } from 'react';
import './Newtab.scss';
import { PageDataDictanory } from '../../types'
import { PageData, PageVisit } from '../../history';
import { HistoryLog } from './HistoryLog';

export enum Pages {
  HISTORY_LOG = 'History Log'
}

export interface NewTabProps {
  pages: PageDataDictanory
  history: Array<PageVisit>
}

const Newtab: React.FC<NewTabProps> = ({ pages, history }) => (
  <div className="App">
    <Router
      pages={pages}
      history={history}
    />
  </div>
);

const Router: React.FC<NewTabProps> = (props) => {
  const [page, toPage] = useState(Pages.HISTORY_LOG);

  if (page === Pages.HISTORY_LOG) {
    return <HistoryLog {...props} />;
  }

  return (
    <h1>Not found</h1>
  )
}

export default Newtab;
