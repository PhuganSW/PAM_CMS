import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
    apiKey: "AIzaSyBsp1zwRSH_PbMnuvzXSAyGg0JCMtb5JnQ",
    authDomain: "pamproject-a57c5.firebaseapp.com",
    projectId: "pamproject-a57c5",
    storageBucket: "pamproject-a57c5.appspot.com",
    messagingSenderId: "380569338900",
    appId: "1:380569338900:web:1bcbb280dae2f867a49301",
    measurementId: "G-QNF2C257P7"
  };

const app = initializeApp(config);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

  