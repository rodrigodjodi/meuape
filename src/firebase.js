import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
const app = firebase.initializeApp({
  apiKey: "AIzaSyA2Iimxi5jfoxy20NLZ9L1wrXOnt1HXJyY",
  authDomain: "sistema-pmnt.firebaseapp.com",
  databaseURL: "https://sistema-pmnt.firebaseio.com",
  projectId: "sistema-pmnt"
});
export const actionCodeSettings = {
  handleCodeInApp: true
};
export const auth = app.auth();
export const db = app.database();
export const incc = db.ref("incc");
export const unidades = db.ref("unidades");
