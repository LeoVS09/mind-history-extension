import { tabs } from '../browser'
import { installUnblockers } from './install'

export interface ResourcesUrlGetter {
    (): Array<string>;
}

/** 
 * Favicons can be blocked by CORS polycies in chrome, 
 * if load them from from other sites in extension tab
 * */
export async function unblockResourcesLoading(getUrls: ResourcesUrlGetter) {
    // TODO: unblock only given urls
    const { id } = await tabs.getScriptTab()
    if (!id)
        throw new Error("Cannot get id of current tab")

    installUnblockers(id)
}