var admin = require('firebase-admin');
var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bsm-android-afb5f.firebaseio.com"
});