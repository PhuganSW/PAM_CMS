import app from './Config'
import {getAuth,createUserWithEmailAndPassword } from "firebase/auth";

class Auth {
    constructor(){
        this.auth = getAuth(app)
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
}

const auth = new Auth()

export default auth;