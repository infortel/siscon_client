import { STAjaxPacket, STCallBack_Basic, STElement, STNull, STObjectAny } from "../../../slibrary/general/STypes";
import * as React from "react";
import Ajax from "../../common/system/ajax/Ajax";
import Gadget from "../../../slibrary/framework/gadget/Gadget";
import Server_Command, { O_database_get_company_list, O_database_get_company_list__company } from "../../common/generals/Server_Command";
import TSystem from "../../common/types/TSystem";
import Param from "../../common/Param";
import Metrics from "../../common/metrics/Metrics";
import Gen from "../../../slibrary/general/Gen";
import GDefinitions from "../../../slibrary/framework/gadget/GDefinitions";
import GPopup_Windows from "../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Attach from "../../../slibrary/framework/components/attach/logic/Attach";
import GString from "../../../slibrary/general/GString";
import { $database$select_company } from "../../common/system/ajax/$definitions/database/$database$select_company";
import { $database$get_company_list } from "../../common/system/ajax/$definitions/database/$database$get_company_list";
import CComponent from "../../../slibrary/framework/components_base/CComponent";

export class Select_Company_Attach extends Attach {
  //*************************************************************************
    //static _instance: Select_Company
    _companies: O_database_get_company_list|STNull=null
    _selecting_transition: string | STNull = null
    //_execute_on_companies_read: STCallBack_Basic|STNull=null
    //*************************************************************************
    //static inst(): Select_Company {
    //    if (!Select_Company._instance) Select_Company._instance = new Select_Company()
    //    return Select_Company._instance
    //}
    //*************************************************************************
    constructor(gadget: Gadget) {
        super(gadget)

    }
    //*************************************************************************
    //reset(execute_on_companies_read: STCallBack_Basic) {
    reset_and_render() {
        //this._execute_on_companies_read=execute_on_companies_read
        this._companies = null
        this._gadget.render()
    }
    //*************************************************************************
    get_companies_from_server(callback: STCallBack_Basic): void {
        const $=$database$get_company_list
        const request: STAjaxPacket = {}
        request[$.I_LOGO_WIDTH] = "0"
        request[$.I_LOGO_HEIGHT] = "0"
        new Ajax().call("Get company list", $.COMMAND, request, (ajax:Ajax) => {
            if (ajax.ok()) {
                this._companies = ajax.getResponse() as O_database_get_company_list
                if (callback) callback()
            }
        })
    }
    //*************************************************************************
    _companySelection(company_code: string): void {
        if (this._gadget.gadgets().is_designing()) return 
        this._gadget!.render()
        this._selecting_transition = company_code

        const $=$database$select_company
        const request:STAjaxPacket= {}
        request[$.I_COMPANY] = company_code
        new Ajax().call("Select company", $.COMMAND, request, (ajax: Ajax) => {
            this._selecting_transition = null
            if (ajax.ok()) {
                //Close if popup.
                const popup = GPopup_Windows.get_from_gadgets(this._gadget!.gadgets())
                if (popup != null) popup.close()

                Param.p.refresh_all_reading_system_data(null)
            }
        })
    }
    //*************************************************************************
    //Override
    _get_render_element_with_companies(): STElement {
        const elements: STElement[] = []
        const key = "select_company"
        let size = 40

        const w: any = this._gadget!.def.def().width
        const h: any = this._gadget!.def.def().height
        if ((GString.hasOnlyNumericDigits(w)) && (GString.hasOnlyNumericDigits(h))) {
            const area = w * h
            size = 0.30* Math.sqrt(w * h / this._companies!.companies.length)
        }
        if (size<20) size=30
        let font_size = size / 3

        for (let i = 0; i < this._companies!.companies.length; i++) {
            const comp: O_database_get_company_list__company = this._companies!.companies[i]

            const image_url = Metrics.inst().get_server_url() + comp.logo_url
            let className = "Select_Company-box-normal"
            if (this._selecting_transition ===comp.code) {
                className = "Select_Company-box-selecting"
            } else if (comp.code === Param.p.system.data()!.company_code) {
                className = "Select_Company-box-selected"
            }
            const width=""+(size*2.5)
            elements.push(
                <div key={key + "-comp-" + i} 
                        style={CComponent.add_style_flex({},"column")}
                        className={className}
                        onClick={(event: STObjectAny) => { this._companySelection(comp.code) }}
                    >
                    <img src={image_url}  width={size}></img>
                    <label style={{ fontSize: font_size }}>{comp.code.toUpperCase()}</label>
                </div>
            )
        }

        let outStyle = {}
        if (this._gadget!.def.width()) outStyle = { width: this._gadget!.def.width() }
        if (this._gadget!.def.width()) outStyle = { width: this._gadget!.def.width() }
        if (this._gadget!.def.height()) outStyle = { ...outStyle, height: this._gadget!.def.height(), display:"flex"}

        return <div key={key}
            className="Select_Company"
            style={outStyle}
             >
            {elements}
        </div>

    }
    //*************************************************************************
    read_get_render_element(): STElement {
        let done=false
        if (this._companies) {
            done=true
            return this._get_render_element_with_companies()
        }

        if (!done) {
            this.get_companies_from_server(() => {this._gadget!.render()})
            return <label key="select_company-reading">...reading from server...</label>
        }
        return <></> //This is never executed.
    }
    //*************************************************************************
    get_render_element(): STElement {
        return this.read_get_render_element()
    }
    //*************************************************************************

}