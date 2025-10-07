import { createRoot } from 'react-dom/client';
import CPanel from "../components/panel/comp/CPanel"
import CToggle from "../components/toggle/comp/CToggle";
import CEdit from "../components/edit/comp/CEdit";
import CLabel from "../components/label/comp/CLabel";
import GDefinitions from "../gadget/GDefinitions";
import CImage from "../components/image/comp/CImage";
import CCheckbox from "../components/checkbox/comp/CCheckbox";
import CCombobox from "../components/combobox/comp/CCombobox";
import CListbox from "../components/listbox/comp/CListbox";
import CPopup from "../components/popup/comp/CPopup";
import Log from "../../general/Log";
import CComponent from "../components_base/CComponent";
import GObject from "../../general/GObject";
import GString from "../../general/GString";
import Gadget from "../gadget/Gadget";
import Access from "../general/Access";
import { STAjaxPacket, STElement, STGadget_event, STNull, STObjectAny, STValue } from "../../general/STypes";
import Commands from "../general/Commands";
import SMetrics from "../../general/SMetrics";
import Ajax from "../../../application/common/system/ajax/Ajax";
import CMenuitem from "../components/menuitem/comp/CMenuitem";
import CMenutitle from "../components/menutitle/comp/CMenutitle";
import CTree from "../components/tree/comp/CTree";
import CWidget from "../components/widget/comp/CWidget";
import CWidgetpanel from "../components/widgetpanel/comp/CWidgetpanel";
import Gadgets_def from "./Gadgets_head";
import CWidgetpanel_Definitions, { T_GWidgetpanel_Def } from "../components/widgetpanel/comp/CWidgetpanel_Definitions";
import CAttach from "../components/attach/comp/CAttach";
import CGrid from "../components/grid/comp/CGrid";
import T from "../../translate/T";
import { $general$files$read_relative_file } from "../../../application/common/system/ajax/$definitions/general/files/$general$files$read_relative_file";
import CTabs from "../components/tab/comp/CTabs";
import { CTextarea } from '../components/textarea/comp/CTextarea';
import CButton from '../components/button/comp/CButton';
import GPopup_Window from '../components/popup/logic/GPopup_Window';
/*
Gadgets.get_instance()------g<----owner-Gadgets...
                            g
                            g




*/

//******************************************************************
//Definition of types
export type TAdjust_url_fucntion = (url: string) => string
export type TGadgets_callback = (result: boolean) => void
export type TGadgets_forEach = (gadget: Gadget) => void
export type TGadgets_evaluateStr = (text: string|STNull) => string

//******************************************************************
export type TGadgetsOptions = {
    designing: boolean
    omit_open_error: boolean
}
//******************************************************************


export default class Gadgets {
    //******************************************************************
    static DESIGNING_KEY_PREFIX = "designer-"

    static DESIGNING_COMMAND_NORMAL="n"
    static DESIGNING_COMMAND_SHOW_DETAILS="d"

    static _reactRoot:any
    static _instance:Gadgets
    static key_count=0;
    static _adjust_url_function: TAdjust_url_fucntion
    static _user_access: string
    static _last_baseid: string | null = null

    public head: Gadgets_def = new Gadgets_def(this)

    gadgets_onclick: STGadget_event | STNull = null
    gadgets_oncommand: STGadget_event | STNull = null
    gadgets_onchange: STGadget_event | STNull = null
    gadgets_area_onclick: STGadget_event | STNull = null
    //map: Map<string, Gadget> = new Map()
    root_gadget!: Gadget
    is_main_window:boolean=false
    page_or_definition!:any
    private _designing:string|null=null
    _command_instance: Commands | STNull=null
    _key_prefix: string | STNull=null
    _css: STObjectAny | STNull      //Css definition for the instance Gadgets indicated in the heading.
    options: TGadgetsOptions
    private _owner_gadget:Gadget|STNull=null //Used when this tree framework is being displayed within a gadget.
    _definition: STObjectAny = {}
    da: STObjectAny = {}                    //Use to acces framework identified by the key.

