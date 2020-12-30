import React, { useState } from 'react';
import './Newtab.scss';
import { PageDataDictanory } from '../../types'
import { PageVisit } from '../../history';
import { HistoryLog } from './HistoryLog';
import { MindGraph } from './MindGraph';

export enum Pages {
  HISTORY_LOG = 'History Log',
  MIND_GRAPH = 'MIND GRAPH',
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
  const [page, toPage] = useState(Pages.MIND_GRAPH);

  if (page === Pages.HISTORY_LOG) {
    return <HistoryLog {...props} />;
  }

  if (page === Pages.MIND_GRAPH) {
    return <MindGraph {...props} />;
  }

  return (
    <h1>Not found</h1>
  )
}

export default Newtab;
