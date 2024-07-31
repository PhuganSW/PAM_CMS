import app from "./Config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

class Storage{
    constructor(){
        this.storage = getStorage(app);
    }
    uploadFile(file, onProgress, onComplete, onError) {
        const storageRef = ref(this.storage, `miscible/annouces/${file.name}`);
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              if (onComplete) onComplete(downloadURL);
            }).catch(onError);
          }
        );
      }

      async uploadImage(file) {
        const storageRef = ref(this.storage, `miscible/image/${file.name}`);
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