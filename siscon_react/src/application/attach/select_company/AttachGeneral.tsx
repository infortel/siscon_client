import Gadget from "../../../slibrary/framework/gadget/Gadget"
import Attach from "../../../slibrary/framework/gadget/gadget_data/dattach/Attach"
import { GAttachGeneral } from "../../../slibrary/framework/gadget/gadget_data/dattach/GAttachGeneral"
import { Select_Company_Attach } from "./Select_Company_Attach"

export class AttachGeneral extends GAttachGeneral {
//*****************************************************
public create_attach_object(gadget: Gadget): Attach {
    const id = gadget.def.id()
    if (id === "select_company") return new Select_Company_Attach(gadget) as Attach
    else return new Attach(gadget)
}
//*****************************************************
private static _instance:AttachGeneral;
public static inst():AttachGeneral {
    if (!this._instance) this._instance=new AttachGeneral()
    return this._instance
}
//*****************************************************
}
