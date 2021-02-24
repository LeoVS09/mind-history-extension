




export function save(state: Object) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
        console.error('Cannot save state, history will be lost when browser will be closed\n', err)
    }
}

export function retrive<T extends Object>(): T | undefined {
    try {
        const item = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!item)
            return

        return JSON.parse(item)
    } catch (err) {
        console.error('Cannot recover state from local storage\n', err)
    }
}