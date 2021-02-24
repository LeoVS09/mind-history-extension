export interface PageVisitModel {
    from: string;
    to: string
    time: number;
}

export interface PageModel {
    url: string;
    title?: string;
    favIconUrl?: string;
    lastAccessedAt?: number
    openedAt?: number;
    isOpen: boolean
}

export interface TabModel {
    url: string;
    index?: number;
}


export interface PageModelDictanory {
    [url: string]: PageModel
}