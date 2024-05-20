//Firestore.js
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, onSnapshot, 
        deleteDoc, updateDoc  } from "firebase/firestore";

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

  addUser= async (item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "users"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getUser=async(id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }catch(e){
      unsuccess(e)
    }
  }

  updateUser=async(id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "users", id);

      
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
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

  getLeave=async(id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "leaveRequest", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }catch(e){
      unsuccess(e)
    }
  }

  updateLeave=async(id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "leaveRequest", id);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getAllLeave = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "leaveRequest"), (querySnapshot) => {
      const allLeave = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allLeave.push({
          id:doc.id,
          date: data.dateStart,
          name: data.name,
          state: data.state1,
        });
      });
      success(allLeave);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  getOT=async(id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "otRequest", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }catch(e){
      unsuccess(e)
    }
  }


  getAllOT = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "otRequest"), (querySnapshot) => {
      const allOT = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allOT.push({
          id:doc.id,
          date: data.date,
          name: data.name,
          time:data.timeStart+"-"+data.timeEnd ,
          state: data.status,
        });
      });
      success(allOT);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  addAnnouce= async (item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "annouce"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  updateAnnouce=async(id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "annouce", id);
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getAnnouce=async(id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "annouce", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }catch(e){
      unsuccess(e)
    }
  }


  getAllAnnouce = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "annouce"), (querySnapshot) => {
      const allAnnouce = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allAnnouce.push({
          id:doc.id,
          title:data.title,
          date: data.date,
        });
      });
      success(allAnnouce);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  deleteAnnouce=async(id)=>{
    await deleteDoc(doc(this.db, "annouce", id));
  }

}

const firestore = new FireStore();
export default firestore;