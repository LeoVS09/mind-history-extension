import { createAction } from "@reduxjs/toolkit"
import { ExtensionSettings } from "../../../settings"

/** Change settings caused user from page */
export const changeSettings = createAction<ExtensionSettings>('CHANGE_SETTINGS')
/** Setting was loaded for background script */
export const setLoadedSettings = createAction<ExtensionSettings>('SET_LOADED_SETTINGS')