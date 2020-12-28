import React from 'react';
// @ts-ignore
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { PageDataDictanory } from '../../types'
import { PageData, PageVisit } from '../../history';

export interface NewTabProps {
  pages: PageDataDictanory
  history: Array<PageVisit>
}

const Newtab: React.FC<NewTabProps> = ({ pages, history }) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mind history log</h1>
        <p>Fount items {history.length}</p>
        <ul>
          {history.map(visit => {
            const fromPage = visit.from ? pages[visit.from] : undefined;
            const toPage = visit.to ? pages[visit.to] : undefined;

            return <li>From: <PageLink url={visit.from} page={fromPage} /> {'->'} to <PageLink url={visit.to} page={toPage} /></li>
          })}
        </ul>
      </header>
    </div>
  );
};

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

export default Newtab;
