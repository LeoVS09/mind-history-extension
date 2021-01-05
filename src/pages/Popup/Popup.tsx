import React from 'react'
import logo from '../../assets/img/logo.svg'
import './Popup.scss'

const Popup = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" onClick={toGraphPage} />
      <p>
        Mind History Extension.
        <div className="links">
          <a onClick={toGraphPage}>Graph page</a>
          <a onClick={toOptionsPage}>Options page</a>
        </div>
      </p>
    </header>
  </div>
)

export default Popup

const toGraphPage = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("graph.html") })
}

const toOptionsPage = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
}