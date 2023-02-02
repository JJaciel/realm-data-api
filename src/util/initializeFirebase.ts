import admin from "firebase-admin";

import { getGoogleAppCredentialsPath } from "./envVars";

const credential = admin.credential.cert(getGoogleAppCredentialsPath());

export function initializeFirebase() {
  admin.initializeApp({
    credential,
  });
}
