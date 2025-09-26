import GPopup_Windows from "../../../../slibrary/framework/popup_windows/GPopup_Windows";
import File_Explorer_Commands from "./File_Explorer_Commands";
import GPopup_Window from "../../../../slibrary/framework/popup_windows/GPopup_Window";
import GString from "../../../../slibrary/general/GString";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import { STObjectAny, STNull, STAjaxPacket } from "../../../../slibrary/general/STypes";
import Log from "../../../../slibrary/general/Log";
import T from "../../../../slibrary/translate/T";
import Ajax from "../../../common/system/ajax/Ajax";
import GObject from "../../../../slibrary/general/GObject";
import { $general$files$file_list } from "../../../common/system/ajax/$definitions/general/files/$general$files$file_list";
import Page_Name from "../../../common/generals/Page_Name";

//*******************************************************************************
export type TFile_Explorer_onResult=((success:boolean, path:string|STNull)=>void)
//*******************************************************************************
export type Tda = {
    directory_path: Gadget,
    filename: Gadget
    files: Gadget
}

export default class File_Explorer {
    //***************************************************************************
    static _instance:File_Explorer
    static FILE_UPPER=".."
    static FILE_PREFIX_DIR = ">"
    static FILE_PREFIX_FILE = " "
    static INDICATES_PRIMARY_DIR="{"
    _popup_window!: GPopup_Window|STNull
    _on_result!: TFile_Explorer_onResult
    _default_path!:string
    public da!: Tda
    private _commands!:File_Explorer_Commands
    //***************************************************************************
    static inst():File_Explorer {
        if (!File_Explorer._instance) new File_Explorer()
        return File_Explorer._instance
    }
    //***************************************************************************
    constructor() {
        File_Explorer._instance=this
    }
    //***************************************************************************
    get_on_result(): TFile_Explorer_onResult {
        return this._on_result
    }
    //***************************************************************************
    open(default_path: string, on_result: TFile_Explorer_onResult) {
        this._on_result=on_result
        this._default_path=default_path
        this._commands=new File_Explorer_Commands(this)
        GPopup_Windows.open("Document Properties", Page_Name.DESIGNER_FILE_EXPLORERE, this._commands , true, (popup_window)=>{
                this._popup_window = popup_window
                this.da = popup_window!.gadgets.da as Tda
                this.assign_initial_values()
        })
    }
    //***************************************************************************
    assign_initial_values():void {

        let st=this._default_path
        if (GObject.isInvalid(st)) st=""
        let filename=""
        let directory = ""
        if (st.endsWith("/")) {
            directory=st
        } else {
            let i=st.lastIndexOf("/")
            if (i>=0) {
                directory=st.substring(0,i)
                filename=st.substring(i+1,st.length)
            } else {
                directory=""
                filename=st
            }
        }
        this.da.directory_path.set_value(directory)
        this.da.filename.set_value(filename)

        this.populate_files()


        this.da.files.event.set_onclick((event: STObjectAny|STNull, gadget:Gadget)=>{
                let directory_path=this.da.directory_path.get_value()
                let filename=this.da.filename.get_value()
                let value: string = this.da.files.get_value()
                if (value === File_Explorer.FILE_UPPER) {
                    let i = directory_path.lastIndexOf("/")
                    if (i >= 0) {
                        directory_path = directory_path.substring(0, i)
                    } else {
                        directory_path = ""
                    }
                    filename = ""
                } else {
                    let prefix = value.substring(0, File_Explorer.FILE_PREFIX_DIR.length)
                    value = value.substring(File_Explorer.FILE_PREFIX_DIR.length, value.length)

                    if (prefix == File_Explorer.FILE_PREFIX_DIR) {
                        //This is a directory
                        if (value.startsWith(File_Explorer.INDICATES_PRIMARY_DIR)) {
                            directory_path = value
                        } else {
                            directory_path = directory_path + "/" + value
                        }
                        filename = ""
                    } else {
                        //This is a file.
                        filename = value
                    }
                }

                this.da.directory_path.set_value(directory_path)
                this.da.filename.set_value(filename)

            if (this.da.files.event.get_last_click_count() == 1) { 
                this.populate_files()
            } else if (this.da.files.event.get_last_click_count() == 2) if (GString.isStringWithText(filename)) {
                this.da.filename.set_value(filename)
                this._commands.c_ok()
            }     
            
        })

    }
    //***************************************************************************
    populate_files():void {
        let directory_path=this.da.directory_path.get_value()
        let filename=this.da.filename.get_value()
        let previousValue = this.da.files.get_value()

        const $=$general$files$file_list
        const request: STAjaxPacket = {}
        request[$.I_DIRECTORY]=directory_path
        new Ajax().call("Get file list", $.COMMAND, request, (ajax:Ajax) => {
            if (ajax.ok()) {
                try {
                    let fileList: string[] = [];
                    let valuefound: boolean = false
                    if (ajax.getResponse().files) for (let i: number = 0; i < ajax.getResponse().files.length; i++) {
                        const file: STObjectAny = ajax.getResponse().files[i]
                        let value = ""
                        if (file.type === "1") value = File_Explorer.FILE_PREFIX_DIR + file.name;
                        else value = File_Explorer.FILE_PREFIX_FILE + file.name
                        fileList.push(value);
                        if (value === previousValue) valuefound = true;
                    }


                    if (directory_path.length > 0) {
                        fileList.unshift(File_Explorer.FILE_UPPER)
                    }


                    this.da.files.set_options_from_string_array(fileList)
                    if (!valuefound) {
                        if (fileList.length > 0) this.da.files.set_value(fileList[0])
                    } else {
                        this.da.files.set_value(previousValue)
                    }
                } catch (e) {
                    Log.logExc(T.t("Error reading files"), e)
                }
                this._pupulate_files_error_reported = false
            } else {
                if (!this._pupulate_files_error_reported) {
                    this.da.directory_path.set_value("")
                    this.da.filename.set_value("")
                    this._pupulate_files_error_reported = true
                    this.populate_files()
                }
            }
        })
    }
    _pupulate_files_error_reported: boolean = false
    //***************************************************************************
}
