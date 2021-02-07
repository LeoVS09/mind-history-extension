/**
 * Small package for working with matrixes
 * Currently best library which have matrix operations is `@tenserflow/tfjs`,
 * but it not have all required operations from python version
*/


/** Pad ragged matrix with given value */
export function raggedToSparse<T, R>(ragged: Array<Array<T>>, value: R): Array<Array<T | R>> {
    let max = 0

    for (const row of ragged) {
        if (row.length > max)
            max = row.length
    }

    return ragged.map(row => {
        const newRow = new Array(max).fill(value)

        row.forEach((cell, i) =>
            newRow[i] = cell
        )

        return newRow
    })

}