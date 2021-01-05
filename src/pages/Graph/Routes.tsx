import React, { useState } from 'react'
import { PageDataDictanory } from '../../types'
import { PageVisit } from '../../history'
import { HistoryLog } from './HistoryLog'
import { MindGraph } from './MindGraph'

export enum Pages {
  HISTORY_LOG = 'History Log',
  MIND_GRAPH = 'MIND GRAPH',
}

export interface NewTabProps {
  pages: PageDataDictanory
  history: Array<PageVisit>
}

const Routes: React.FC<NewTabProps> = (props) => {
  const [page] = useState(Pages.MIND_GRAPH)

  if (page === Pages.HISTORY_LOG) {
    return <HistoryLog {...props} />
  }

  if (page === Pages.MIND_GRAPH) {
    return <MindGraph {...props} />
  }

  return (
    <h1>Not found</h1>
  )
}

export default Routes
