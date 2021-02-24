
// TODO: test
// sort params and remove fragment
export function normaliseUrl(rawUrl: string): string {
    const url = new URL(rawUrl)

    const { searchParams } = url
    searchParams.sort()

    return `${url.protocol}${url.host}${url.pathname}${searchParams.toString()}`
}

export function timestampToId(timestamp: number): string {
    return `${timestamp}`
}