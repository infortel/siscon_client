import CComponent from "../../../components_base/CComponent"
import { CEdit_CTextarea } from "./CEdit_CTextarea"


export default class CEdit extends CComponent {
    _common:CEdit_CTextarea
    constructor(props:any) {
        super(props)
        this._common=new CEdit_CTextarea(this,true)
        this.gadget.set_com(this)
    }
    //*****************************************************
    render():any {
        return this._common.render()
    }
   //*****************************************************
}