import GPopup_Window from "../../../slibrary/framework/popup_windows/GPopup_Window"
import GPopup_Windows from "../../../slibrary/framework/popup_windows/GPopup_Windows"
import Log from "../../../slibrary/general/Log"
import { STNull } from "../../../slibrary/general/STypes"
import Page_Name from "../../common/generals/Page_Name"
import General_Dialog_Commands from "./General_Dialog_Commands"

export default class General_Dialog {
    popup_window: GPopup_Window | STNull
    private _title:string
    private _pagename:string
    //***************************************************************************
    constructor(title:string, pagename:string) {
        this._title=title
        this._pagename=pagename
        this._open()
    }
    //*****************************************************
    private _open(): void {
        GPopup_Windows.open(this._title, this._pagename, null, true, (popup_window) => {
            this.popup_window = popup_window
            if (this.popup_window) {
                //Populate.
            }
        })
    }
    //*****************************************************
}