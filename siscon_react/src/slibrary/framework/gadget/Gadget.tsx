import GObject from "../../general/GObject";
import Gadgets from "../gadgets/Gadgets";
import GDefinitions from "./GDefinitions";
import Log from "../../general/Log";
import { STCallBack_Basic, STElement, STNull, STObjectAny, STValue, STypes } from "../../general/STypes";
import * as React from "react";
import GetReactElementsFor_GadgetChildren from "../general/GetReactElementsFor_GadgetChildren";
import CWidgetpanel from "../components/cwidgetpanel/CWidgetpanel";
import CAttach from "../components/cattach/CAttach";
import CButton from "../components/cbutton/CButton";
import CCheckbox from "../components/ccheckbox/CCheckbox";
import CCombobox from "../components/ccombobox/CCombobox";
import CEdit from "../components/cedit/CEdit";
import CImage from "../components/cimage/CImage";
import CLabel from "../components/clabel/CLabel";
import CGrid from "../components/cgrid/CGrid";
import CListbox from "../components/clistbox/CListbox";
import CMenutitle from "../components/cmenutitle/CMenutitle";
import CMenuitem from "../components/cmenuitem/CMenuitem";
import CPanel from "../components/cpanel/CPanel";
import CWidget from "../components/cwidget/CWidget";
import CToggle from "../components/ctoggle/CToggle";
import Gadget_event from "./Gadget_event";
import Gadget_def from "./Gadget_def";
import Gadget_drag from "./Gadget_drag";
import CPopup from "../components/cpopup/CPopup";
import Gadget_metrics from "./Gadget_metrics";
import CTree from "../components/ctree/CTree";
import SMetrics from "../../general/SMetrics";
import Attach from "./gadget_data/dattach/Attach";
import DList, { Toptions } from "./gadget_data/dlist/DList";
import CComponent from "../components_base/CComponent";
import CTabs from "../components/ctab/CTabs";
import DTabs from "./gadget_data/dtabs/DTabs";
import { DGrid } from "./gadget_data/dgrid/DGrid";
import GString from "../../general/GString";
import { CTextarea } from "../components/ctextarea/CTextarea";
import { GAttachGeneral } from "./gadget_data/dattach/GAttachGeneral";
import { AttachGeneral } from "../../../application/attach/select_company/AttachGeneral";
//*****************************************************
export type TGadget_Options = string[]
//*****************************************************
export default class Gadget {

    public event: Gadget_event = new Gadget_event(this)
    public def: Gadget_def = new Gadget_def(this)
    public metrics: Gadget_metrics = new Gadget_metrics(this)

    public _component!: CComponent
    public _gadgets: Gadgets
    public _nested_gadgets!: Gadgets|STNull
    public _nested_items!: STElement
    public _value: STValue
    public _key!:string
    public _children:Gadget[]=[]
    public _parent!:Gadget|STNull
    public _children_react_elements: STElement|STNull=null //Used in GPanel to have the children react elements ready
    public _selected: boolean=false
    public _hidden = false
    private _modifications: number=0
    private _data: any | null=null
    //private _gadget_hidden = false

