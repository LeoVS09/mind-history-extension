import React from 'react'
import { useDispatch } from 'react-redux'
import { ExtensionSettings } from '../../settings'
import './Options.scss'
import { actions } from './store'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

export interface OptionsProps {
  settings: ExtensionSettings
}

const ONE_MINUTE = 60 * 1000 // in ms 
const EXPIRATION_STEPS = ONE_MINUTE

const Options: React.FC<OptionsProps> = ({ settings }) => {

  const dispatch = useDispatch()

  let pageExirationTime = settings.pageExirationTime / EXPIRATION_STEPS
  if (pageExirationTime <= 0)
    pageExirationTime = 1

  const updateSettings = (newValue: Partial<ExtensionSettings>) => dispatch(actions.changeSettings({
    ...settings,
    ...newValue
  }))

  return (
    <div className="Options">
      <div className="configuration">

        <div className="configuration-row">
          <FormControlLabel
            label="Close page automatically"
            control={
              <Switch
                name="isClosePagesAutomatically"
                checked={!!settings.isClosePagesAutomatically}
                onChange={event => updateSettings({
                  isClosePagesAutomatically: event.target.checked
                })}
              />
            }
          />

          <TextField
            label="Page expiration minutes"
            value={settings.pageExirationTime / EXPIRATION_STEPS}
            onChange={event => updateSettings({
              pageExirationTime: (+event.target.value) * EXPIRATION_STEPS
            })}
            disabled={!settings.isClosePagesAutomatically}
          />
        </div>

        <p className="description">
          If enabled, when open new tab and old pages group not was active last {pageExirationTime} minute(s) group will be closed
        </p>
      </div>
    </div>
  )
}

export default Options
