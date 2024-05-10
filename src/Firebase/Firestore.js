//Firestore.js
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";

class FireStore{
  constructor(){
    this.db = getFirestore(app);
  }

  addAccount= async (id,item)=>{
    try {
      const docRef = await setDoc(doc(this.db, "account_cms", id), item);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  deleteAccount= async (id)=>{
    await deleteDoc(doc(this.db, "account_cms", id));
  }

  getAllAccount = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "account_cms"), (querySnapshot) => {
      const allaccount = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allaccount.push({
          id: doc.id,
          email: data.email,
          name: data.name,
          position: data.position,
          level: data.level
        });
      });
      success(allaccount);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  getUser=(id,success,unsuccess)=>{
    var docRef = this.db.collection('users').doc(id);
    docRef
    .get()
    .then((doc)=>{
      success(doc.data())
    })
    .catch((error)=>{
      unsuccess(error)
    })

  }

  updateUser=(id,data,success,unsuccess)=>{
    console.log(id)
    var ref = this.db.collection('users').doc(id);
    ref
    .update({
      address:data.address,
      tel:data.tel,
      quote:data.quote,
      image:data.image,
    })
    .then(()=>{
      success();
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }

  deleteUser=async(id)=>{
    await deleteDoc(doc(this.db, "users", id));
  }

  getAllUser = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "users"), (querySnapshot) => {
      const allaccount = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allaccount.push({
          id: doc.id,
          name: data.name+" "+data.lastname,
          position: data.position,
        });
      });
      success(allaccount);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };
}

const firestore = new FireStore();
export default firestore;