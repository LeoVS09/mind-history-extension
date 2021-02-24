import { db } from "./pouchDb"
import { Existing, PouchDbCollection } from './collection'
import { PageModel } from "../../../../../domain"

export class PagesCollection extends PouchDbCollection<PageModel> {

    async findAllOpen() {
        await this.createIndex({
            index: {
                fields: ['isOpen']
            }
        })

        return await this.find({
            selector: {
                isOpen: true
            }
        })
    }
}

export const pages = new PagesCollection()

export default pages