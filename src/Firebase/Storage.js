import app from "./Config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class Storage{
    constructor(){
        this.storage = getStorage(app);
    }
    uploadFile(file, onProgress, onComplete, onError) {
        const storageRef = ref(this.storage, `uploads/${file.name}`);
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

}

const storage = new Storage();
export default storage;