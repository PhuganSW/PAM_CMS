import app from './Config'
import {getAuth,createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';

class Auth {
    constructor(){
        this.auth = getAuth(app)
        this.functions = getFunctions(app);
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

      deleteUser = (uid, success, unsuccess) => {
        const deleteUserFunction = httpsCallable(this.functions, 'deleteUser');
        deleteUserFunction({ uid })
            .then((result) => {
                console.log(result.data.message);
                success();
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                unsuccess(error);
            });
    }
}

const auth = new Auth()

export default auth;