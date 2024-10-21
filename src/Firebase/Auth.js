//Auth.js
import app from './Config'
import {getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut
        , sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence,
        sendEmailVerification } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

class Auth {
  constructor(){
      this.auth = getAuth(app)
      this.functions = getFunctions(app);
      this.authStateListener = null;
      /* this.admin = require('firebase-admin');
      this.serviceAccount = require('./pamproject-a57c5-firebase-adminsdk-mh5a3-5ea1082565.json');

      this.admin.initializeApp({
        credential: this.admin.credential.cert(this.serviceAccount)
      });*/

  }

  createAccount = (email, password, success, unsuccess) => {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (success) {
          // Use success callback if provided
          success(user);
        }
        return user;  // Also return the user object for async/await
      })
      .catch((error) => {
        if (unsuccess) {
          // Use unsuccess callback if provided
          unsuccess(error);
        }
        throw error;  // Also throw error for async/await
      });
  };

  sendVerificationEmail = (user, success, unsuccess) => {
    sendEmailVerification(user)
      .then(() => {
        if (success) {
          success();  // Success callback (e.g., email sent)
        }
      })
      .catch((error) => {
        if (unsuccess) {
          unsuccess(error);  // Failure callback
        }
      });
  };

  signin = async (email, password, success, unsuccess) => {
    // Set session persistence
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(this.auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            success(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            unsuccess(errorCode, errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        unsuccess(errorCode, errorMessage);
      });
  }

  checksignin = (callback) => {
    // Enable the auth state listener if it's not already active
    if (!this.authStateListener) {
      this.authStateListener = onAuthStateChanged(this.auth, (user) => {
        callback(user);
      });
    }
  };

  signOut = (success) => {
    this.auth.signOut().then(() => {
      success();
    }).catch((error) => {
      console.log('Error signing out: ', error);
    });
  }

  resetPassword = (email, success, unsuccess) => {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('Password reset email sent!');
        success();
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        unsuccess(error);
      });
};

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
  };

  disableAuthStateListener = () => {
    if (this.authStateListener) {
      this.authStateListener();  // Unsubscribe the listener
      this.authStateListener = null;
    }
  };

  // Re-enable the auth state listener after registration or other processes
  enableAuthStateListener = () => {
    if (!this.authStateListener) {
      this.authStateListener = onAuthStateChanged(this.auth, (user) => {
        console.log('Auth state changed:', user);
      });
    }
  };
}

const auth = new Auth()

export default auth;