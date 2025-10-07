import { STElement } from "../../../../general/STypes"
import CComponent from "../../../components_base/CComponent"
import { CEdit_CTextarea } from "../../edit/comp/CEdit_CTextarea"

export class CTextarea extends CComponent {
    _common:CEdit_CTextarea
    constructor(props:any) {
        super(props)
        this._common=new CEdit_CTextarea(this,false)
        this.gadget.set_com(this)
    }
    //*****************************************************
    render():any {
        return this._common.render()
    }
   //*****************************************************
}