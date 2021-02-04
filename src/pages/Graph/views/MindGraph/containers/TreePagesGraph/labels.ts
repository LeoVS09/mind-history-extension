
export interface LabelableNode {
    title?: string;
    url: string;
}

const MAX_LABEL_SYMBOLS = 50

export function computeLabel({ title, url }: LabelableNode): string {
    if (title)
        return truncate(title, { max: MAX_LABEL_SYMBOLS, atEnd: false })

    return truncate(decodeURI(url), { max: MAX_LABEL_SYMBOLS })
}

export interface TruncateOptions {
    max: number
    atEnd?: boolean
    separator?: string
}

function truncate(input: string, { max, atEnd = true, separator = '...' }: TruncateOptions): string {
    if (input.length < max)
        return input

    if (atEnd)
        return input.substring(0, max) + separator

    const charsToShow = max - separator.length
    const leftLength = Math.ceil(charsToShow / 2)
    const rightLenght = Math.floor(charsToShow / 2)

    return `${input.substr(0, leftLength)}${separator}${input.substr(input.length - rightLenght)}`
};