    //******************************************************************
    static inst():Gadgets {
        return Gadgets._instance
    }
    //******************************************************************
    static getReactRoot() {
        return Gadgets._reactRoot
    }
    //******************************************************************
    static createReactRoot(rootId:string) {
        const container = document.getElementById(rootId)
        Gadgets._reactRoot = createRoot(container!)
    }
    //******************************************************************
    // options: designing:boolean
    constructor(is_main_window: boolean, page_or_definition: any, options: STObjectAny, key_prefix: string | null, callback: TGadgets_callback) {

        this.is_main_window = is_main_window
        this.page_or_definition=page_or_definition
        this._key_prefix=key_prefix
        this.options = options as TGadgetsOptions

        if (options.designing) this.set_designing(options.designing)

        if (GObject.isInvalid(this._key_prefix)) this._key_prefix=""

        if (is_main_window) {
            Gadgets._instance = this
        }

        if (GString.isString(this.page_or_definition)) {            
            this.creage_gadgets_from_page_name(callback)
        } else {
             this.create_gadgets_from_definition(this.page_or_definition, callback)
        }
    }
    //-------------------------------------------
    creage_gadgets_from_page_name(callback: TGadgets_callback):void {
        let omit_include=false
        if (this.is_designing()) omit_include = true

        const path = SMetrics.inst().adjust_pagename(this.page_or_definition)
        const $=$general$files$read_relative_file
        const request:STAjaxPacket={}
        request[$.I_OMIT_INCLUDE]=omit_include
        request[$.I_PATH]=path
        new Ajax().to_omit_error().to_omit_login().call("Getting page definition from server: " + this.page_or_definition, $.COMMAND, request, (ajax: Ajax) => {
            try {
                if (ajax.ok()) {
                    const definition = JSON.parse(ajax.getResponse().context)
                    this.create_gadgets_from_definition(definition, callback)
                } else {
                    if (!(this.options.omit_open_error)) {
                        Log.alert("desk/module/\n\nName: " + this.page_or_definition + "\n\n" + ajax.getError())
                    }
                    if (callback) callback(false)
                }
            } catch (e) {
                Log.logExc("call_server. " + this.page_or_definition, e)
            }
        })

    }
    //-------------------------------------------
    create_gadgets_from_definition(definition:STObjectAny, callback: TGadgets_callback): void {
        let job=""
        try {
            job="parsing"
            this._definition = definition
            if (this._definition!.head) this.head._head = this._definition!.head

            job="create_gadget_tree_from_definition"
            this.create_gadget_tree_from_definition(null, this._definition!.body,false,null)

            //Set page title
            job="set_title"
            if (this.head.title()) document.title = this.translate(this.head.title())!

            job="render main windows"
            if (this.is_main_window) {
                Gadgets.getReactRoot().render(this.get_render_elements());
            }
            callback(true)
        } catch (e) {
            let res="" //JSON.stringify(response_from_server)
            if (res) if (res.length>250) res=res.substring(0,250)
            Log.logExc("Page content parse error. job:" + job
                + "\n" + " URL:" + SMetrics.inst().get_server_url_service()
                //+"\n"+" Request to server:"+JSON.stringify(request)
                +"\n"+" Response from server:"+res
                ,e)
            callback(false)
        }
    }
    //******************************************************************
    validate_da(title:string, fields:string[]) {
        const fieldsg: string[] = Object.keys(this.da)
        for (let i = 0; i < fields.length; i++) {
            if (!this.da[fields[i]]) {
                Log.alert(T.t("Field has not been defined on form: "+title+ " id=" + fields[i]))
            }
        }
    }
    //******************************************************************
    set_owner(ownerGadget: Gadget | null) {
        this._owner_gadget = ownerGadget
    }
    //******************************************************************
    get_owner(): Gadget {
        return this._owner_gadget!
    }
    //******************************************************************
    get_render_elements(): STElement {
        if (this.root_gadget) return this.root_gadget.get_render_elements()
        else {
            return <></>
        }
    }
    //******************************************************************
    get_root_gadget(): Gadget {
        return this.root_gadget
    }
    //******************************************************************
    get_css(name: string): STObjectAny {
        let result={}
        if (!name) return result;
        let error=false
        if (this.head.css()) {
            if (!this._css) {
                try {
                    this._css = JSON.parse("{" + this.head.css() + "}")
                    this._get_css__json_reported_count=0
                } catch (e) {
                    if (this._get_css__json_reported_count===0) {
                        Log.log("Error in css Json format: "+this.head.css())
                    }
                    this._get_css__json_reported_count++
                    error=true
                }
            }
            if (!error) if ((this._css as STObjectAny)[name]) {
                result = (this._css as STObjectAny)[name]
            }
        }
        return result
    }
    _get_css__json_reported_count=0
    //******************************************************************
    create_gadget_tree_from_definition(parentGadget:Gadget|STNull, definition:STObjectAny, construct_first_level_definition:boolean, insert_gadget_at_this_gadget:Gadget|STNull):Gadget|null {
        return this._create_gadget_tree_from_definition_recursion(parentGadget, definition,0, construct_first_level_definition, insert_gadget_at_this_gadget)
    }
    //-------------------------------------
    _create_gadget_tree_from_definition_recursion(parentGadget: Gadget|STNull, parentDefinition: STObjectAny, depth:number, construct_first_level_definition:boolean, insert_gadget_at_this_gadget:Gadget|STNull):Gadget|null {

        let gadget:Gadget|STNull=null
        try {
            //Generate program evaluations and its values
            if (depth===0) gadget=new Gadget(this,parentGadget, parentDefinition, construct_first_level_definition, insert_gadget_at_this_gadget)
            else gadget = new Gadget(this, parentGadget, parentDefinition, false, null)

            //Assign direct access gadget.
            const id=gadget.def.id()
            if (id) this.da[id]=gadget

            if (GObject.isValid(parentDefinition.children)) if (Array.isArray(parentDefinition.children)) {
                for (let i=0; i<parentDefinition.children.length; i++) {
                    this._create_gadget_tree_from_definition_recursion(gadget, parentDefinition.children[i],depth+1,false,null)
                }
            }
            return gadget
        } catch (e) {
            let det=""
            if (gadget) det=gadget.get_string_detail(0)
            Log.logExc("Error creating gadget from definition:" + det
                + "\n"
                ,e)
            return null
        }
    }
    //******************************************************************
    set_designing( value:string|null ):void { this._designing=value }
    is_designing():string|null { return this._designing }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    //******************************************************************
    static get_element_from_name(name:string):CComponent {
        let result : any
        if (name === GDefinitions.Attach) result = CAttach
        else if (name === GDefinitions.Button) result = CButton
        else if (name === GDefinitions.Checkbox) result = CCheckbox
        else if (name === GDefinitions.Combobox) result = CCombobox
        else if (name === GDefinitions.Edit) result = CEdit
        else if (name === GDefinitions.Grid) result = CGrid
        else if (name === GDefinitions.Image) result = CImage
        else if (name === GDefinitions.Label) result = CLabel
        else if (name === GDefinitions.Listbox) result = CListbox
        else if (name === GDefinitions.Menutitle) result = CMenutitle
        else if (name === GDefinitions.Menuitem) result = CMenuitem
        else if (name === GDefinitions.Panel) result = CPanel
        else if (name === GDefinitions.Popup) result = CPopup
        else if (name === GDefinitions.Tabs) result = CTabs
        else if (name === GDefinitions.Textarea) result = CTextarea
        else if (name === GDefinitions.Toggle) result = CToggle
        else if (name === GDefinitions.Tree) result = CTree
        else if (name === GDefinitions.Widget) result = CWidget
        else if (name === GDefinitions.Widgetpanel) result = CWidgetpanel
        return result
    }
    //******************************************************************
    static generate_key():string {
        let key=Gadgets.key_count.toString()
        Gadgets.key_count++
        return key
    }
    //******************************************************************
    
