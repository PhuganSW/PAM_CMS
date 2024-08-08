import app from './Config'
import {getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut
        , sendPasswordResetEmail } from "firebase/auth";
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

      signin=async(email,password,success,unsuccess)=>{
        signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user)
          success(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          unsuccess(errorCode,errorMessage)
        });
      }

      checksignin=(suc)=>{
       // const u = this.auth.currentUser;
        //console.log(u)
        onAuthStateChanged(this.auth, (user) => {
          if(user){
            //console.log(user)
            suc(user)
          }
        })
      }

      signOut=(success)=>{
        signOut(this.auth).then(() => {
          // Sign-out successful.
          success()
        }).catch((error) => {
          // An error happened.
        });
      }

      resetPassword = (uid, newPassword, success, unsuccess) => {
        const resetPasswordFunction = httpsCallable(this.functions, 'resetUserPassword');
        resetPasswordFunction({ uid, newPassword })
            .then((result) => {
                console.log(result.data.message);
                success();
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
                unsuccess(error);
            });
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