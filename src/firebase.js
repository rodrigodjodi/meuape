import { initializeApp } from "firebase";
const app = initializeApp({
  apiKey: "AIzaSyA2Iimxi5jfoxy20NLZ9L1wrXOnt1HXJyY",
  authDomain: "sistema-pmnt.firebaseapp.com",
  databaseURL: "https://sistema-pmnt.firebaseio.com",
  projectId: "sistema-pmnt"
});
export const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: process.env.VUE_APP_URL,
  handleCodeInApp: true
};
export const auth = app.auth();
export const db = app.database();
export const incc = db.ref("incc");
export const unidades = db.ref("unidades");
