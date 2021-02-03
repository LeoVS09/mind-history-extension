// Based on https://github.com/balvin-perrie/Access-Control-Allow-Origin---Unblock/blob/master/src/background.js

const prefs = {
    'enabled': false,
    'overwrite-origin': true,
    'methods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'PROPFIND', 'PROPPATCH', 'MKCOL', 'COPY', 'MOVE', 'LOCK'],
    'remove-x-frame': true,
    'allow-credentials': true,
    'allow-headers-value': '*',
    'allow-origin-value': '*',
    'expose-headers-value': '*',
    'allow-headers': true,
    'unblock-initiator': true
}

export function onResponseListener(details: chrome.webRequest.WebResponseHeadersDetails) {
    if (details.type === 'main_frame')
        return

    const { initiator, url, responseHeaders = [] } = details
    let origin = ''

    if (prefs['unblock-initiator']) {
        try {
            const o = new URL(initiator || url)
            origin = o.origin
        }
        catch (e) {
            console.warn('cannot extract origin for initiator', initiator)
        }
    }
    else
        origin = '*'


    if (prefs['overwrite-origin'] === true) {
        const o = responseHeaders.find(({ name }) => name.toLowerCase() === 'access-control-allow-origin')

        if (o)
            o.value = origin || prefs['allow-origin-value']

        else {
            responseHeaders.push({
                'name': 'Access-Control-Allow-Origin',
                'value': origin || prefs['allow-origin-value']
            })
        }
    }
    if (prefs.methods.length > 3) { // GET, POST, HEAD are mandatory
        const o = responseHeaders.find(({ name }) => name.toLowerCase() === 'access-control-allow-methods')
        if (o)
            o.value = prefs.methods.join(', ')

        else {
            responseHeaders.push({
                'name': 'Access-Control-Allow-Methods',
                'value': prefs.methods.join(', ')
            })
        }
    }
    if (prefs['allow-credentials'] === true) {
        const o = responseHeaders.find(({ name }) => name.toLowerCase() === 'access-control-allow-credentials')
        if (o)
            o.value = 'true'

        else {
            responseHeaders.push({
                'name': 'Access-Control-Allow-Credentials',
                'value': 'true'
            })
        }
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
    if (prefs['allow-headers'] === true) {
        const o = responseHeaders.find(({ name }) => name.toLowerCase() === 'access-control-allow-headers')
        if (o)
            o.value = prefs['allow-headers-value']

        else {
            responseHeaders.push({
                'name': 'Access-Control-Allow-Headers',
                'value': prefs['allow-headers-value']
            })
        }
    }
    if (prefs['allow-headers'] === true) {
        const o = responseHeaders.find(({ name }) => name.toLowerCase() === 'access-control-expose-headers')
        if (o)
            o.value = prefs['expose-headers-value']

        else {
            responseHeaders.push({
                'name': 'Access-Control-Expose-Headers',
                'value': prefs['expose-headers-value']
            })
        }
    }
    if (prefs['remove-x-frame'] === true) {
        const i = responseHeaders.findIndex(({ name }) => name.toLowerCase() === 'x-frame-options')
        if (i !== -1)
            responseHeaders.splice(i, 1)

    }
    return { responseHeaders }
};