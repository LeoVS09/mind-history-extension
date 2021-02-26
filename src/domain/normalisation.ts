import { PageModel } from "./models"

// TODO: test
// sort params and remove fragment
export function normaliseUrl(rawUrl: string): string {
    const url = new URL(rawUrl)

    const { searchParams } = url
    searchParams.sort()

    return `${url.protocol}${url.host}${url.pathname}${searchParams.toString()}`
}

export const normalisePage = (page: PageModel): PageModel => ({
    ...page,
    url: normaliseUrl(page.url),
})
