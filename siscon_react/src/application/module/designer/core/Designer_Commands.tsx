import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets"
import Gadget from "../../../../slibrary/framework/gadget/Gadget"
import Log from "../../../../slibrary/general/Log"
import GPopup_Windows from "../../../../slibrary/framework/popup_windows/GPopup_Windows";
import Designer from "./Designer";
import Document_Properties_Commands from "../properties/Document_Properties_Commands";
import Element_Properties_Commands from "../properties/Element_Properties_Commands";
import SCookie from "../../../../slibrary/general/SCookie";
import Properties_Library from "../properties/Properties_Library";
import Designer_Constants from "./Designer_Constants";
import SClipboard from "../../../../slibrary/general/SClipboard";
import Commands_General from "../../../common/commands/Commands_General";
import File_Explorer from "../file_explorer/File_Explorer";
import { STAjaxPacket, STNull, STObjectAny } from "../../../../slibrary/general/STypes";
import Ajax from "../../../common/system/ajax/Ajax";
import CComponent from "../../../../slibrary/framework/components_base/CComponent";
import T from "../../../../slibrary/translate/T";
import GObject from "../../../../slibrary/general/GObject";
import File_Editor_Commands from "../file_editor/File_Editor_Commands";
import { $general$files$save_file } from "../../../common/system/ajax/$definitions/general/files/$general$files$save_file";
import { File_Editor } from "../file_editor/File_Editor";
import Page_Name from "../../../common/generals/Page_Name";

