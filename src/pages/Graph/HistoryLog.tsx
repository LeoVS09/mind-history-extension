import React from 'react'
import { PageDataDictanory } from '../../types'
import { PageData, PageVisit } from '../../history'

export interface HistoryLogProps {
    pages: PageDataDictanory
    history: Array<PageVisit>
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ pages, history }) => (
    <div className="history-log">
        <h1>Mind history log</h1>
        <p>Fount items {history.length}</p>
        <ul>
            {history.map((visit, i) => {
                const fromPage = visit.from ? pages[visit.from] : undefined
                const toPage = visit.to ? pages[visit.to] : undefined

                return <li key={`${visit.from}:${visit.to}:${i}`}>From: <PageLink url={visit.from} page={fromPage} /> {'->'} to <PageLink url={visit.to} page={toPage} /></li>
            })}
        </ul>
    </div>
)

const PageLink: React.FC<{ url?: string, page?: PageData }> = ({ url, page }) => {
    if (url && page?.title) {
        return <a href={url}>{page.title}</a>
    }

    if (url) {
        return <a href={url}>{url}</a>
    }

    if (page?.title) {
        return <a href='#'>{page.title}</a>
    }

    return <a href='#'>Unknown</a>
}
