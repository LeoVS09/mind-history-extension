import React from 'react'
import { PageDataDictanory } from '../../types'
import { PageVisitModel } from '../../domain'
import { HistoryLog } from './views/HistoryLog'
import { MindGraph } from './views/MindGraph'
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom"
import { useQuery } from './router'

/**
 * Chrome not allow create page with multiple routes, like /mind-graph/page/:id
 * We will use guery params instead
 */

export enum Views {
  HISTORY_LOG = 'history-log',
  MIND_GRAPH = 'graph',
}

export const pagePrefix = '/graph.html'

export const buildViewPath = (view: string) => `${pagePrefix}?view=${view}`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navigation: React.FC = () => (
  <nav>
    <ul>
      <li>
        <Link to={buildViewPath(Views.MIND_GRAPH)}>Graph</Link>
      </li>
      <li>
        <Link to={buildViewPath(Views.HISTORY_LOG)}>Log</Link>
      </li>
    </ul>
  </nav>
)

export interface RoutesProps {
  pages: PageDataDictanory
  history: Array<PageVisitModel>
}

const PagesComponent: React.FC<RoutesProps> = (props) => {
  const { view, node } = useQuery()
  if (view === Views.HISTORY_LOG)
    return <HistoryLog {...props} />


  const nodeUrl = node && decodeURIComponent(node as string)

  return <MindGraph {...props} nodeUrl={nodeUrl} />
}



const Routes: React.FC<RoutesProps> = (props) => (
  <Router>
    <div>
      {/* <Navigation /> */}
      <PagesComponent {...props} />
    </div>
  </Router>
)

export default Routes