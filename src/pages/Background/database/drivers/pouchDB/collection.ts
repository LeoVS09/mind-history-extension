import db from "./pouchDb"

export type NewDocument<T> = PouchDB.Core.Document<T>
export type Existing<T> = PouchDB.Core.ExistingDocument<T>

export class PouchDbCollection<T> {

    get(id: string): Promise<Existing<T> | undefined> {
        return db.get(id)
    }

    async put(doc: NewDocument<T> | Existing<T>) {
        const response = await db.put(doc)
        if (isResponseError(response))
            throw new PouchDbError(response, 'Cannot put document')
    }

    async bulkDocs(docs: Array<NewDocument<T> | Existing<T>>) {
        const response = await db.bulkDocs(docs)
        const errors = response.filter(isResponseError)
        if (!errors.length)
            return

        if (docs.length !== errors.length)
            throw new PouchDbError(response, 'Full batch bulk docs failed')

        throw new PouchDbError(response, 'Bulk docs partial failed')
    }

    async getAllById(ids: Array<string>): Promise<Array<Existing<T>>> {
        const { rows } = await db.allDocs<Existing<T>>({
            keys: ids, // can include deleted entities
            include_docs: true, // without it will contain only id and rev
        })

        return rows
            // Can be if document not exists
            // @ts-ignore: Property 'error' does not exist on type
            .filter(row => !row.error && !!row.doc)
            // remove deleted documents
            .filter(row => !row.value.deleted)
            .map(row => row.doc!)
    }

    // Will do nothing if index already exists
    async createIndex(...index: Parameters<typeof db.createIndex>) {
        try {
            const { result } = await db.createIndex(...index)
            if (result === 'created')
                console.log('Index for', ...index, 'was created successfully')
            else
                console.warn('Index for', ...index, 'is', result) // in case of index already exists

        } catch (err) {
            console.error('Error create index for opened pages\n', err)
            throw err
        }
    }


    async find(request?: PouchDB.Find.FindRequest<T>) {
        const { docs } = await db.find(request)

        return docs as Array<Existing<T>>
    }

}

export function isResponseError(res: PouchDB.Core.Response | PouchDB.Core.Error): res is PouchDB.Core.Error {
    // @ts-ignore
    return !res.ok || res.error
}

export type OneOrMoreResponses = ((PouchDB.Core.Response | PouchDB.Core.Error) | Array<PouchDB.Core.Response | PouchDB.Core.Error>)

export class PouchDbError extends Error {
    response: OneOrMoreResponses

    constructor(response: OneOrMoreResponses, message: string) {
        super(message)
        this.response = response
    }
}