import GPopup_Window from "./GPopup_Window";
import Gadgets from "../../../gadgets/Gadgets";
import Log from "../../../../general/Log";
import { STCallBack_Success, STClass, STNull, STypes } from "../../../../general/STypes";
import Commands from "../../../general/Commands";

export type Popup_Windows_Open_Callback=(popup_window:GPopup_Window|STNull)=>void

export default class GPopup_Windows {
    //*****************************************************
    private static map: Map<string, GPopup_Window> = new Map()
    public static active_windows:GPopup_Window[] = []
    //*****************************************************
    public static open(title: string, page_name: string, command_instance: Commands|STNull, is_modal:boolean, callback_success: Popup_Windows_Open_Callback) {
        try {
            let window = GPopup_Windows.map.get(page_name)
            if (window) {
                window?.increment_opened_count()
                this._open(window,callback_success)
            } else {
                window=new GPopup_Window(title, page_name, command_instance,is_modal,(success:boolean) => {
                    if (success) {
                        this.map.set(page_name, window!)
                        this._open(window!,callback_success)
                    } else {
                        if (callback_success) callback_success(null)
                    }
                })
            }
        } catch (e) {
            Log.logExc("GPopup_Wiondows.open",e)
        }
    }
    //*****************************************************
    private static _open(window: GPopup_Window, callback_success: Popup_Windows_Open_Callback) {

        //Activate open window order.
        let index: number = GPopup_Windows.active_windows.indexOf(window)
        if (index >= 0) {
            GPopup_Windows.active_windows.splice(index, 1)
            window.forceUpdate()
        } else if (index < 0) {
            GPopup_Windows.active_windows.push(window)
            Gadgets.inst().root_gadget.forceUpdate()
        } //else do nothing, it is already the first in the list.

        if (callback_success) {
            window.gadgets.root_gadget.execute_on_mounted(() => {
                    callback_success(window)
            })
        }
        
    }
    //*****************************************************
    public static remove_active_window_from_array(window: GPopup_Window): void {
        let index: number = GPopup_Windows.active_windows.indexOf(window)
        if (index >= 0) {
            GPopup_Windows.active_windows.splice(index, 1)
        }
    }
    //*****************************************************
    public static get(page_name: string): GPopup_Window | STNull {
        return this.map.get(page_name)
    }
    //*****************************************************
    public static get_from_gadgets(gadgets: Gadgets): GPopup_Window | STNull {
        let res: GPopup_Window | STNull=null
        GPopup_Windows.map.forEach((window: GPopup_Window) => {
            if (gadgets === window.gadgets) res=window
        })
        return res
    }
    //*****************************************************
    public static get_active_count(): number {
        return GPopup_Windows.active_windows.length
    }
    //*****************************************************
    public static close(page_name:string):void {
        let window=this.map.get(page_name)
        if (window) window.close()
    }
    //*****************************************************
    public static closeAll() {
        GPopup_Windows.active_windows=[]
        Gadgets.inst().root_gadget.forceUpdate()
    }
    //*****************************************************
    public static get_open_window(page_name:string):GPopup_Window|STNull {
        return GPopup_Windows.active_windows.find(window => window.page_name === page_name) || null
    }
    //*****************************************************
}