export default class Designer_Commands extends Commands_General {
    //***************************************************************************
    static _clipboard: string
    page_path:string|STNull=null
    private _master:Designer
    //***************************************************************************
    //***************************************************************************
    constructor(master:Designer) {
        super()
        this._master=master
    }
    //***************************************************************************
    public c_read():void {
        //Read file
        let file_path=Gadgets.inst().get_value(Designer_Constants.GADGET_PATH)

        File_Explorer.inst().open(file_path,(ok,file_path)=>{
            if (ok) this.c_read_path(file_path)
        })
    }
    //*****************************************************
    private _save_cookie(file_path:string) {
        SCookie.setCookie365(Designer_Constants.COOKIE_DESIGNER_FILENAME, file_path)
    }
    //*****************************************************
    public c_read_path(file_path:string|STNull):void {
        //Read file indicating location path
        if (GObject.isInvalid(file_path)) {
            file_path = Gadgets.inst().get_value(Designer_Constants.GADGET_PATH)
        }
        let designing_mode=null
        if (Designer.da!.designer_mode) {
            designing_mode=Designer.da?.designer_mode.get_value()
        }
        if (!designing_mode) designing_mode=Gadgets.DESIGNING_COMMAND_NORMAL

        let design_gadgets=new Gadgets(false,file_path!, {designing:Gadgets.DESIGNING_COMMAND_NORMAL},Gadgets.DESIGNING_KEY_PREFIX, (success) => {
            if (success) {
                design_gadgets.set_command_instance(new Commands_General()) //This is placed here to test some commands.
                //if (Designer.designing_gadgets) if (Designer.designing_gadgets.root_gadget) Designer.designing_gadgets.root_gadget.destroy()
                this._save_cookie(file_path!)
                //let panel_container = Gadgets.get_instance().get("body")
                Designer.designing_gadgets = design_gadgets
                Gadgets.inst().set_value(Designer_Constants.GADGET_PATH, file_path)
                design_gadgets.set_gadgets_area_onclick(this._master._design_gadgets_area_onclick as any)
                this.c_refresh(100) //20 worked ok. (10 failed)
            }
        })
    }
    //*****************************************************
    public c_refresh(time: number):void {
        //Refresh screen
        //Commented statements can be deleted in the future (2025-08-23)
        //if (time===0) time = 10

        //Clear elements
        let panel_container:Gadget|STNull = Gadgets.inst().get("body")
        if (panel_container) {
            //panel_container.set_nested_gadgets(null)

            //setTimeout(() => {
                //Render new elements. This delay is needed.
                panel_container!.set_nested_gadgets(Designer.designing_gadgets)
                panel_container!.forceUpdate()
            //}, time)

        }
    }
    //***************************************************************************
    public c_save():void {
        //Save file
        let file_path=Gadgets.inst().get_value(Designer_Constants.GADGET_PATH)
        this.c_save_to(file_path)
    }
    //***************************************************************************
    public c_save_as():void {
        //Save file with different name
        let file_path=Gadgets.inst().get_value(Designer_Constants.GADGET_PATH)
        if (file_path) {
            File_Explorer.inst().open(file_path, (ok, file_path) => {
                if (ok) this.c_save_to(file_path!)
            })
        }
    }
    //***************************************************************************
    public c_save_to(file_path: string): void {
        //Save file indicating file path
        try {
            this._master._clean_items()
            let gadgets=Designer.designing_gadgets
            let context = {}
            if (gadgets!=null) context=JSON.stringify(gadgets._definition,null,2)

            const $=$general$files$save_file
            const request: STAjaxPacket = {}
            request[$.I_PATH] = file_path
            request[$.I_CONTEXT] = context
            new Ajax().call("Saving page context into server: " + this.page_path, $.COMMAND,request, (ajax:Ajax)=>{
                if (ajax.ok()) {
                    this._save_cookie(file_path)
                    ajax.instant_text(T.t("Data saved into file:")+" " + file_path)
                    Gadgets.inst().set_value(Designer_Constants.GADGET_PATH,file_path)
                }
            })
        } catch (e) {
            Log.logExc("Error Designer_Commands.save_to",e)
        }
    }
    //***************************************************************************
    public c_file_editor():void {
        //Open file editor
        new File_Editor()
    }
    //***************************************************************************
    public c_document_properties():void {
        //Change document properties
        if (Designer_Commands._check_document_exist()) {
            GPopup_Windows.open("Document Properties", Page_Name.DESIGNER_DOCUMENT_PROPERTIES, new Document_Properties_Commands(this._master), true, (popup_window) => {
                Properties_Library.gadgets_to_editing(popup_window!,
                        Designer.designing_gadgets!._definition.head)
            })
        }
    }
    //***************************************************************************
    public c_element_properties(): void {
        //Change element properties
        if (Designer_Commands._check_document_exist()) {
            let property_gadget = Designer.designing_gadgets!.selected_get_first()
            if (property_gadget) {
                GPopup_Windows.open("Element Properties", Page_Name.DESIGNER_ELEMENT_PROPERTIES, new Element_Properties_Commands(this._master), true,(popup_window) => {
                    const gadgetType = popup_window!.gadgets.get_gadget_tab(Properties_Library._TABLE_EDIT, "type")
                    if (gadgetType) {
                        gadgetType.event.set_onchange((event:any, gadget) => {
                            Properties_Library.show_hide_gadgets(popup_window!)
                        }) 
                    }
                    Properties_Library.gadgets_to_editing(popup_window!, property_gadget!.def.def())
                })
            } else {
                Log.alert("You need to select at least one element.")
            }
        }
    }
    
