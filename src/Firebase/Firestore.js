//Firestore.js
//import { image } from "html2canvas/dist/types/css/types/image";
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, onSnapshot, 
        deleteDoc, updateDoc, orderBy, query, where, getDocs  } from "firebase/firestore";

class FireStore{
  constructor(){
    this.db = getFirestore(app);
  }

  addAccount= async (companyId,id,item)=>{
    try {
      const docRef = await setDoc(doc(this.db, "companies", companyId, "account_cms", id), item);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  getAccount=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "account_cms", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        //console.log("No such document!");
        unsuccess()
      }
    }catch(e){
      unsuccess(e)
    }
  }

  deleteAccount= async (companyId,id)=>{
    await deleteDoc(doc(this.db, "companies", companyId, "account_cms", id));
  }

  getAllAccount = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "account_cms"), (querySnapshot) => {
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

  // addUser= async (item,success,unsuccess)=>{
  //   try{
  //     const docRef = await addDoc(collection(this.db, "users"), item);
  //     success(docRef.id);
  //   }catch(e){
  //     unsuccess(e);
  //   }
  // }

  verifyUsername = async (companyId, username)=>{
    try {
      const q = query(
        collection(this.db, "companies", companyId, "username"),
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Returns true if username is available
    } catch (e) {
      console.error("Error verifying username:", e);
      return false; // Return false on error, assuming username might be taken or some error occurred
    }
  }

  addUser = async (companyId, item, success, unsuccess) => {
    try {
      const docRef = await addDoc(collection(this.db, "companies", companyId, "users"), item);
      success(docRef.id);
    } catch (e) {
      unsuccess(e);
    }
  };

  addUsername= async (companyId,id,item,success,unsuccess)=>{
    
    try{
      
      
        const docRef =  await setDoc(doc(this.db, "companies", companyId, "username", id), item);
        success();
      
      
    }catch(e){
      unsuccess(e);
    }
  }

  // getUser=async(id,success,unsuccess)=>{
  //   try{
  //     const docRef = doc(this.db, "users", id);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       //console.log("Document data:", docSnap.data());
  //       success(docSnap.data())
  //     } else {
  //       // docSnap.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   }catch(e){
  //     unsuccess(e)
  //   }
  // }

  getUser = (companyId, userId, success, unsuccess) => {
    getDoc(doc(this.db, "companies", companyId, "users", userId))
      .then((docSnap) => {
        if (docSnap.exists()) {
          success({ id: docSnap.id, ...docSnap.data() });
        } else {
          unsuccess("No such document!");
        }
      })
      .catch((error) => {
        unsuccess(error);
      });
  };

  getUsername=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "username", id);
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

  // updateUser=async(id,data,success,unsuccess)=>{
  //   try{
  //     const docRef = doc(this.db, "users", id);

      
  //     await updateDoc(docRef,data);
  //     success();
  //   }catch(e){
  //     unsuccess(e);
  //   }
  // }

  updateUser = async (companyId, userId, newData, success, unsuccess) => {
    try {
      const userRef = doc(this.db, "companies", companyId, "users", userId);
      await updateDoc(userRef, newData);
      success();
    } catch (e) {
      unsuccess(e);
    }
  };

  updateUsername=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "username", id);

      
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  deleteUser=async(companyId,id)=>{
    await deleteDoc(doc(this.db, "companies", companyId, "users", id));
  }

  deleteUsername=async(companyId,id)=>{
    await deleteDoc(doc(this.db, "companies", companyId, "username", id));
  }

  // getAllUser = (success, unsuccess) => {
  //   //const unsubscribe = onSnapshot(collection(this.db, "users"),orderBy("name","desc"), (querySnapshot) => {
  //     const q = query(collection(this.db, "users"), orderBy('name',"asc"));
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const allaccount = [];
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       allaccount.push({
  //         id: doc.id,
  //         name: data.name+" "+data.lastname,
  //         position: data.position,
  //         image_off:data.image_off,
  //       });
  //     });
  //     success(allaccount);
  //   }, (error) => {
  //     console.error("Error getting documents: ", error);
  //     unsuccess(error);
  //   });
    
  //   // Return unsubscribe function to stop listening for updates
  //   return unsubscribe;
  // };

  getAllUser = (companyId, success, unsuccess) => {
    const usersCollection = collection(this.db, "companies", companyId, "users");
    const usersQuery = query(usersCollection, orderBy("name", "asc"));
  
    const unsubscribe = onSnapshot(
      usersQuery,
      (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({
            id: doc.id,
            name: doc.data().name + " " + doc.data().lastname,
            position: doc.data().position,
            image_off: doc.data().image_off,
          });
        });
        success(users);
      },
      (error) => {
        unsuccess(error);
      }
    );
  
    return unsubscribe;
  };

  getAllCheckin = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "checkin"), (querySnapshot) => {
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

  getAllCheckout = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "checkout"), (querySnapshot) => {
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

  assignWork=async(companyId,workPlaceId,userId,item,success,unsuccess)=>{
    console.log(workPlaceId)
    try {
      const userRef = doc(this.db, "companies", companyId, "workplaces", workPlaceId, "users", userId);
      await setDoc(userRef, item);
      success();
    } catch (e) {
      unsuccess(e);
    }
  }

  getUsersByWorkplace = async (companyId, workPlaceId, success, unsuccess) => {
    try {
      const workplaceRef = collection(this.db, "companies", companyId, "workplaces", workPlaceId, "users");
      const unsubscribe = onSnapshot(workplaceRef, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        success(users);
      }, unsuccess);
      return unsubscribe;
    } catch (e) {
      unsuccess(e);
    }
  };

  getLeave=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "leaveRequest", id);
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

  updateLeave=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "leaveRequest", id);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getAllLeave = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "leaveRequest"), (querySnapshot) => {
      const allLeave = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allLeave.push({
          id:doc.id,
          date: data.dateStart,
          name: data.name,
          state: data.state,
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

  getOT=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "otRequest", id);
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

  updateOT=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "otRequest", id);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }



  getAllOT = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "otRequest"), (querySnapshot) => {
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

  addWelth=async(companyId,id,item,success,unsuccess)=>{
    try{
      const docRef = await setDoc(doc(this.db, "companies", companyId, "wealthfare",id), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getWelth=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "wealthfare", id);
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


  addBill=async(companyId,item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "companies", companyId, "Salary"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getBill=async(companyId,id,date,success,unsuccess)=>{
    try {
      const q = query(
        collection(this.db, "companies", companyId, "Salary"),
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

  getAllBill=(companyId,id,success,unsuccess)=>{
    const q = query(collection(this.db, "companies", companyId, "Salary"), where("id", "==", id));
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

  addAnnouce= async (companyId,item,success,unsuccess)=>{
    try{
      const docRef = await addDoc(collection(this.db, "companies", companyId, "annouce"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  updateAnnouce=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "annouce", id);
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getAnnouce=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "annouce", id);
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


  getAllAnnouce = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "annouce"), (querySnapshot) => {
      const allAnnouce = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allAnnouce.push({
          id:doc.id,
          title:data.title,
          date: data.date,
          type:data.type
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

  deleteAnnouce=async(companyId,id)=>{
    await deleteDoc(doc(this.db, "companies", companyId, "annouce", id));
  }

  addCategory = async (companyId,category, success, unsuccess) => {
    try {
      const docRef = await addDoc(collection(this.db, "companies", companyId, "categories"), { name: category });
      success(docRef.id);
    } catch (e) {
      unsuccess(e);
    }
  };

  // Get all categories
  getAllCategories = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "categories"), (querySnapshot) => {
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
  addItemToCategory = async (companyId,categoryId, item, success, unsuccess) => {
    try {
      const docRef = await addDoc(collection(this.db, "companies", companyId, "categories", categoryId, "items"), { name: item });
      success(docRef.id);
    } catch (e) {
      unsuccess(e);
    }
  };

  // Get items of a category
  getItemsOfCategory = (companyId,categoryId, success, unsuccess) => {
    const unsubscribe = onSnapshot(collection(this.db, "companies", companyId, "categories", categoryId, "items"), (querySnapshot) => {
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
  deleteItemFromCategory = async (companyId,categoryId, itemId) => {
    await deleteDoc(doc(this.db, "companies", companyId, "categories", categoryId, "items", itemId));
  };

  // Update item in category
  updateItemInCategory = async (companyId,categoryId, itemId, newData, success, unsuccess) => {
    try {
      const docRef = doc(this.db, "companies", companyId, "categories", categoryId, "items", itemId);
      await updateDoc(docRef, newData);
      success();
    } catch (e) {
      unsuccess(e);
    }
  };

  // Delete category
  deleteCategory = async (companyId,categoryId) => {
    await deleteDoc(doc(this.db, "companies", companyId, "categories", categoryId));
  };

  getDropdownOptions = async (companyId,category) => {
    const items = [];
    const q = query(collection(this.db, "companies", companyId, "categories", category, "items"));
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