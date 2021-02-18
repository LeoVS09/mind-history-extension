
export interface PageData {
    title?: string;
    favIconUrl?: string;
    lastAccessedAt?: number
    openedAt?: number;
    isClosed?: boolean
}

export interface PageDataDictanory {
    [url: string]: PageData
}