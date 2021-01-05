import React from 'react'
import { PageDataDictanory } from '../../types'
import { PageVisit } from '../../history'
import { HistoryLog } from './views/HistoryLog'
import { MindGraph } from './views/MindGraph'
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation
} from "react-router-dom"

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
  history: Array<PageVisit>
}

const PagesComponent: React.FC<RoutesProps> = (props) => {
  const { view, node } = usePageParams()
  if (view === Views.HISTORY_LOG) {
    return <HistoryLog {...props} />
  }

  return <MindGraph {...props} nodeUrl={node} />
}

function usePageParams(): { view: string | null, node?: string | null } {
  const query = useQuery()
  return {
    view: query.get('view'),
    node: query.get('node')
  }
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
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