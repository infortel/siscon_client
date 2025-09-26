import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets"
import Log from "../../../../slibrary/general/Log"
import SMetrics from "../../../../slibrary/general/SMetrics"
import { STAjaxPacket, STNull } from "../../../../slibrary/general/STypes"
import Commands_General from "../../../common/commands/Commands_General"
import { $general$files$read_relative_file } from "../../../common/system/ajax/$definitions/general/files/$general$files$read_relative_file"
import Ajax from "../../../common/system/ajax/Ajax"
import Designer_Constants from "../core/Designer_Constants"
import File_Explorer from "../file_explorer/File_Explorer"
import { File_Editor } from "./File_Editor"

export default class File_Editor_Commands extends Commands_General {
    //***************************************************************************
    private _master:File_Editor
     //***************************************************************************
    constructor(master:File_Editor) {
        super()
        this._master=master
    }
    //***************************************************************************
    public c_read():void {
        //Read file
        let file_path=Gadgets.inst().get_value(Designer_Constants.GADGET_PATH)

        File_Explorer.inst().open(file_path,(ok,file_path)=>{
            if (ok) this._read__contactServerAndRead(file_path)
        })
    }
    //--------------------------------------
    private _read__contactServerAndRead(file_path:string | STNull):void {
            let omit_include=false
            const path = SMetrics.inst().adjust_pagename(file_path!)

            const $=$general$files$read_relative_file
            const request:STAjaxPacket={}
            request[$.I_OMIT_INCLUDE]=omit_include
            request[$.I_PATH]=path
    
            new Ajax().to_omit_error().to_omit_login().call("Read file from Server: " + file_path, $.COMMAND, request, (ajax: Ajax) => {
                try {
                    if (ajax.ok()) {
                        this._read__contentReady(ajax.getResponse().context)
                    } else {
                        if (!(this.options.omit_open_error)) {
                            Log.alert("Page could not be loaded\n\nName: " + this.page_or_definition + "\n\n" + ajax.getError())
                        }
                    }
                } catch (e) {
                    Log.logExc("call_server. " + this.page_or_definition, e)
                }
            })
        }
    
    //--------------------------------------
    private _read__contentReady(content:string):void {
        this._master.da.content.set_value(content)
    }
    //***************************************************************************
    c_save(): void {
        //Save file
        this.a_under_development("")
    }
    //***************************************************************************
    c_save_as(): void {
        //Save file indicating a new name.
        this.a_under_development("")
    }
    //***************************************************************************
}
