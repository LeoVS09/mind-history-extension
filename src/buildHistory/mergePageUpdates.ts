import { PageModel } from "../domain"


/** Merge changes with existing page and return new version */
export function mergeUpdates<T extends PageModel>(old: T, updates: PageModel): T {
    return {
        ...old,
        title: updates.title || old.title,
        favIconUrl: updates.favIconUrl || old.favIconUrl,
        lastAccessedAt: lastOf(old.lastAccessedAt, updates.lastAccessedAt),
        openedAt: old.openedAt || updates.openedAt,
    }
}

function lastOf(a: number | undefined, b: number | undefined): number | undefined {
    if (a && b)
        return Math.max(a, b)

    return a || b
}