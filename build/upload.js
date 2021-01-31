const config = {
    extensionId: process.env.CHROME_EXTENSION_ID,
    clientId: process.env.CHROME_CLIENT_ID,
    clientSecret: process.env.CHROME_CLIENT_SECRET,
    refreshToken: process.env.CHROME_CLIENT_REFRESH_TOKEN
}
checkConfig(config)

const webStore = require('chrome-webstore-upload')(config)
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const archiver = require('archiver')

const BUILD_DIR = path.join(__dirname, '../dist')
const UPLOAD_FILENAME = path.join(BUILD_DIR, `../mind-history-v${pkg.version}.zip`)
const PUBLISH_TARGET = 'default'

async function main() {
    try {
        await zipDirectory(BUILD_DIR, UPLOAD_FILENAME)
        await upload(UPLOAD_FILENAME, PUBLISH_TARGET)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
main()

async function zipDirectory(dir, filename) {
    const output = fs.createWriteStream(filename)
    const archive = archiver('zip')

    const saved = new Promise(resolve => output.on('close', resolve))


    output.on('end', () => console.log('Data has been drained'))

    archive.pipe(output)

    console.log('Start archiving from', dir)
    archive.directory(dir, false)
    archive.finalize()

    await saved
    console.log(archive.pointer() + ' total bytes')
    console.log('Archive saved to', filename)
}

async function upload(filename, target) {
    const token = await webStore.fetchToken()

    const file = fs.createReadStream(filename)

    console.log('Start uploading', filename)
    await webStore.uploadExisting(file, token)
    console.log('Uploaded, publishhing...')

    await webStore.publish(target, token)
    console.log('Extension published')
}

function checkConfig(options) {
    const emptyFields = []
    for (const key in options) {
        if (!options[key])
            emptyFields.push(key)
    }

    if (emptyFields.length) {
        console.log('Cannot find configuration fields:', emptyFields.join(', '))
        process.exit(1)
    }
}