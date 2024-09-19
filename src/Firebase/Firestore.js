//Firestore.js
//import { image } from "html2canvas/dist/types/css/types/image";
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, onSnapshot, 
        deleteDoc, updateDoc, orderBy, query, where, getDocs,writeBatch  } from "firebase/firestore";

class FireStore{
  constructor(){
    this.db = getFirestore(app);
  }

  checkCompany=async(companyId,success,unsuccess)=>{
    try {
      const subCollectionRef = collection(this.db, `companies/${companyId}/account_cms`);
      const subCollectionSnapshot = await getDocs(subCollectionRef);
  
      if (!subCollectionSnapshot.empty) {
        success(true);
      } else {
        unsuccess(false);
      }
    } catch (error) {
      unsuccess(false);
    }
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

  addNetwork= async (companyId,id,item,success,unsuccess)=>{
    try{
        const docRef =  await setDoc(doc(this.db, "companies", companyId, "network", id), item);
        success();
    }catch(e){
      unsuccess(e);
    }
  }

  addAction= async (companyId,id,item,success,unsuccess)=>{
    try{
        const docRef =  await setDoc(doc(this.db, "companies", companyId, "users", id,"network_action",id), item);
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
    const unsubscribe = onSnapshot(query(collection(this.db, "companies", companyId, "checkin"),orderBy('date','desc'),orderBy('time','desc')), (querySnapshot) => {
      const allcheckin = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allcheckin.push({id:doc.id, ...doc.data()});
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
    const unsubscribe = onSnapshot(query(collection(this.db, "companies", companyId, "checkout"),orderBy('date','desc'),orderBy('time','desc')), (querySnapshot) => {
      const allcheckout = [];
      querySnapshot.forEach((doc) => {
        allcheckout.push({id:doc.id, ...doc.data()});
      });
      success(allcheckout);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  updateCheckin = async (companyId, uid, updatedData, success, unsuccess) => {
    try {
      const checkinRef = doc(this.db, "companies", companyId, "checkin", uid);
      // Use setDoc with merge: true to update only the provided fields
      await setDoc(checkinRef, updatedData, { merge: true });
      success();
    } catch (e) {
      unsuccess(e);
    }
  };
  
  updateCheckout = async (companyId, uid, updatedData, success, unsuccess) => {
    try {
      const checkoutRef = doc(this.db, "companies", companyId, "checkout", uid);
      // Use setDoc with merge: true to update only the provided fields
      await setDoc(checkoutRef, updatedData, { merge: true });
      success();
    } catch (e) {
      unsuccess(e);
    }
  };

  removeUserFromAllWorkplaces = async (companyId, userId) => {
    try {
        // Fetch the current workplace of the user from the 'extend' sub-collection
        const actionRef = doc(this.db, "companies", companyId, "users", userId, "extend", "workplace");
        const actionDoc = await getDoc(actionRef);

        if (actionDoc.exists()) {
            const currentWorkplaceId = actionDoc.data().workplace;
            console.log(currentWorkplaceId)

            // If the user has a current workplace, delete them from that workplace
            const userRef = doc(this.db, "companies", companyId, "workplaces", currentWorkplaceId, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await deleteDoc(userRef);
                console.log(`Deleted user ${userId} from workplace ${currentWorkplaceId}`);
            } else {
                console.log(`User ${userId} not found in workplace ${currentWorkplaceId}`);
            }
        } else {
            console.log(`User ${userId} does not have an assigned workplace.`);
        }
    } catch (e) {
        console.error("Error removing user from previous workplaces: ", e);
    }
  };

  assignWork = async (companyId, workPlaceId, userId, item,actItem, success, unsuccess) => {
    try {
        // First, remove the user from any existing workplaces
        await this.removeUserFromAllWorkplaces(companyId, userId);

        // Then, assign the user to the new workplace
        const userRef = doc(this.db, "companies", companyId, "workplaces", workPlaceId, "users", userId);
        const actionRef = doc(this.db, "companies", companyId, "users", userId,"extend","workplace");
        await setDoc(userRef, item);
        await setDoc(actionRef, actItem);
        success();
    } catch (e) {
        unsuccess(e);
    }
  };

  getUsersByWorkplace = (companyId, workPlaceId, success, unsuccess) => {
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

  ManageWP = async (companyId, workPlaceId,item,success, unsuccess) => {
    try {
        const userRef = doc(this.db, "companies", companyId, "workplaces", workPlaceId);
        await setDoc(userRef, item);
        success();
    } catch (e) {
        unsuccess(e);
    }
  };

  getWorkplaceDoc=async(companyId, workplaceId)=> {
    try {
      const docRef = doc(this.db, "companies", companyId, "workplaces", workplaceId);
      const docSnap = await getDoc(docRef);
      return docSnap;
    } catch (error) {
      console.error("Error fetching workplace doc:", error);
      throw error;
    }
  }

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
    const unsubscribe = onSnapshot(query(collection(this.db, "companies", companyId, "leaveRequest"),orderBy("dateStart", "desc")
      ), (querySnapshot) => {
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
      
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }



  getAllOT = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(query(collection(this.db, "companies", companyId, "otRequest"),orderBy('date','desc')), (querySnapshot) => {
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

  updateBill=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "Salary", id);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getBill=async(companyId,id,date,success,unsuccess)=>{
    
    try{
      const docRef = doc(this.db, "companies", companyId, "Salary", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        success({uid:docSnap.id,...docSnap.data()})
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }catch(e){
      unsuccess(e)
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
        confirm: data.confirm,
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
    //console.log("deleteAnnouce",companyId,id)
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

  getUserRole=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","role");
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

  addUserRole= async (companyId,id,item,success,unsuccess)=>{
    try{
      const docRef = await setDoc(doc(this.db, "companies", companyId, "users", id,"extend","role"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  updateUserRole=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","role");
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getUpSkill=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","upSkill");
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

  addUpSkill= async (companyId,id,item,success,unsuccess)=>{
    try{
      const docRef = await setDoc(doc(this.db, "companies", companyId, "users", id,"extend","upSkill"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  updateUpskill=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","upSkill");
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  getNotice=async(companyId,id,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","notice");
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

  addNotice= async (companyId,id,item,success,unsuccess)=>{
    try{
      const docRef = await setDoc(doc(this.db, "companies", companyId, "users", id,"extend","notice"), item);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

  updateNotice=async(companyId,id,data,success,unsuccess)=>{
    try{
      const docRef = doc(this.db, "companies", companyId, "users", id,"extend","notice");
      await updateDoc(docRef,data);
      success();
    }catch(e){
      unsuccess(e);
    }
  }

   // Function to save notes for a specific day
   async saveNotes(companyId, date, notes) {
    try {
      const noteRef = doc(this.db, 'companies', companyId, 'calendar_notes', date);
      await setDoc(noteRef, { notes }, { merge: true });
      console.log('Notes successfully saved for', date);
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  }

  // Function to load notes for a specific day
  async loadAllNotes(companyId) {
    try {
      const notesCollectionRef = collection(this.db, 'companies', companyId, 'calendar_notes');
      const querySnapshot = await getDocs(notesCollectionRef);
      
      const allNotes = {};
      querySnapshot.forEach((doc) => {
        const date = doc.id;  // The document ID is the date
        allNotes[date] = doc.data().notes || [];
      });
  
      return allNotes;
    } catch (error) {
      console.error('Error loading all notes:', error);
      throw error;
    }
  }

  addAnnouceState = async (companyId, type) => {
    try {
      const usersCollectionRef = collection(this.db, 'companies', companyId, 'users');
  
      const querySnapshot = await getDocs(usersCollectionRef);
      querySnapshot.forEach(async (userDoc) => {
        //console.log(userDoc.id);
  
        // Reference to the specific document in 'extend/annouceAct'
        const annouceRef = doc(this.db, 'companies', companyId, 'users', userDoc.id, 'extend', 'annouceAct');
  
        // Use computed property name to dynamically create the field name
        await setDoc(annouceRef, { annouceState: false, [type]: false }, { merge: true });
      });
    } catch (error) {
      console.error('Error addAnnouceState:', error);
    }
  };

  resetLikeStatus = async (companyId, currentId) => {
    try {
      const batch = writeBatch(this.db); // Use writeBatch() to initialize a batch
  
      // Reference to all users in the company
      const usersCollectionRef = collection(this.db, "companies", companyId, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
  
      querySnapshot.forEach((docSnapshot) => {
        const userId = docSnapshot.id;
  
        // Reference to the user's networkAct document
        const netActRef = doc(this.db, 'companies', companyId, 'users', userId, 'networkAct', currentId);
  
        // Add operation to batch: Reset like status
        batch.set(netActRef, { act: false, likeBG: '#BEBEBE' }, { merge: true });
      });
  
      // Reset the like count in the global network collection
      const netRef = doc(this.db, 'companies', companyId, 'network', currentId);
      batch.set(netRef, { count: 0, timestamp: new Date() }, { merge: true });
  
      // Commit the batch operation
      await batch.commit();
      console.log("Like status reset for all users.");
  
    } catch (error) {
      console.error("Error resetting like status:", error);
    }
  };

  // Get all workplaces and their user count
  getWorkplaceUserCounts = (companyId, success, unsuccess) => {
    const workplacesRef = collection(this.db, "companies", companyId, "workplaces");

    // Fetch all workplaces
    getDocs(workplacesRef)
      .then(async (snapshot) => {
        const workplaceData = [];

        for (const doc of snapshot.docs) {
          const workplaceId = doc.id;
          

          // For each workplace, fetch the user count
          const usersRef = collection(this.db, "companies", companyId, "workplaces", workplaceId, "users");
          const userSnapshot = await getDocs(usersRef);

          // Push workplace data with user count
          workplaceData.push({
            name: workplaceId,
            count: userSnapshot.size,  // Number of users
          });
        }

        success(workplaceData);
      })
      .catch((error) => unsuccess(error));
  };

}

const firestore = new FireStore();
export default firestore;