import { initializeApp } from "firebase";
const app = initializeApp({
  apiKey: "AIzaSyA2Iimxi5jfoxy20NLZ9L1wrXOnt1HXJyY",
  authDomain: "sistema-pmnt.firebaseapp.com",
  databaseURL: "https://sistema-pmnt.firebaseio.com",
  projectId: "sistema-pmnt"
});

export const db = app.database();
export const incc = db.ref("incc");
export const unidades = db.ref("unidades");
