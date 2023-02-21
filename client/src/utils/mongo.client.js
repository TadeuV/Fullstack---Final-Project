import * as Realm from "realm-web";

export const app = new Realm.App({id: import.meta.env.VITE_REALM_APP_ID});
const credentials = Realm.Credentials.anonymous();
export const grocery = await app.logIn(credentials);

const mongo = app.currentUser.mongoClient("mongodb-atlas")
export const collection = mongo.db("FullStack-GrocerApp").collection("grocerapp-col")


// export async function loginCredentials(email,password){

//     const credentials = Realm.Credentials.emailPassword(email,password)
//     return credentials

// }





