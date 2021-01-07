import React from 'react'
import logo from '../../assets/img/logo.svg'
import { toGraphPage, toOptionsPage } from '../../routing'
import './Popup.scss'

const Popup = () => (
  <div className="App">
    <header className="App-header">
      <div className="logo-and-header" onClick={() => toGraphPage()}>
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Mind History</h3>
      </div>

      <p>
        <div className="links">
          <a onClick={() => toGraphPage()}>Graph page</a>
          <a onClick={toOptionsPage}>Options page</a>
        </div>
      </p>
    </header>
  </div>
)

export default Popup

