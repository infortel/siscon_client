import Gen from "../../general/Gen";
import GString from "../../general/GString";
import { STNull } from "../../general/STypes";

export default class Access {
    static check(access_required:string|STNull ,access_given:string|STNull):string|null {
        //Response is null if access is authorized. Otherwise, a string is returned with the denied details.
        let result=null
        if (GString.isStringWithText(access_required)) {
            if (GString.isStringWithText(access_given)) {
                let acc_req:string[]=access_required!.split(";")
                let acc_giv: string[]=access_given!.split(";")
                let matches=0;
                acc_req.forEach((acc_r) => {
                    acc_giv.forEach((acc_g) => {
                        if (acc_r.startsWith(acc_g)) matches++
                    })
                })
                if (matches==0) result="The user has no access for this task. Access required: "+access_required
            } else {
                result="The user has no access for "+access_required
            }
        } else {
            result=null
        }
        return result
    }

}