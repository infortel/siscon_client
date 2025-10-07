import Gen from "../../../slibrary/general/Gen"
import SMetrics from "../../../slibrary/general/SMetrics"
import { STAjaxPacket, STCallBack_Basic, STCallBack_Error_Object, STCallBack_String, STElement, STNull, STObjectAny, STypes } from "../../../slibrary/general/STypes"
import Server_Command from "../generals/Server_Command"
import Ajax from "../system/ajax/Ajax"
import Widgetpanel_oper from "../../../slibrary/framework/components/widgetpanel/comp/CWidgetpanel_Definitions"
import Select_Widget from "../../dialogs/select_widget/Select_Widget"
import { Select_Company_Attach } from "../../attach/select_company/Select_Company_Attach"
import Gadget from "../../../slibrary/framework/gadget/Gadget"
import * as React from "react"
import Page_Name from "../generals/Page_Name"
import Attach from "../../../slibrary/framework/components/attach/logic/Attach"
import { $general$profile$get_profile } from "../system/ajax/$definitions/general/profile/$general$profile$get_profile"
import { $general$profile$save_profile } from "../system/ajax/$definitions/general/profile/$general$profile$save_profile"

export default class Metrics extends SMetrics {
    //*****************************************************
    static DEBUG_LOGIN_COMPANY = "infortel"
    static DEBUG_LOGIN_USERNAME = "leon"
    static DEBUG_LOGIN_PASSWORD = "catatumba"
    //*****************************************************
    static DEVELOPMENT_DEFAULT_INDEX_HTML = ""   //you can indicate nothing to take the default: index.html
    static PRODUCTION_DEFAULT_INDEX_HTML ="new.html"     
    //*****************************************************
    //DEVELOPMENT_URL_HOST = "http://98.249.227.90:8080/siscon/" //Application host server url.
    //DEVELOPMENT_URL_HOST = "https://siscon1.com/" //Application host server url.
    DEVELOPMENT_URL_HOST = "http://localhost:8080/"
    static PRODUCTION_STARTING_PAGE="desk/module/main/main" 
    
    //static DEVELOPMENT_STARTING_PAGE= "desk/module/main/main"
    static DEVELOPMENT_STARTING_PAGE= "desk/module/designer/main"

    SERVICE_URL_SUFFIX = "service"
    
    //*****************************************************
    static WIDGETS_DIRECTORY = "desk/widgets/"
    //*****************************************************
  
    static inst():Metrics {
        return (SMetrics._instance as Metrics)
    }
    //*****************************************************
    constructor() {
        super()
        SMetrics._instance = this
        this.initialize()
    }
    //*****************************************************
    public get_starting_default_page():string {
        if (Gen.DEVELOPMENT()) {
            return Metrics.DEVELOPMENT_STARTING_PAGE
        } else {            
            return Metrics.PRODUCTION_STARTING_PAGE
        }
    }
    //*****************************************************
    get_default_index_html() :string {
        if (Gen.DEVELOPMENT()) return Metrics.DEVELOPMENT_DEFAULT_INDEX_HTML
        else return Metrics.PRODUCTION_DEFAULT_INDEX_HTML
    }
    //*****************************************************
    profile_read(name: string, callback: STCallBack_Error_Object) {
        const $=$general$profile$get_profile
        const request:STAjaxPacket={}
        request[$.I_BRANCH]="widgets." + name
        new Ajax().call("Get profile widgetpanel", $.COMMAND,request, (ajax: Ajax) => {
            if (ajax.ok()) {
                const result = JSON.parse(ajax.getResponse().result)
                callback(null, result)
            } else {
                callback(ajax.getError(), {})
            }
        })
    }
    //*****************************************************
    profile_save(name: string, defs:any, callback: STCallBack_Error_Object) {
        const $=$general$profile$save_profile
        const request:STAjaxPacket={}
        request[$.I_BRANCH]="widgets." + name
        request[$.I_PROFILE]=defs
        new Ajax().call("Save profile widgetpanel", $.COMMAND, request, (ajax: Ajax) => {
            if (callback != null) callback(ajax.getError(), {})
        })
    }
    //*****************************************************
    profile_add(callback: STCallBack_String) {
        //callback('desk/widgets/inspect/inventory')
        new Select_Widget(callback)
    }
    //*****************************************************
    _attach_instance: any
    get_attach_instance() {
        return this._attach_instance
    }
    //*****************************************************
    adjust_pagename(page_name: string): string {
        if (page_name.startsWith(Page_Name.INDICATE_ABSOLUTE_PATH_CHAR)) return page_name
        return "pages/" + page_name + ".json"

    }
    //*****************************************************
 }