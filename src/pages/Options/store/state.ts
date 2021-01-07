import { ExtensionSettings, initialSettings } from "../../../settings"

export interface OptionsState {
    isLoading: boolean
    settings: ExtensionSettings
}

export const initialState: OptionsState = {
    isLoading: true,
    settings: initialSettings
}