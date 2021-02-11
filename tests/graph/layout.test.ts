import { inChronicleOrder } from '../../src/graph/sort'

const createNode = (timestamp: number) => ({ id: 'url', timestamp })

describe("inChronicleOrder", () => {
    it('should sort nodes chronically in time', () => {
        const timestamps = [5, 4, 6, 3, 28, 10, 0]
        const nodes = timestamps.map(createNode)

        const sorted = nodes.sort(inChronicleOrder)

        expect(sorted).toEqual([0, 3, 4, 5, 6, 10, 28].map(createNode))
    })
})