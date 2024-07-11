//Firestore.js
//import { image } from "html2canvas/dist/types/css/types/image";
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, onSnapshot, 
        deleteDoc, updateDoc, orderBy, query, where, getDocs  } from "firebase/firestore";

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
      success(docRef.id);
    }catch(e){
      unsuccess(e);
    }
  }

  addUsername= async (id,item,success,unsuccess)=>{
    try{
      const docRef = await setDoc(doc(this.db, "username", id), item);
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

  updateUsername=async(id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "username", id);

      
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  deleteUser=async(id)=>{
    await deleteDoc(doc(this.db, "users", id));
  }

  deleteUsername=async(id)=>{
    await deleteDoc(doc(this.db, "username", id));
  }

  getAllUser = (success, unsuccess) => {
    //const unsubscribe = onSnapshot(collection(this.db, "users"),orderBy("name","desc"), (querySnapshot) => {
      const q = query(collection(this.db, "users"), orderBy('name',"asc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allaccount = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allaccount.push({
          id: doc.id,
          name: data.name+" "+data.lastname,
          position: data.position,
          image_off:data.image_off,
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

  getAllCheckin = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "checkin"), (querySnapshot) => {
      const allcheckin = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allcheckin.push({
          id:doc.id,
          date: data.date,
          name: data.name,
          time: data.time,
          workplace: data.workplace,
          late: data.late,
        });
      });
      success(allcheckin);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  getAllCheckout = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "checkout"), (querySnapshot) => {
      const allcheckout = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allcheckout.push({
          id:doc.id,
          date: data.date,
          name: data.name,
          time: data.time,
          workplace: data.workplace,
          late: data.late,
        });
      });
      success(allcheckout);
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

  addWelth=async(item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "wealthfare"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  addBill=async(item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "Salary"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getBill=async(id,date,success,unsuccess)=>{
    try {
      const q = query(
        collection(this.db, "Salary"),
        where('id', '==', id),
        where('date', '==', date)
      );
  
      const querySnapshot = await getDocs(q);
      const bills = [];
      querySnapshot.forEach((doc) => {
        bills.push(doc.data());
      });
  
      if (bills.length > 0) {
        success(bills);
      } else {
        console.log("No such document!");
        success([]);
      }
    } catch (e) {
      unsuccess(e);
    }
  }

  getAllBill=(id,success,unsuccess)=>{
    const q = query(collection(this.db, "Salary"), where("id", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const allBill = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allBill.push({
        id: doc.id,
        uid: data.id,
        date: data.date,
      });
    });
    success(allBill);
  }, (error) => {
    console.error("Error getting documents: ", error);
    unsuccess(error);
  });

  // Return unsubscribe function to stop listening for updates
  return unsubscribe;
  }

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

  addCategory = async (category, success, unsuccess) => {
    try {
      const docRef = await addDoc(collection(this.db, "categories"), { name: category });
      success(docRef.id);
    } catch (e) {
      unsuccess(e);
    }
  };

  // Get all categories
  getAllCategories = (success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "categories"), (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        // categories.push({ id: doc.id, ...doc.data() });
        categories.push({ id: doc.id, name: doc.data().name });
      });
      success(categories);
    }, (error) => {
      unsuccess(error);
    });

    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  // Add item to a category
  addItemToCategory = async (categoryId, item, success, unsuccess) => {
    try {
      const docRef = await addDoc(collection(this.db, "categories", categoryId, "items"), { name: item });
      success(docRef.id);
    } catch (e) {
      unsuccess(e);
    }
  };

  // Get items of a category
  getItemsOfCategory = (categoryId, success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "categories", categoryId, "items"), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      success(items);
      console.log(items)
    }, (error) => {
      unsuccess(error);
    });

    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  // Delete item from category
  deleteItemFromCategory = async (categoryId, itemId) => {
    await deleteDoc(doc(this.db, "categories", categoryId, "items", itemId));
  };

  // Update item in category
  updateItemInCategory = async (categoryId, itemId, newData, success, unsuccess) => {
    try {
      const docRef = doc(this.db, "categories", categoryId, "items", itemId);
      await updateDoc(docRef, newData);
      success();
    } catch (e) {
      unsuccess(e);
    }
  };

  // Delete category
  deleteCategory = async (categoryId) => {
    await deleteDoc(doc(this.db, "categories", categoryId));
  };

  getDropdownOptions = async (category) => {
    const items = [];
    const q = query(collection(this.db, "categories", category, "items"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    // console.log(items)
    return items;
  };

}

const firestore = new FireStore();
export default firestore;