    constructor(gadgets:Gadgets, parent:Gadget|STNull, definition: STObjectAny, construct_definition: boolean, insert_gadget_at_this_gadget: Gadget|STNull) {
        this._gadgets=gadgets
        this._parent=parent
        this.def._def = definition

        try {
            //Set parent gadget and add this child.
            if (parent) parent.add_child(this,construct_definition,insert_gadget_at_this_gadget)
            if (GObject.isInvalid(gadgets.root_gadget)) gadgets.root_gadget=this

            this._assign_key()

            //Create data part component.
            this._create_data()

            this.update_data_from_def()

            this.update_metrics_from_def()

        } catch (e) {
            Log.logExc("Gadget.constructor()",e)
        }
    }
    //------------------------------
    public update_data_from_def() {
        //Set data values if needed.
        try {
            if (this.def.value()) {
                this.set_value(this.def.value())
            } else if (this.dlist()) {
                if  (this.dlist()!.get_options().length>0) {
                    this.set_value(this.dlist()!.get_options()[0].value)
                }
            }
        } catch (e) {
            Log.logExc("Gadget._set_initial_data(); gadget="+this.toString(),e)
        }
    }
    //-------------------------------
    public update_metrics_from_def() {
        try {
            this.metrics.set_left(GString.getNumericHtmlEquivalent(this.def.left()))
            this.metrics.set_top(GString.getNumericHtmlEquivalent(this.def.top()))
            this.metrics.set_width(GString.getNumericHtmlEquivalent(this.def.width()))
            this.metrics.set_height(GString.getNumericHtmlEquivalent(this.def.height()))

            if (this.isGPopup()) {
                //Activate positioning for popup's to enable floating.
                if (!this.metrics.get_left()) this.metrics.set_left(0)
                if (!this.metrics.get_top()) this.metrics.set_top(0)
            }
        } catch (e) {
            Log.logExc("Gadget._set_initial_metrics(); gadget="+this.toString(),e)
        }
    }
    //-------------------------------
    private _create_data() {
        try {
            if (this.isGGrid()) this._data=new DGrid(this)
            else if (this.isGTabs()) this._data=new DTabs(this)
            else if (this.isGListbox() || this.isGCombobox()) this._data=new DList(this)
            else this._data=null
        } catch (e) {
            Log.logExc("Gadget._create_data()",e)
        }
    }
    //*****************************************************
     public is_dragable():boolean {
        if (this.metrics.get_left()!==null || this.metrics.get_top()!==null) {
            return true
        } else {
            return false
        }
     }
     //*****************************************************
    re_construct() {
        this._create_data()
    }
    //*****************************************************
    _assign_key():void {
        let key=null
        if (GObject.isValid(this.def.id())) { 
            key = this.def.id()!+"-"+this.gadgets()._key_prefix+Gadgets.generate_key()
        } else {
            key=this.gadgets()._key_prefix+Gadgets.generate_key()
        }
        this.set_key(key)
    }
    //-----------------------------------------------------
    _get_key_description(gadget:Gadget):string {
        let st=""
        if (gadget.def.id()) st += " id=" + gadget.def.id(); else st+="<no key>"
        if (this.def.caption()) st += " Caption=" + this.def.caption()
        return st
    }
    //*****************************************************
    isGAttach(): boolean { return (this.def.type() === GDefinitions.GAttach) }
    isGButton(): boolean { return (this.def.type() === GDefinitions.GButton) }
    isGCheckbox(): boolean { return (this.def.type() === GDefinitions.GCheckbox) }
    isGCombobox(): boolean { return (this.def.type() === GDefinitions.GCombobox) }
    isGEdit(): boolean { return (this.def.type() === GDefinitions.GEdit) }
    isGGrid(): boolean { return (this.def.type() === GDefinitions.GGrid) }
    isGImage(): boolean { return (this.def.type() === GDefinitions.GImage) }
    isGLabel(): boolean { return (this.def.type() === GDefinitions.GLabel) }
    isGListbox(): boolean { return (this.def.type() === GDefinitions.GListbox) }
    isGMenutitle(): boolean { return (this.def.type() === GDefinitions.GMenutitle) }
    isGMenuitem(): boolean { return (this.def.type() === GDefinitions.GMenuitem) }
    isGPanel(): boolean { return (this.def.type() === GDefinitions.GPanel) }
    isGPopup(): boolean { return (this.def.type() === GDefinitions.GPopup) }
    isGTextarea(): boolean { return (this.def.type() === GDefinitions.GTextarea) }
    isGTabs(): boolean { return (this.def.type() === GDefinitions.GTabs) }
    isGToggle(): boolean { return (this.def.type() === GDefinitions.GToggle) }
    isGTree(): boolean { return (this.def.type() === GDefinitions.GTree) }
    isGWidget(): boolean { return (this.def.type() === GDefinitions.GWidget) }
    isGWidgetpanel(): boolean { return (this.def.type() === GDefinitions.GWidgetpanel) }
    //*****************************************************
    gattach(): CAttach | null { if (this._component instanceof CAttach) return this._component; else return null }
    gbutton(): CButton | null { if (this._component instanceof CButton) return this._component; else return null }
    gcheckbox(): CCheckbox | null { if (this._component instanceof CCheckbox) return this._component; else return null }
    gcombobox(): CCombobox | null { if (this._component instanceof CCombobox) return this._component; else return null }
    gedit(): CEdit | null { if (this._component instanceof CEdit) return this._component; else return null }
    ggrid(): CGrid | null { if (this._component instanceof CGrid) return this._component; else return null }
    gimage(): CImage | null { if (this._component instanceof CImage) return this._component; else return null }
    glabel(): CLabel | null { if (this._component instanceof CLabel) return this._component; else return null }
    glistbox(): CListbox | null { if (this._component instanceof CListbox) return this._component; else return null }
    gmenutitle(): CMenutitle | null { if (this._component instanceof CMenutitle) return this._component; else return null }
    gmenuitem(): CMenuitem | null { if (this._component instanceof CMenuitem) return this._component; else return null }
    gpanel(): CPanel | null { if (this._component instanceof CPanel) return this._component; else return null }
    gpopup(): CPopup | null { if (this._component instanceof CPopup) return this._component; else return null }
    gtextarea(): CTextarea | null { if (this._component instanceof CTextarea) return this._component; else return null }
    gtoggle(): CToggle | null { if (this._component instanceof CToggle) return this._component; else return null }
    gtabs(): CTabs | null { if (this._component instanceof CTabs) return this._component; else return null }
    gtree(): CTree | null { if (this._component instanceof CTree) return this._component; else return null }
    gwidget(): CWidget | null { if (this._component instanceof CWidget) return this._component; else return null }
    gwidgetpanel(): CWidgetpanel | null { if (this._component instanceof CWidgetpanel) return this._component; else return null }
    //*****************************************************
    dgrid(): DGrid | STNull { if (this._data instanceof DGrid) return this._data; else return null }
    dlist(): DList | STNull { if (this._data instanceof DList) return this._data; else return null }
    dtabs(): DTabs | STNull { if (this._data instanceof DTabs) return this._data; else return null }
    //*****************************************************
    execute_on_mounted(callback: STCallBack_Basic) {
         this.__execute_on_mounted_nc(100, callback)        
    }
    __execute_on_mounted_nc(trial: number, callback: STCallBack_Basic) {
        setTimeout(() => {
            if (this._component) {
                callback()
            } else {
                if (trial > 0) {
                    this.__execute_on_mounted_nc(trial - 1, callback)
                } else {
                    callback()
                }
            }
        },100)
    }
    //*****************************************************
    add_child(gadget:Gadget,construct_definition:boolean,insert_gadget_at_this_gadget:Gadget|STNull):void {
        if (!this._children) this._children=[]
        if (insert_gadget_at_this_gadget) {
            let pos=insert_gadget_at_this_gadget.get_position();
            this._children.splice(pos,0,gadget)
            if (construct_definition) {
                if (!this.def.children()) this.def.def().children =[]
                this.def.def().children.splice(pos,0,gadget.def.def())
            }
        } else {
            this._children.push(gadget)
            if (construct_definition) {
                if (!this.def.children()) this.def.def().children =[]
                this.def.def().children.push(gadget.def.def())
            }
        }
        this.reset_react_children_elements()
    }
    //*****************************************************
    public set_options_from_string_array(option_array: string[]):void {
        try {
            if (this.dlist()) this.dlist()!.set_options_from_string_array(option_array)
            this.com().setState({options:this.dlist()!.get_options()})
        } catch (e) {
            Log.logExc("Gadget.set_options()", e)
        }
    }
    //*****************************************************
    public get_options():Toptions[] | STNull {
        try {
            if (this.dlist()) return this.dlist()!.get_options()
        } catch (e) {
            Log.logExc("Gadget.get_options()", e)
        }
        return null
    }
    //******************************************************************
    get_first_child(): Gadget | null {
        if (this._children==null) return null
        if (this._children.length == 0) return null
        return this._children[0]
    }
    //*****************************************************
    com():CComponent { return this._component }
    set_com(component:CComponent):void {
        this._component=component 
    }
    //*****************************************************
    set_focus():void {
        this._component.ref_item.current?.focus()
    }
    //*****************************************************
    set_nested_gadgets(nested_gadgets: Gadgets | STNull):void {
        this._nested_gadgets=nested_gadgets
        if (nested_gadgets) {
            this._nested_items = nested_gadgets.root_gadget.get_render_elements()
        } else {
            this._nested_items = STypes.STEmptyElement
        }
    }
    //*****************************************************
    private _attach_object:Attach|STNull
    get_attach_object(): Attach {
        if (!this._attach_object) this._attach_object=AttachGeneral.inst().create_attach_object(this)
        return this._attach_object!
    }
    //*****************************************************
    get_nested_gadgets(): Gadgets|STNull { return this._nested_gadgets }
    get_nested_items(): STElement {
        if (this._nested_items) return this._nested_items
        else return STypes.STEmptyElement
    }
    //*****************************************************
    //Return the first parent of the type indicated.
    get_parent_type(type:string) {
        let gadget:Gadget|STNull = this
        while (gadget!=null) {
            if (gadget.def.type() === type) return gadget
            gadget = gadget._parent
        }
        return null
    }
    //*****************************************************
    set_key(key:string):void {
        this._key=key
    }
    get_key(): string { 
        return this._key+this._key_suffix }
    get_key_clean(): string {
        if (this.gadgets().is_designing()) {
            let k = this._key
            k = k.substring(Gadgets.DESIGNING_KEY_PREFIX.length, k.length)
            return k
        } else {
            return this._key
        }
    }
    //-----------------------------------------------------
    //This is used by forceUpdate to modify the key (when rendering) so that React buffer is going to be reset.
    private _update_key_clear_buffer(): void {
        this._key_suffix = "."+Gadget._key_suffix_counter;
        Gadget._key_suffix_counter++;
    }
    private _key_suffix:string=""
    private static _key_suffix_counter=0;
    //*****************************************************
    gadgets():Gadgets {return this._gadgets }
    //*****************************************************
    set_value(value:STValue):void {
        this._value=value
        if (this._component) this._component.update_state_value()
    }
    get_value(): STValue {
        return this._value
        //if (!result && this.isGLabel()) this.set_value(
    }
    //*****************************************************
    can_be_selected():boolean {
        let result = false
        if (this.gadgets().is_designing()) result=true
        return result
    }
    //*****************************************************
    public is_mounted():boolean {
        if (this._component) return (this._component._mounted>0)
        return false
    }
    //*****************************************************
    is_selected():boolean {
        if (!this._component) return false
        if (GObject.isValid(this._selected)) return this._selected
        return false
    }
    //*****************************************************
    set_selected(logic: boolean): void {
        if (logic != this._selected) {
            this._selected=logic
            if (!this._component) return
            this._component.setState({x_selected: this._selected})
        }
    }
    //*****************************************************
    set_caption(caption:string):void {
        this._component.setState({caption: caption})
    }
    //*****************************************************
    get_modifications():number {
        //This is used to record modifications made.
        return this._modifications
    }
    clear_modifications():void {
        this._modifications=0
        if (this._component) {
            this._component.setState({ x_modifications: this._modifications })
        }
    }
    register_modification(): void {
        this._modifications++
        if (this._component) {
            this._component.setState({ x_modifications: this._modifications })
        }
    }
    //*****************************************************
    get_parent():Gadget|STNull {return this._parent }
    //*****************************************************
    get_children():Gadget[] {
        if (!this._children) return []
        return this._children
    }
    //*****************************************************
    forceStateChange() {

    }
    //*****************************************************
    activate_rendering() {
        this._activate_rendering_count++
        if (this._component) this._component.st.set_x_activate_rendering(this._activate_rendering_count)
    }
    _activate_rendering_count: number = 0
    //*****************************************************
    forceUpdate():void {
        this._update_key_clear_buffer()
        this.reset_react_children_elements()
        //setTimeout(() => {
            if (this.is_mounted()) this._component.forceUpdate()
        //},2000)
    }
    //*****************************************************
    reset_react_children_elements():void {
        this._children_react_elements = null        //Reset the children elements.
    }
    //*****************************************************
    get_react_children_elements(child_index:number|null): STElement | STNull {
        try {
            if (this._children != null) {
                if (!this._children_react_elements) {
                    //Create the elements, they have not been created yet.
                    this._children_react_elements = GetReactElementsFor_GadgetChildren.createChildrenElementsForPanelParent(this,child_index)
                }
            } else {
                this._children_react_elements=<></>
            }

            return this._children_react_elements
        } catch(e) {
            Log.logExc("Error: Gadget.get_react_children_elements: ", e)
            return <></>
        }
    }
    //*****************************************************
    isFocused():boolean {
        return this.com().isFocused()
    }
    //*****************************************************
    is_hidden(): boolean {
        return this._hidden
        /*
        let gad:any=this;
        while (gad) {
            if (this._hidden) return true
            gad=gad.get_parent()
        }
        return false
        */
    }
    //*****************************************************
    hide(logic: boolean): void {
        if (logic != this._hidden) {
            this._hidden = logic
            if (this.com()) this.com().st.update_state_hidden()
            if (this._parent != null) this._parent.forceUpdate()
        }
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //Add remove framework...
    //*****************************************************
    get_position():number {
        if (!this._parent) return -1
        if (this.get_parent()) for (let i=0; i<this.get_parent()!._children.length; i++) {
            if (this.get_parent()!._children[i]===this) {
                return i
            }
        }
        return -1;
    }
    //*****************************************************
    destroy():void {
        if (this._parent) {
            let pos = this.get_position()
            if (pos >= 0) {
                this._parent.def.def().children.splice(pos,1)
                this._parent._children.splice(pos,1)
                this._parent.reset_react_children_elements()

                //This produces the update on screen.
                /*
                this._parent.set_nested_gadgets(null)
                setTimeout(() => {
                    this._parent!.set_nested_gadgets()
                    this._parent!.forceUpdate()
                }, 40)
                */

                if (this.get_parent()) {
                    this.get_parent()!.forceUpdate()
                }
            }
        }
    }
    //******************************************************************
    public get_string_detail(depth:number):string {
        if (depth<0) depth=999999;
        let result:string = this._get_string_detail(depth,0);
        return result;
    }
    private _get_string_detail(depth:number, layer:number):string {
        let result:string= "type="+this.def.type()
        if (this.def.id()) result+=" id="+this.def.id();
        if (this.def.caption()) result+=" caption="+this.def.caption();
        if (this.def.width()) result+=" width="+this.def.width();
        if (this.def.height()) result+=" height="+this.def.height();
        if (this.def.image()) result+=" height="+this.def.image();
        
        if (this._hidden) result+=" hidden"
        //else if (this.is_hidden()) result+="par.hidden/"
        if (this._modifications) result+=" modifications="+this._modifications

        //Do recursive items.
        if (layer<depth && this.get_children()!=null) {
            for (let i=0; i<this.get_children()!.length; i++) {
                result+="\n"
                for (let x=0; x<layer+1; x++) result+="-"
                result+=this.get_children()![i]._get_string_detail(depth,layer+1)
            }
        }

        return result;
    }
    //******************************************************************
    public toString() {
        return this.get_string_detail(0)
    }
    //******************************************************************
    get_next_sibling():Gadget|null {
        if (this._parent == null) return null
        for (let i = 0; i < this._parent._children.length-1; i++) {
            if (this === this._parent._children[i]) return this._parent._children[i+1]
        }
        return null
    }
   //******************************************************************
    get_render_elements(): STElement {
        let react_element = STypes.STEmptyElement
        try {
            const type = this.def.type()
            if (type) {
                let element: CComponent = Gadgets.get_element_from_name(type)
                let props: STObjectAny = { gadget: this }

                if (element) react_element = React.createElement(element as unknown as React.ComponentClass, props, null)
            }
        } catch (e) {
            Log.logExc("create_react_element_from_gadget",e)
        }
        return react_element
    }
    //*****************************************************
    gadgetIsMainWindowRoot() {
        if (this.get_parent() === null) if (this.gadgets().is_main_window) {
            return true
        }
        return false
    }
//******************************************************************
    public set_on_selected(callback: STCallBack_Basic):void {
        this._on_selected = callback
    }
    public get_on_selected():STCallBack_Basic | STNull {
        return this._on_selected
    }
    private _on_selected:STCallBack_Basic|STNull=null
//******************************************************************
    public get_child_tag(tag:string):Gadget|null {
        return this._get_child_tag(this,tag)
    }
    public _get_child_tag(gadget:Gadget, tag:string):Gadget|null {
        if (gadget.def.tag()) if (tag===gadget.def.tag()!) return gadget
        for (const child of this._children) {
            const res=this._get_child_tag(child,tag)
            if (res) return res
        }
        return null
    }
//******************************************************************
   }