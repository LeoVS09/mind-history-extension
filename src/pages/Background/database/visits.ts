import { PageVisitModel } from "../../../domain"
import { now } from "../time"

export async function add(visit: PageVisitModel): Promise<void> {
    const currentTimeNumber: number = now()
    const currentDayNumber: number = toDay(currentTimeNumber)

    // chrome allow store only 512 items
    // so will split days to namespaces with 256 possible variations (other 256 for pages)

    const day = await this.visits.get(currentDayNumber) || []
    day.push(visit)

    await this.visits.save(currentDayNumber, day)
}

export async function get(from: number, to: number): Promise<PageVisitModel[]> {
    return []
}