    //******************************************************************
    get(id: string): Gadget | STNull {
        try {
            return this.da[id]
        } catch(e) {
            return null
        }
    }
    //******************************************************************
    get_value(id: string): STValue {
        let gadget=this.da[id]
        if (gadget) {
            return gadget.get_value()
        }
        else {
            Log.log("Error: Element not found for key: "+id)
            return null
        }
    }
    set_value(id: string, value: STValue) {
        let gadget=this.da[id]
        if (gadget) {
            gadget.set_value(value)
        }
    }
    //******************************************************************
    //******************************************************************
    get_gadget_tab(table: string, field: string): Gadget | STNull {
        let result: Gadget | STNull = null
        this.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
            if (!result) if (gadget.def.table() === table) if (gadget.def.field0() === field) {
                result = gadget
            }
        })
        return result
    }
    //******************************************************************
    get_value_tab(table: string, field: string): any {
        const gadget = this.get_gadget_tab(table, field)
        if (gadget) return gadget.get_value()
        else return null
    }
    //******************************************************************
    //*****************************************************
    execute(gadget: Gadget, script: string): any {
        if (!script) return null
        let result:any=null

        if (!this._command_instance)  return result

        
        try {
            this._command_instance.set_calling_gadget(gadget)
        } catch (e) {
            Log.logExc("Gadgets.execute.set_event_gadget", e)
        }
        

        let app = this._command_instance
        if (app) {
            try {
                app.clear_result()
                eval(script)
                result = app.get_result()
            } catch (e) {
                Log.logDet("Error evaluating script/command1: " + script, e, true)
            }
        }
        return result
    }
    //******************************************************************
    event_gadgets_oncommand: STGadget_event = (event: STObjectAny|STNull, gadget: Gadget|STNull) => {
        if (this._command_instance) {
            let upperLevels=1 //Check commands for this gadget and upperLevels above until instruction is found.
            while ((upperLevels >= 0) && (gadget!=null)) {
                if (gadget.def.script()) {
                    this.__execute_command_verify_access(gadget)
                    upperLevels=-1
                } else {
                    upperLevels--
                    gadget = gadget.get_parent()
                }
            }
        }
    }
    //----------------------------------
    __execute_command_verify_access(gadget: Gadget) {
        let access = gadget.def.access()
        let access_error = Access.check(gadget.def.script_access(), Gadgets._user_access);

        if (access_error === null) {
            return this.execute_command(gadget, gadget.def.script())
        }
        else {
            Log.alert(access_error)
            return null
        }
    }

    //----------------------------------
    /*
    __execute_commands_do(gadget:Gadget) {
        let result

        if (Array.isArray(gadget.def.script())) {
            //.. Future implementation.
            //gadget.def.script().forEach((script: string) => {
            //    result=this.execute(gadget,script)
            //})
        } else {
            try {
                //eval(gadget.defin.def().script)
                result = this.execute(gadget, gadget.def.script()!)
            } catch (e) {
                Log.logDet("Error evaluating script/command2: " + gadget.def.script(), e, true)
            }
        }
        return result
    }
    */
    //----------------------------------
    public execute_command(gadget: Gadget, script_text:any):string|STNull {
        if (!script_text) return null

        let result

        if (Array.isArray(script_text)) {
            script_text.forEach((script: string) => {
                result = this.execute(gadget, script)
            })
        } else {
            try {
                //eval(gadget.def().script)
                result = this.execute(gadget, script_text)
            } catch (e) {
                Log.logDet("Error evaluating script/command2: " + script_text, e, true)
            }
        }
        return result
    }
    //******************************************************************
    set_gadgets_oncommand(function_var: STGadget_event): void {
        this.gadgets_oncommand = function_var
    }
    //******************************************************************
    set_gadgets_onclick(onclick: STGadget_event): void {
        this.event_gadgets_onclick = onclick
    }
    //******************************************************************
    set_gadgets_area_onclick(onclick: STGadget_event): void {
        this.event_gadgets_area_onclick = onclick
    }
    //******************************************************************
    set_gadgets_onchange(onchange: STGadget_event): void {
        this.event_gadgets_onchange = onchange
    }
    //******************************************************************
    set_command_instance(command_instance: Commands): void {
        this._command_instance = command_instance
    }
    //******************************************************************
    get_command_instance():Commands|STNull {
        return this._command_instance
    }
    //******************************************************************
    event_gadgets_onclick: STGadget_event = (event: STObjectAny | STNull, gadget: Gadget) => {
        if (this.gadgets_onclick) this.gadgets_onclick(event as STObjectAny,gadget)
    }
    //******************************************************************
    event_gadgets_area_onclick: STGadget_event = (event: STObjectAny | STNull,gadget:Gadget) => {
        if (this.gadgets_area_onclick) this.gadgets_area_onclick(event as STObjectAny,gadget)
    }
    //******************************************************************
    event_gadgets_onchange: STGadget_event = (event: STObjectAny | STNull, gadget: Gadget) => {
        if (this.gadgets_onchange) this.gadgets_onchange(event as STObjectAny, gadget)
    }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    //******************************************************************
    /*
    clear_element_buffers(): Gadget | STNull {
        let result = null
        try {
            this.map!.forEach((gadget: Gadget, key: string) => {
                if (gadget.is_selected()) {
                    result = gadget
                }
            })
        } catch (e) {
            Log.logExc("selected_get_first", e)
        }
        return result;
    }
    */
    //******************************************************************
    selected_get_first(): Gadget | STNull {
        return this._selected_get_first(this.get_root_gadget()!)
    }
    _selected_get_first(gadget:Gadget): Gadget | STNull {
        if (gadget.is_selected()) return gadget
        for (const child of gadget._children) {
            const resGadget=this._selected_get_first(child)
            if (resGadget) return resGadget
        }
        return null
    }
    //******************************************************************
    selected_get_count(): number {
        return this._selected_get_count(this.get_root_gadget()!)
    }
    _selected_get_count(gadget:Gadget): number {
        let count=0
        if (gadget.is_selected()) count++
        for (const child of gadget._children) {
            count+=this._selected_get_count(child)
        }
        return count
    }
    //******************************************************************
    static LEVEL_BASIC = 0
    static LEVEL_DEEP = 1
    forEach(level:number, callback:TGadgets_forEach): void {
        this._forEach(this.get_root_gadget(), level, callback)
    }
    _forEach(gadget:Gadget, level:number, callback:TGadgets_forEach): void {
        callback(gadget)

        //Continue in case of widgets.
        if (level >= Gadgets.LEVEL_DEEP) {
            if (gadget.gwidgetpanel()) {
                const defs = gadget.gwidgetpanel()!._widgetDefs!._defs as T_GWidgetpanel_Def[]
                if (defs) for (let i = 0; i < defs.length; i++) {
                    const def=defs[i]
                    //def.gadgets.forEach(Gadgets.LEVEL_BASIC, callback)
                    this._forEach(def.gadgets.get_root_gadget(),level,callback)
                }
            }
        }

        for (const child of gadget._children) {
            this._forEach(child, level, callback)
        }
    }
    /*
    forEach = (level:number, callback:TGadgets_forEach) => {
        try {
            this.map!.forEach((gadget:Gadget, key:string) => {
                callback(gadget)

                //Continue in case of widgets.
                if (level >= Gadgets.LEVEL_DEEP) {
                    if (gadget.gwidgetpanel()) {
                        const defs = gadget.gwidgetpanel()!._widgetDefs!._defs as T_GWidgetpanel_Def[]
                        if (defs) for (let i = 0; i < defs.length; i++) {
                            const def=defs[i]
                            def.gadgets.forEach(Gadgets.LEVEL_BASIC, callback)
                        }
                    }
                }
            })
        } catch (e) {
            Log.logExc("Gadgets.forEach",e)
        }
    }
    */
    //******************************************************************
    clear_modifications():void {
        this.forEach(Gadgets.LEVEL_BASIC, (gadget)=>{
            gadget.clear_modifications()
        })
    }
    //******************************************************************
    get_modifications():number {
        let count=0
        this.forEach(Gadgets.LEVEL_BASIC, (gadget)=>{
            count+=gadget.get_modifications()
        })
        return count
    }
    //******************************************************************
    clear_all_selections(level:number): void {

        this._clear_all_selections_nonrecursive(level)

        /*
        //Clear upper tree if it is the case for Widgetpanel
        if (this._owner_gadget != null) {
            const widPanel = this._owner_gadget.get_GWidgetpanel()
            if (widPanel) {
                const panelDefs = widPanel.get_panel_definitions()
                if (panelDefs) {
                    for (let i = 0; i < panelDefs._defs.length; i++) {
                        const framework = panelDefs._defs[i].framework
                        if (framework) framework._clear_all_selections_nonrecursive()
                    }
                }
            }
        }
        */
        }
    //******************************************************************
    _clear_all_selections_nonrecursive(level: number): void {
        this.forEach(level, (gadget) => {
             gadget.set_selected(false)
        })        
    }
    //******************************************************************
    static set_user_access(access:string):void {
        Gadgets._user_access=access
    }
    //******************************************************************
    /*
    do_evaluations(level: number, evaluateStr: TGadgets_evaluateStr): void {
        this.forEach(level, (gadget) => {
            if (gadget.isGLabel()) {
                let st = gadget.get_value()
                if (GString.isStringWithText(st)) {
                    st = evaluateStr(st)
                    gadget.set_value(st)
                }
            } else {
                let st: string | STNull = gadget.def.caption()
                if (GString.isStringWithText(st)) {
                    st = evaluateStr(st)
                    gadget.set_caption(st)
                }
            }
        })
    }
    */
    //******************************************************************
    update_state_and_evaluations() {
        Gadgets.inst().forEach(Gadgets.LEVEL_DEEP, (gadget) => {
            if (gadget.com()) {
                if (gadget.gwidgetpanel()) {
                    CWidgetpanel_Definitions.initialize(gadget)
                }
                gadget.com().st.update_state_from_gadget()
             }
        })
    }
    //******************************************************************
    static clear_complete_react_cache_data() {
        // Function to clear complete cache data
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        });
        //End of clear
    }
   //******************************************************************
    /*
    static refresh_complete_application() {
        //Gadgets.inst().update_state_and_evaluations()
        //Gadgets.inst().root_gadget.activate_rendering()
        Gadgets.inst().forEach(Gadgets.LEVEL_DEEP, (gadget) => {
            gadget.activate_rendering()
        })
   }
   */
   //******************************************************************
   //******************************************************************
   //******************************************************************
   //******************************************************************
   /* left here in case it is needed.
    private static KEYBOARD_EVENT_GRID = 0;
    private static KEYBOARD_EVENT_RESERVED = 1;
    private static _keyboardEvents: Array<Function | null> = [null, null];
   //******************************************************************
    private static _handleGlobalKeyDown = (event: KeyboardEvent) => {
        //console.log('Global key pressed:', event.key);
        for (let i = 0; i < Gadgets._keyboardEvents.length; i++) {
            const callback = Gadgets._keyboardEvents[i];
            if (callback) {
                callback(event);
            }
        }
    }
   //******************************************************************
    public static setKeyboardEvent(eventType: number, callback: Function | null): void {
        Gadgets._keyboardEvents[eventType] = callback;
    }
    */
    //******************************************************************
    //******************************************************************
    //******************************************************************
    //******************************************************************
    public fields_get_list(tablename:string): string[] {
        const fields: string[] = [];

        this.forEach(Gadgets.LEVEL_BASIC, (gadget:Gadget) => {
            if (gadget.def.table() === tablename) {
                const field=gadget.def.field0();
                if (field) fields.push(field);
            }
        })

        return fields;
    }
    //******************************************************************
    public fields_populate(tablename:string, jsonFields: any=undefined): void {
        this.forEach(Gadgets.LEVEL_BASIC, (gadget:Gadget) => {
            if (gadget.def.table() === tablename) {
                const fieldname=gadget.def.field0();
                if (fieldname) {
                    let gadget=this.get_gadget_tab(tablename,fieldname)
                    let value=jsonFields[fieldname]
                    if (gadget) gadget.set_value(value)
                }
            }
        })
    }
    //******************************************************************
    public translate(text:string):string {
        return T.translate(this._definition.language,text)
    }
    //******************************************************************
    public get_definition_head(key:string):string|null {
        if (this._definition.head[key]) return this._definition.head[key]
        else return null
    }
    //*****************************************************
    public data_to_gadgets(table:string, data: STObjectAny): void {
        try {
            this.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                gadget.clear_modifications()
                if (gadget.def.table() === table) {
                    const field = gadget.def.field0()
                    if (field) {
                        let val = data[field]
                        gadget.set_value(val)
                        /*
                        if (false && field === "fields" && gadget.isGrid()) {
                            //Special case for fields grid.
                            if (val) {
                                gadget.dgrid()!.body().set_all_rows(val,false,false)
                            } else {
                                gadget.dgrid()!.body().clear(false)
                            }
                        } else {
                            gadget.set_value(null) //Set null to activate state with new value.
                            if (GObject.isValid(val)) {
                                if (val instanceof Object) {
                                    val = JSON.stringify(val)
                                }
                                gadget.set_value(val)
                            }

                        }
                        */
                    }
                }
            })

        } catch (e) {
            Log.logExc("Gadgets.data_to_gadgets",e)
        }
    }
    //*****************************************************
    public gadgets_to_data(table:string, definition: STObjectAny):void {
        try {
            this.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                if (gadget.def.table() === table) if (gadget.get_modifications() > 0) {
                    let val = gadget.get_value()
                    if (val === "") val = null
                    if (gadget.isCheckbox()) if (!GObject.isTrue(val)) val = null
                    if (gadget.isToggle()) if (!GObject.isTrue(val)) val = null
                    const field = gadget.def.field0()
                    if (field) {
                        if (GObject.isValid(val)) {
                            definition[field] = val
                        } else {
                            delete definition[field]
                        }
                    }
                }
            })
        } catch (e) {
        Log.logExc("Gadgets.gadgets_to_data",e)
        }
    }
    //******************************************************************
}