    //***************************************************************************
    public c_select_parent(): void {
        //Select parent
        if (Designer_Commands._check_document_exist()) {

            let selected_gadget = Designer.designing_gadgets!.selected_get_first()
            if (!selected_gadget) {
                Log.alert("You need to select an object first")
            } if (!selected_gadget!.get_parent()) {
                Log.alert("The selected item has no parent")
            } else {
                //Unselect all elements.
                Designer.designing_gadgets!.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                    gadget.set_selected(false)
                })

                //Now select parent.
                if (selected_gadget) if (selected_gadget.get_parent()) selected_gadget.get_parent()!.set_selected(true)
            }
        }
    }
    //***************************************************************************
    public c_add_border_width(value: number) {
        //Increase or decrease border width (indicate +1 or -1)
        CComponent.add_designer_border_width(value)
        Designer.designing_gadgets!.root_gadget.forceUpdate()
    }
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    public c_cut(): void {
        //Clipboard cut
        if (Designer_Commands._check_document_exist()) {
            let selected_gadget = Designer.designing_gadgets!.selected_get_first()
            if (!selected_gadget) {
                Log.alert("You need to select an object first")
            } else {
                this.c_copy()
                this.c_delete()
            }
        }
    }
    //***************************************************************************
    public c_show_source():void {
        //Show source for an element
        let selected_gadget = Designer.designing_gadgets!.selected_get_first()
        if (selected_gadget != null) {
            Log.alert(JSON.stringify(selected_gadget.def.def(), null, 2))
        }
    }
    //***************************************************************************
    public c_copy(): void {
        //Copy to clipboard
        if (Designer_Commands._check_document_exist()) {
            let selected_gadget = Designer.designing_gadgets!.selected_get_first()
            if (!selected_gadget) {
                Log.alert("You need to select an object first")
            } else {
                let count = Designer.designing_gadgets!.selected_get_count()
                if (count === 1) {
                    SClipboard.set(JSON.stringify(selected_gadget.def.def()))
                } else {
                    let defs = ""
                    Designer.designing_gadgets!.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                        if (gadget.is_selected()) {
                            if (!(defs === "")) defs += ",\n"
                            defs += (JSON.stringify(gadget.def.def()))
                        }
                    })
                    SClipboard.set("[" + defs + "]")
                }
            }
        }
    }
    //***************************************************************************
    private _process_action_from_clipboard(action_command: (definition: STObjectAny)=>void):void {
        if (!SClipboard.get()) {
            Log.alert("You need to select an object first")
        } else {
            let text = SClipboard.get()
            let defs=JSON.parse(text!)
            if (Array.isArray(defs)) {
                let selected_gadget = Designer.designing_gadgets!.selected_get_first()
                Designer.designing_gadgets!.clear_all_selections(Gadgets.LEVEL_BASIC)
                defs.forEach((def) => {
                    selected_gadget?.set_selected(true)
                    action_command(def)
                })
            } else {
                action_command(defs)
            }
        }
    }
    //***************************************************************************
    public c_insert_clipboard():void {
        //Insert element from the clipboard
        this._process_action_from_clipboard(this.c_insert)
    }
    //***************************************************************************
    public c_add_clipboard():void {
        //Add an elemento from the clipboard
        this._process_action_from_clipboard(this.c_add)
    }
    //***************************************************************************
    public c_add(definition: STObjectAny): void {
        //Add new element
        if (Designer_Commands._check_document_exist()) {
            let selected_gadget = Designer.designing_gadgets!.selected_get_first()
            if (!selected_gadget) {
                Log.alert("You need to select an object first")
            } else {
                let new_gadget = Designer.designing_gadgets!.create_gadget_tree_from_definition(selected_gadget, definition, true, null)
                if (new_gadget) new_gadget.set_selected(true)
                selected_gadget.forceUpdate()
            }
        }   
    }
    //***************************************************************************
    public c_insert(definition: STObjectAny):void {
        //Insert new element
        if (Designer_Commands._check_document_exist()) {
            let selected_gadget = Designer.designing_gadgets!.selected_get_first()
            if (!selected_gadget) {
                Log.alert("You need to select an object first")
            } else {
                let new_gadget = Designer.designing_gadgets!.create_gadget_tree_from_definition(selected_gadget.get_parent(), definition, true, selected_gadget)
                //let new_gadget = new Gadget(Designer.designing_gadgets, selected_gadget.get_parent(), definition, true, selected_gadget)
                if (selected_gadget.get_parent()) selected_gadget.get_parent()!.forceUpdate()
                Designer.designing_gadgets!.clear_all_selections(Gadgets.LEVEL_BASIC)
                if (new_gadget) new_gadget.set_selected(true)
                if (selected_gadget.get_parent()) selected_gadget.get_parent()!.forceUpdate()
            }
        } 

    }
    //***************************************************************************
    public c_delete(): void {
        //Delete element
        if (Designer_Commands._check_document_exist()) {
            let count = 0
            Designer.designing_gadgets!.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                if (gadget.is_selected()) {
                    gadget.destroy()
                    count++
                }
            })
            if (count === 0) Log.alert("You need to select the object to delete")
        }
    }
    //***************************************************************************
    private static _check_document_exist(): boolean {
        if (Designer.designing_gadgets) {
            return true;
        } else {
            Log.alert("You must create or open a document")
            return false;
        }
    }
    //***************************************************************************
    public c_designer_mode(): void {
        //Set designer mode.
        if (Designer.da?.designer_mode) {
            const designer_mode=Designer.da?.designer_mode.get_value()
            Designer.designing_gadgets?.set_designing(designer_mode)
        }
    }
    //***************************************************************************
}