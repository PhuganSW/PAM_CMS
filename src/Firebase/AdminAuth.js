//AdminAuth.js
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import app from "./Config";

class AuthAdmin {
  constructor() {
    this.auth = getAuth(app); // ใช้ Firebase Auth instance สำหรับ Admin
  }

  signin(email, password, onSuccess, onError) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        onSuccess(userCredential.user);
      })
      .catch((error) => {
        onError(error.code, error.message);
      });
  }

  checksignin(onAdminChanged) {
    return onAuthStateChanged(this.auth, (admin) => {
      onAdminChanged(admin);
    });
  }

  signout(onSuccess, onError) {
    signOut(this.auth)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

export default new AuthAdmin();

