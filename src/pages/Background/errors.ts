
export class NotHavePermissionError extends Error {
    constructor(permission: string, reason: string) {
        super(`Not have permission "${permission}", for: ${reason}`)
    }
}