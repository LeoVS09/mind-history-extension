import PouchDB from "pouchdb"
import findPlugin from "pouchdb-find"

const PRODUCTION_DATABASE_KEY = 'mind_history'
const TESTING_DATABASE_KEY = process.env.TEST_STORAGE ? `mind_history/testing/${process.env.TEST_STORAGE}` : false
const LOCAL_DATABASE_KEY = TESTING_DATABASE_KEY || PRODUCTION_DATABASE_KEY

if (TESTING_DATABASE_KEY)
    console.log('Testing storage enabled, will use key', LOCAL_DATABASE_KEY)


PouchDB.plugin(findPlugin)

export const db = new PouchDB(LOCAL_DATABASE_KEY)

export default db