import { PageVisitModel } from "../../../../../domain"
import { PouchDbCollection } from "./collection"

export class VisitsCollection extends PouchDbCollection<PageVisitModel> {

    async findByTime(from: number, to?: number) {
        await this.createIndex({
            index: {
                fields: ['time']
            }
        })

        return await this.find({
            selector: buildTimeSelector(from, to)
        })

    }
}

export const visit = new VisitsCollection()

function buildTimeSelector(from: number, to?: number): PouchDB.Find.Selector {
    const greaterThenFrom = { time: { '$gte': from } } // inclusev
    const lessThenTo = { time: { '$lte': to } } // inclusev

    if (!to)
        return greaterThenFrom

    return {
        $and: [
            greaterThenFrom,
            lessThenTo,
        ]
    }
}

export default visit