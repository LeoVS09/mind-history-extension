import React from 'react'
import { useSelector } from 'react-redux'
import { ExtensionSettings } from '../../settings'
import './App.scss'
import Options from './Options'
import { OptionsState } from './store/state'
import CircularProgress from '@material-ui/core/CircularProgress'

const App: React.FC = () => {
    const settings = useSelector<OptionsState, ExtensionSettings>(state => state.settings)
    const isLoading = useSelector<OptionsState, boolean>(state => state.isLoading)
    return (
        <div className="App">
            <h2>Mind History settings</h2>
            {isLoading
                ? <div className="progress"><CircularProgress /></div>
                : <Options settings={settings} />
            }
        </div>
    )
}

export default App