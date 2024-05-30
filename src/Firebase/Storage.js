import app from "./Config";
import { getStorage } from "firebase/storage";

class Storage{
    constructor(){
        this.storage = getStorage(app);
    }


}

const storage = new Storage();
export default storage;