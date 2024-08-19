const admin = require("firebase-admin")

const credentials = require("./firebase-perm.json")


admin.initializeApp({
    credential: admin.credential.cert(credentials)
})


const db = admin.firestore();



module.exports = db;