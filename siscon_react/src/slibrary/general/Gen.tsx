import Log from "./Log";
import { STNull } from "./STypes"

export default class Gen {
    //*****************************************************
    static DEVELOPMENT(): boolean {
        return (process.env.NODE_ENV === "development")
    }
    //*****************************************************
    /*
    static check(object: any): any {
        if (object) return object
        else {
            Log.alert("Error making reference to an object")
            return null
        }
    }
    */
    //*****************************************************
}