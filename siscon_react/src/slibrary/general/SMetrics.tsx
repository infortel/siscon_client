import * as React from "react"
import Gadget from "../framework/gadget/Gadget"
import Mouse_Handle from "../framework/processes/Mouse_Handle"
import Gen from "./Gen"
import { STCallBack_Error_Object, STElement, STNull } from "./STypes"

export default class SMetrics {
    //*****************************************************
    static _instance: SMetrics
    //*****************************************************
    DEVELOPMENT_URL_HOST = "http://xxx/" //Application host server url.
    SERVICE_URL_SUFFIX = "service"
    PORTAL_URL_SUFFIX = "portal"                     //Server directory name for portal files.
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    constructor() {
        Mouse_Handle.initialize()
    }
    //*****************************************************
    static inst(): SMetrics {
        return SMetrics._instance
    }
    //*****************************************************
    initialize() {
        if (Gen.DEVELOPMENT()) {
            this._get_server_url= this.DEVELOPMENT_URL_HOST 
        } else {
            this._get_server_url= process.env.PUBLIC_URL as string //+ "/" 
        }

    }
    //*****************************************************
    get_server_url_service():string {
        return this._get_server_url+ this.SERVICE_URL_SUFFIX
    }
    //*****************************************************
    _get_server_url!: string
    get_server_url(): string {
        return this._get_server_url
    }
    //*****************************************************
    //This function adjust url for server located html fiels and images.
    adjust_url(url: string): string {
        if (Gen.DEVELOPMENT()) {
            if (url.startsWith(this.PORTAL_URL_SUFFIX + "/")) {
                url = this.DEVELOPMENT_URL_HOST + url
            }
        }
        return url
    }
    
    //*****************************************************
    profile_read(name: string, callback: STCallBack_Error_Object) {
        if (callback) callback("Not implemented", {})
    }
    //*****************************************************
    profile_save(name: string, defs: any, callback: STCallBack_Error_Object) {
        if (callback) callback("Not implemented", {})
    }
    //*****************************************************
    profile_add(callback: (page: string|STNull) => void) {
        //Not implemented.
        if (callback) callback(null)
    }
    //*****************************************************
    adjust_pagename(page_name:string): string {
        return page_name + ".json"

    }
    //*****************************************************
    get_global_width():number {
        return document.body.clientWidth
    }
    //*****************************************************
    get_global_height():number {
        return document.body.clientHeight
    }
    //*****************************************************
}