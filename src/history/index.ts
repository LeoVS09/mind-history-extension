
export interface PageData {
    title?: string;
    favIconUrl?: string;
    lastAccessTime?: number
    creationTime?: number;
    isClosed?: boolean
}

export interface PageVisit {
    from?: string;
    to: string
    time: number;
}

export * from './filter'