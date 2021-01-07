export interface ExtensionSettings {
    /** Define how long old search graph can be not accessable, before it will be closed */
    pageExirationTime: number
    isClosePagesAutomatically: boolean
}

const TWO_HOURS = 2 * 60 * 60 * 1000 // in ms 

export const initialSettings: ExtensionSettings = {
    pageExirationTime: TWO_HOURS,
    isClosePagesAutomatically: false
}