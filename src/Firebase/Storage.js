import app from "./Config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject,uploadBytes } from "firebase/storage";

class Storage{
    constructor(){
        this.storage = getStorage(app);
    }
    uploadFile(companyId, file, onProgress, onComplete, onError) {
      // Extract the file extension
      const fileExtension = file.name.split('.').pop();
      const filename = `${file.name.split('.')[0]}_${Date.now()}.${fileExtension}`;
    
      // Set the file path in storage with the correct extension
      const storageRef = ref(this.storage, `${companyId}/annouces/${filename}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
    
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          if (onError) onError(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              if (onComplete) onComplete(downloadURL);
            })
            .catch(onError);
        }
      );
    }
    

      async uploadImage(companyId,file) {
        const storageRef = ref(this.storage, `${companyId}/image/${file.name}`);
        console.log(file.name)
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    }).catch(reject);
                }
            );
        });
    }

    uploadBill = (companyId, fileName, file) => {
      return new Promise((resolve, reject) => {
          const storageRef = ref(this.storage, `${companyId}/salarySlips/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
              "state_changed",
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                  reject(error);
              },
              async () => {
                  try {
                      // Get the download URL after upload is complete
                      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                      resolve(downloadURL);
                  } catch (error) {
                      reject(error);
                  }
              }
          );
      });
    };

    uploadWorkplaceImg = async (file, path) => {
      try {
        const fileExtension = file.name.split('.').pop(); // Extract the file extension
        const storageRef = ref(this.storage, `${path}.${fileExtension}`); // Append the extension to the path
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
      }
    }

    deleteFile = async (url) => {
      if (url) {
        const storageRef = ref(this.storage, url);
        try {
          await deleteObject(storageRef);
          console.log('File deleted successfully');
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    };


}

const storage = new Storage();
export default storage;