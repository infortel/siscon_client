import Gadget from "../../../gadget/Gadget"
import Attach from "./Attach"

export class GAttachGeneral {
//*****************************************************
    public static create_attach_object(gadget: Gadget): Attach {
        const id = gadget.def.id()
        //if (id === "select_company") return new Select_Company_Attach(gadget) as Attach
        return new Attach(gadget)
    }
//*****************************************************
   
}