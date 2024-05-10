import app from './Config'
import {getAuth,createUserWithEmailAndPassword, } from "firebase/auth";

class Auth {
    constructor(){
        this.auth = getAuth(app)
       /* this.admin = require('firebase-admin');
        this.serviceAccount = require('./pamproject-a57c5-firebase-adminsdk-mh5a3-5ea1082565.json');

        this.admin.initializeApp({
          credential: this.admin.credential.cert(this.serviceAccount)
        });*/

    }

    createAccount=(email,password,success,unsuccess)=>{
        createUserWithEmailAndPassword(this.auth,email, password)
        .then((userCredential)=>{
          var user = userCredential.user
          success(user)
        })
        .catch((error)=>{
          unsuccess(error)
        })
      }
    /*deleteUser=(id)=>{
      this.admin.auth().deleteUser(id)
      .then(() => {
        console.log('Successfully deleted user');
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
    
    }*/
}

const auth = new Auth()

export default auth;