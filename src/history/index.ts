
export interface Page {
    url: string;
    title?: string;
    favIconUrl?: string;
}


export interface PageVisit {
    from?: Page
    to: Page
    time: number;
}

export class PageHistory {
    history: Array<PageVisit>

    constructor(history: Array<PageVisit> = []) {
        this.history = history
    }

    push(to: Page, time: number, from?: Page) {
        this.history.push({
            from,
            to,
            time,
        })
        this.show()
    }

    show() {
        const result = []
        for (const visit of this.history) {
            result.push(`${visit.from?.url} -> ${visit.to.url} | ${new Date(visit.time)}`)
        }

        console.log(result.join('\n\n '))
    }
}