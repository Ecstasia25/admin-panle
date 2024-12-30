import admin from "firebase-admin";

const serviceAccount = require("./agrios-4f389-firebase-adminsdk-ihzk1-4febae374a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
