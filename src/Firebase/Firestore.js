//Firestore.js
//import { image } from "html2canvas/dist/types/css/types/image";
import app from "./Config";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, onSnapshot, 
        deleteDoc, updateDoc, orderBy, query, where, getDocs,writeBatch, limit  } from "firebase/firestore";

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

  updateAccount = async (companyId, id, data, success, unsuccess) => {
    try {
      const docRef = doc(this.db, "companies", companyId, "account_cms", id);
      await updateDoc(docRef, data);
      success();
    } catch (e) {
      unsuccess(e);
    }
  };

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
            level:doc.data().level,
            department:doc.data().department,
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

  getTopProfiles = (companyId, success, unsuccess) => {
    const networkRef = collection(this.db, "companies", companyId, "network");
    
    // Create query for the top profiles ordered by 'count' and 'timestamp'
    const topProfilesQuery = query(
      networkRef, 
      orderBy("count", "desc"), 
      orderBy("timestamp", "asc"), 
      limit(4) // Limit to top 3 profiles
    );
  
    // Fetch data using onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(
      topProfilesQuery,
      async (querySnapshot) => {
        const topProfiles = [];
  
        for (const docSnapshot of querySnapshot.docs) {
          const netUserId = docSnapshot.id; // User ID from network
          const likeData = docSnapshot.data(); // Like data for the user
  
          try {
            // Fetch user data from the 'users' collection
            const userRef = doc(collection(this.db, "companies", companyId, "users"), netUserId);
            const userSnapshot = await getDoc(userRef);
  
            if (userSnapshot.exists()) {
              // Combine user data with like data
              topProfiles.push({
                id: netUserId, // User ID
                ...userSnapshot.data(), // User details from the 'users' collection
                count: likeData.count, // Likes count from 'network'
                timestamp: likeData.timestamp, // Last activity timestamp
              });
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
            unsuccess(error); // Handle individual errors
          }
        }
        success(topProfiles); // Call success callback with top profiles data
      },
      (error) => {
        unsuccess(error); // Handle overall query errors
      }
    );
  
    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  getAllCheckin = (companyId,success, unsuccess) => {
    const unsubscribe = onSnapshot(query(collection(this.db, "companies", companyId, "checkin"),orderBy('date','desc'),orderBy('time','desc')), (querySnapshot) => {
      const allcheckin = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allcheckin.push({id:doc.id,isCheckIn:true, ...doc.data()});
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
        allcheckout.push({id:doc.id,isCheckIn:false, ...doc.data()});
      });
      success(allcheckout);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  addCheckInOut = async (companyId, isCheckIn, data, success, unsuccess) => {
    try {
      const collectionName = isCheckIn ? "checkin" : "checkout";
      const collectionRef = collection(this.db, "companies", companyId, collectionName);
  
      // Adding the document with auto-generated ID
      await addDoc(collectionRef, data);
      success();
    } catch (error) {
      unsuccess(error);
    }
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

  deleteCheckin = async (companyId, uid, success, unsuccess) => {
    try {
      const checkinRef = doc(this.db, "companies", companyId, "checkin", uid);
      await deleteDoc(checkinRef);
      success();
    } catch (e) {
      unsuccess(e);
    }
  };
  
  deleteCheckout = async (companyId, uid, success, unsuccess) => {
    try {
      const checkoutRef = doc(this.db, "companies", companyId, "checkout", uid);
      await deleteDoc(checkoutRef);
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
            const currentWorkplaceId = actionDoc.data().wpID;
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
        if(data.state){
          allLeave.push({
            id:doc.id,
            date: data.dateStart,
            name: data.name,
            requestTime: data.requestTime,
            state: data.state,
            state1:data.state1,
          });
        }
      });
      success(allLeave);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  deleteLeave = async (companyId, leaveId, success, unsuccess) => {
    try {
      const docRef = doc(this.db, "companies", companyId, "leaveRequest", leaveId);
      await deleteDoc(docRef); // Firestore function to delete a document
      success();
    } catch (error) {
      unsuccess(error);
    }
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
        if(data.status){
          allOT.push({
            id:doc.id,
            date: data.date,
            name: data.name,
            requestTime:data.requestTime ,
            state: data.status,
            state1:data.status1
          });
        }
      });
      
      success(allOT);
    }, (error) => {
      console.error("Error getting documents: ", error);
      unsuccess(error);
    });
    
    // Return unsubscribe function to stop listening for updates
    return unsubscribe;
  };

  deleteOT = async (companyId, otId, success, unsuccess) => {
    try {
      const docRef = doc(this.db, "companies", companyId, "otRequest", otId);
      await deleteDoc(docRef); // Firestore function to delete a document
      success();
    } catch (error) {
      unsuccess(error);
    }
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

  updateWelth = async (companyId, userId, updatedData,unsuccess) => {
    try {
      const welthRef = doc(this.db, "companies", companyId, "wealthfare", userId);
      console.log(updatedData)
      await updateDoc(welthRef, updatedData);
      //success();
    } catch (error) {
      unsuccess(error);
    }
  };

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
      if(categoryId=="workplace"){
        const wpRef = doc(this.db, "companies", companyId, "workplaces", itemId);
        await updateDoc(wpRef, {wp:newData.name});
      }
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

  async loadNotes(companyId, date) { // This function is added to load notes for a specific date
    try {
      const noteRef = doc(this.db, 'companies', companyId, 'calendar_notes', date);
      const docSnap = await getDoc(noteRef);
      
      if (docSnap.exists()) {
        return docSnap.data().notes || [];
      } else {
        return []; // Return an empty array if no notes are found for the date
      }
    } catch (error) {
      console.error('Error loading notes:', error);
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
        if(type == 3){
          await setDoc(annouceRef, { annouceState: false, [type]: false,acknow:false }, { merge: true });
        }else{
          // Use computed property name to dynamically create the field name
          await setDoc(annouceRef, { annouceState: false, [type]: false }, { merge: true });
        }
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
          const workplaceId = doc.data().wp;
          

          // For each workplace, fetch the user count
          const usersRef = collection(this.db, "companies", companyId, "workplaces", doc.id, "users");
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

  getAllLeaders = (companyId, success, unsuccess) => {
    const usersCollection = collection(this.db, "companies", companyId, "users");
    const leadersQuery = query(usersCollection, where("level", "==", "leader"), orderBy("name", "asc")); // Filter for leaders
  
    const unsubscribe = onSnapshot(
      leadersQuery,
      (querySnapshot) => {
        const leaders = [];
        querySnapshot.forEach((doc) => {
          leaders.push({
            id: doc.id,
            name: doc.data().name + " " + doc.data().lastname, // Combine first name and last name
          });
        });
        success(leaders);
      },
      (error) => {
        unsuccess(error);
      }
    );
  
    return unsubscribe;
  };

  addLeader=(companyId,userId,item)=>{
    try{
      const docRef = setDoc(doc(this.db, "companies", companyId, "users", userId,"extend","leader"), item);
      //success();
    }catch(e){
      //unsuccess(e);
    }
  }

  getLeader = async (companyId, userId, leadData) => {
    const userRef = doc(this.db, "companies", companyId, "users",userId,'extend','leader');
    const WPRef = doc(this.db, "companies", companyId, "users",userId,'extend','workplace');
  
    try{
      const docSnap = await getDoc(userRef);
      const WPSnap = await getDoc(WPRef)

      if (docSnap.exists() || WPSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        leadData(docSnap.data(),WPSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        leadData(null)
      }
    }catch(e){
      //unsuccess(e)
    }
  };

  getWorkAndLeaveDataForCurrentDate = (companyId, success, unsuccess) => {
    // Format the current date as dd/mm/yyyy
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');  // Ensure day is 2 digits
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Ensure month is 2 digits
    const year = currentDate.getFullYear();
    const currentDateStr = `${day}/${month}/${year}`;  // Format: dd/mm/yyyy

    const checkinRef = collection(this.db, "companies", companyId, "checkin");
    const leaveRequestRef = collection(this.db, "companies", companyId, "leaveRequest");

    const workingEmployees = new Set();
    const leaveCounts = {
      'ลากิจ': new Set(),
      'ลาป่วย': new Set(),
      'ลาพักร้อน': new Set(),
    };

    // Get checkin data for the current date
    const checkinQuery = query(checkinRef, where('date', '==', currentDateStr));
    const checkinPromise = getDocs(checkinQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { user } = doc.data();
            workingEmployees.add(user);  // Add employee UID to the working set
        });
    });

    // Get leave requests that overlap the current date
    const leaveQuery = query(leaveRequestRef, where('state', '==', true), where('state1', '==', true));
    const leavePromise = getDocs(leaveQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const uid = data.user.slice(3);  // Extract user's uid
            const { dateStart, dateEnd, types } = data;

            // Convert date strings from dd/mm/yyyy to Date objects
            const [startDay, startMonth, startYear] = dateStart.split('/');
            const startDate = new Date(startYear, startMonth - 1, startDay);
            let endDate = startDate;  // Default to one day if no dateEnd

            if (dateEnd) {
                const [endDay, endMonth, endYear] = dateEnd.split('/');
                endDate = new Date(endYear, endMonth - 1, endDay);  // Month is 0-based
            }

            const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

            //console.log("Checking Leave Request:", { uid, types, startDate, endDate, currentDateObj });
            if (currentDateObj >= startDate && currentDateObj <= endDate) {
              //console.log('Leave Data:', data);

              // Check if the leave type exists in leaveCounts
              if (leaveCounts[types]) {
                  leaveCounts[types].add(uid);  // Add the user to the respective leave type
              } else {
                  console.warn(`Unknown leave type encountered: ${types}`);
              }
            }
        });
    });

    Promise.all([checkinPromise, leavePromise])
        .then(() => {
            // Remove users from working set if they are on leave
            Object.values(leaveCounts).forEach((leaveSet) => {
                leaveSet.forEach(uid => workingEmployees.delete(uid));
            });

            // console.log("Working employees count: ", workingEmployees);
            // console.log("Leave counts: ", leaveCounts);

            success({
                working: workingEmployees.size,
                leave: {
                  'ลากิจ': leaveCounts['ลากิจ']?.size || 0,
                  'ลาป่วย': leaveCounts['ลาป่วย']?.size || 0,
                  'ลาพักร้อน': leaveCounts['ลาพักร้อน']?.size || 0
                }
            });
        })
        .catch((error) => unsuccess(error));
  };

  getAllLeaveDataMtoL = (companyId, userId, success, unsuccess) => {
    // Reference the wealthfare document using the userId as the document ID
    const docRef = doc(this.db, "companies", companyId, "wealthfare", userId);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Extract the values for absence, sick, and holiday along with their remaining days
          const absence = parseInt(data.absence || 0, 10);
          const absenceR = parseInt(data.absenceR || 0, 10);

          const sick = parseInt(data.sick || 0, 10);
          const sickR = parseInt(data.sickR || 0, 10);

          const holiday = parseInt(data.holiday || 0, 10);
          const holidayR = parseInt(data.holidayR || 0, 10);

          // Success callback with the calculated values
          success({
            absence,
            absenceR,
            sick,
            sickR,
            holiday,
            holidayR,
          });
        } else {
          unsuccess(`No wealthfare document found for this user ${userId}`);
        }
      })
      .catch((error) => unsuccess(error));
  };

  onDefaultCheckInOutTimesChange(companyId, callback) {
    const docRef = doc(this.db, 'companies', companyId, 'settings', 'defaultTimes');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback({ checkInTime: '08:00', checkOutTime: '17:00' }); // Default values if not set
      }
    });
    return unsubscribe; // Return the unsubscribe function
  }

  getDefaultCheckInOutTimes(companyId, successCallback, errorCallback) {
    const docRef = doc(this.db, 'companies', companyId, 'settings', 'defaultTimes');
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          successCallback(doc.data());
        } else {
          successCallback({ checkInTime: '08:00', checkOutTime: '17:00' }); // Default values if not set
        }
      })
      .catch(errorCallback);
  }

  async setDefaultCheckInOutTimes(companyId, data, successCallback, errorCallback) {
    console.log(data)
    const docRef = doc(this.db, 'companies', companyId, 'settings', 'defaultTimes');
    try {
      await setDoc(docRef, data, { merge: true });
      successCallback();
    } catch (error) {
      console.error("Direct setDoc Error:", error);
      errorCallback(error);
    }
  }


}

const firestore = new FireStore();
export default firestore;