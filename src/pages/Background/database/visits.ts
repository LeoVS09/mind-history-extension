import { PageVisitModel } from "../../../domain"
import { IVistsPersistence } from "../../../buildHistory/interfaces"
import { pouchDB } from "./drivers"
import { timestampToId } from "./uid"

export class VisitsDatabasePouchDbAdapter implements IVistsPersistence {

    async add(visit: PageVisitModel) {
        const id = timestampToId(visit.time)

        await pouchDB.visits.put({
            _id: id,
            ...visit
        })
    }

    async get(from: number, to?: number): Promise<Array<PageVisitModel>> {
        return pouchDB.visits.findByTime(from, to)
    }
}