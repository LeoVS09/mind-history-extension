import { ExistingPageStorageItem, PageStorageItem } from "."
import { db } from "./pouchDb"

export function get(id: string): Promise<ExistingPageStorageItem | undefined> {
    return db.get(id)
}

export async function create(page: PageStorageItem) {
    const response = await db.put(page)
    if (!response.ok) {
        console.error('Response for page creation', response)
        throw new Error('Cannot create page')
    }
}

export async function batchCreate(pages: Array<PageStorageItem>) {
    const response = await db.bulkDocs(pages)
    // @ts-ignore
    const errors = response.filter(r => !r.ok || r.error)
    if (!errors.length)
        return

    if (pages.length !== errors.length) {
        console.error('Full batch create failed\n', errors)
        throw new Error('Brach create fully failed')
    }

    console.error('Batch create page partial error', errors)
    throw new Error('Batch create partial failed')
}

export async function update(page: ExistingPageStorageItem) {
    const response = await db.put(page)
    if (!response.ok) {
        console.error('Response for page update', response)
        throw new Error('Cannot update page')
    }
}


export async function batchUpdate(pages: Array<ExistingPageStorageItem>) {
    return awa
}

export async function getAllById(ids: Array<string>): Promise<Array<ExistingPageStorageItem>> {
    const { rows } = await db.allDocs<ExistingPageStorageItem>({
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
async function createIndex(...index: Parameters<typeof db.createIndex>) {
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

export async function getAllOpen(): Promise<Array<ExistingPageStorageItem>> {
    await createIndex({
        index: {
            fields: ['isOpen']
        }
    })

    const { docs } = await db.find({
        selector: {
            isOpen: true
        }
    })

    return docs as Array<ExistingPageStorageItem>
}


