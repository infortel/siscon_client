import { STObjectAny } from "../../../slibrary/general/STypes";
import SVariable from "../../../slibrary/sevaluations/SVariable";
import Param from "../Param";

export default class Variable extends SVariable {
    //***************************************************************************
    static evaluate(complete_name:string):any {
        let names = complete_name.split(".")
        if (names.length === 0) return null
        const name=names[0]
        if ((name === "1") && (names.length >= 3)) {
            //Do the translation here.
            return SVariable.combine(names, 2)
            /*
        } else if (name === "user") {
            try {
                let varia = names[1]
                return (Param.p.get_user() as STObjectAny)[varia]
            } catch (e) {
                return "[#" + name + "]"
            }
            */
        } else if (name === "system") {
            if (names.length == 2) {
                const data = Param.p.system.data() as any
                const na=names[1]
                if (data) return (data[na]) ?? "";  else return null
            } else return null
        } else return "[#" + complete_name + "]"
    }
    //***************************************************************************
}