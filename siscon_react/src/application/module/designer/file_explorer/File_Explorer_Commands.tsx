import Commands_General from "../../../common/commands/Commands_General";
import Log from "../../../../slibrary/general/Log";
import File_Explorer from "./File_Explorer";
import GObject from "../../../../slibrary/general/GObject";
import Param from "../../../common/Param";
import TFile_Explorer_onResult from "../file_explorer/File_Explorer";
import { STAjaxPacket, STObjectAny } from "../../../../slibrary/general/STypes";
import Ajax from "../../../common/system/ajax/Ajax";
import Server_Command from "../../../common/generals/Server_Command";
import { $general$files$create_directory } from "../../../common/system/ajax/$definitions/general/files/$general$files$create_directory";
import { $general$files$delete_file } from "../../../common/system/ajax/$definitions/general/files/$general$files$delete_file";

export default class File_Explorer_Commands extends Commands_General {
    private _master:File_Explorer
    //***************************************************************************
    constructor(master:File_Explorer) {
        super()
        this._master=master
    }
    //***************************************************************************
    _get_path() {
        const directory=File_Explorer.inst().da.directory_path!.get_value()
        const filename=File_Explorer.inst().da.filename.get_value()
        return directory + "/" + filename
    }
    //***************************************************************************
    c_ok(): void {
        //Accept the selection
        if (File_Explorer.inst().da.directory_path) {
            if (File_Explorer.inst()._popup_window) File_Explorer.inst()._popup_window!.close()
            if (File_Explorer.inst()._on_result) File_Explorer.inst()._on_result(true, this._get_path())
        }
    }
    //***************************************************************************
    c_cancel(): void {
        //Cancel and close the window
        if (File_Explorer.inst()._popup_window) {
            File_Explorer.inst()._popup_window!.close()
            let onResult = File_Explorer.inst().get_on_result()
            if (onResult) onResult(false, null)
        }
    }
    //***************************************************************************
    c_change_root(): void {
        //Pending development
        /*
        if (File_Explorer.get_instance()._gadget_directory_path) {
            let path = File_Explorer.get_instance()._gadget_directory_path!.get_value()
            if (path.startsWith(File_Explorer.FILE_PREFIX_ORIGINAL)) {
                path = File_Explorer.FILE_PREFIX_PERSONAL + path.substring(File_Explorer.FILE_PREFIX_ORIGINAL.length, path.length)
            } else if (path.startsWith(File_Explorer.FILE_PREFIX_PERSONAL)) {
                path = File_Explorer.FILE_PREFIX_ORIGINAL + path.substring(File_Explorer.FILE_PREFIX_PERSONAL.length, path.length)
            }
            File_Explorer.get_instance()._gadget_directory_path!.set_value(path)
            File_Explorer.get_instance().populate_files()
        }
        */
    }
    //***************************************************************************
    c_create_directory(): void {
        //Create directory
        if (File_Explorer.inst().da.directory_path) {
            Log.prompt("Enter directory to create:", "", (ok, directory_name) => {
                if (GObject.isValid(directory_name)) {
                    let path = File_Explorer.inst().da.directory_path!.get_value() + "/" + directory_name

                    const $=$general$files$create_directory
                    const request: STObjectAny = {}
                    request[$.I_PATH] = path
                    new Ajax().call("Create Directory", $.COMMAND, request, (ajax: Ajax) => {
                        if (ajax.ok()) {
                            ajax.instant_message()
                            File_Explorer.inst().populate_files()
                        }
                    })
                }
            })
        }
    }
    //***************************************************************************
    c_delete_file(): void {
        //Delete file
        if (File_Explorer.inst().da.directory_path) {
            const path = this._get_path()
            if (GObject.isValid(path)) {

                const $=$general$files$delete_file
                const request: STAjaxPacket = {}
                request[$.I_PATH]=path
                new Ajax().call("Create Directory", $.COMMAND, request, (ajax: Ajax) => {
                    if (ajax.ok()) {
                        ajax.instant_message()
                        File_Explorer.inst().populate_files()
                    }
                })
            }

        }
    }
    //***************************************************************************
}