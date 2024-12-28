import admin from "firebase-admin";

const serviceAccount = require("./agrios-4f389-firebase-adminsdk-ihzk1-8f3f67bf0e.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
