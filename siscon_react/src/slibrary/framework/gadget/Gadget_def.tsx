import Metrics from "../../../application/common/metrics/Metrics";
import GObject from "../../general/GObject";
import GString from "../../general/GString";
import Log from "../../general/Log";
import SMetrics from "../../general/SMetrics";
import { STNull, STObjectAny } from "../../general/STypes";
import SEvaluate from "../../sevaluations/SEvaluate";
import T from "../../translate/T";
import Gadgets from "../gadgets/Gadgets";
import Gadget from "./Gadget";

export type Toptions = {
    value: string,
    caption: string,
}

export default class Gadget_def {
    //*****************************************************
    static ORIENTATION = { row: "row", column: "column"}
    static H_ALIGN = { top: "left", center: "center", right:"right"}
    static V_ALIGN = { top: "top", center:"center", bottom:"bottom"}
    //*****************************************************
    //******************************************************************
    gadget: Gadget
    _def!: STObjectAny
    //******************************************************************
    constructor(gadget: Gadget) {
        this.gadget = gadget
    }
    //*****************************************************
    def(): STObjectAny { return this._def }
    set_def(definition: STObjectAny): void { 
        this._def = definition 
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    allow_resize(): string|null { return this._def.allow_resize ?? "" }
    caption(): string | STNull {
        if (GString.isStringWithText(this._def.caption)) {
            if (this._def.caption.indexOf("[") >=0) {
                return SEvaluate.Str(this._def.caption) 
            } else {
                return this.gadget.gadgets().translate(this._def.caption)
            }
        } else {
            return null
        }
    }
    class_name(): string|null { return this._def.class_name ?? "" }
    class_name_add_concat(classname: string): string {
        const thisclass = this.class_name()
        if (thisclass != null && thisclass!=="" && thisclass !== " ") return classname + " " + thisclass; else return classname
    }
    expand_width():boolean {return this._def.expand_width ?? false }
    expand_height():boolean {return this._def.expand_height ?? false }
    scroll():boolean {return this._def.scroll ?? false }
    access(): string | null { return this._def.access ?? null }
    h_align(): string | null { return this._def.h_align ?? null }
    v_align(): string | null { return this._def.v_align ?? null }
    id(): string | null { return this._def.id ?? null}
    include_file(): string | null { return this._def.include_file ?? null}
    value(): string | null { return this._def.value ?? null }

    children(): STObjectAny | null { return  this._def.children ?? null }
    css_name(): string | null { return this._def.css_name ?? null }
    data_type(): string | null { return this._def.data_type ?? null }
    dim_value_null(): boolean { return this._def.dim_value_null ?? false } 

    //Embedded represent the childs of a gadget that are not shown but will be displayed in another panel (gadget)
    embedded(): boolean { if (GObject.isValid(this._def.embedded)) return GObject.isTrue(this._def.embedded); else return false }
    embedded__get_root(): Gadget | STNull {
        let gadget: Gadget | STNull = this.gadget
        while (gadget != null) {
            if (gadget.def.embedded()) return gadget
            gadget = gadget._parent
        }
        return null
    }
    embedded__open_parent(logic: boolean): void {
        const root: Gadget | STNull = this.embedded__get_root()
        if (root) {
            root.def.show_hide_children__all(logic)
        }
    }

    format(): string | null { return this._def.format ?? null }
    gap(): string | null { return this._def.gap ?? null }
    heading_rows(): number { if (GObject.isValid(this._def.heading_rows)) return GObject.toNumber(this._def.heading_rows); else return 0 }
    image(): string|null {
        let image = null
        if (GObject.isValid(this._def.image) && this._def.image.startsWith("[")) {
            image=Metrics.inst().get_server_url()+SEvaluate.Str(this._def.image) 
        } else {
            image=this._def.image
        }
    
        if (image === "") image = "images/general/logo.svg"
        if (image) image = SMetrics.inst().adjust_url(image)
        return image
    }
    //key(): string | null { if (GObject.isValid(this._def.key)) return this._def.key; else return null }
    movable(): boolean {
        if (this.gadget.gadgets().is_designing()) return false
        if (GObject.isValid(this._def.movable)) return this._def.movable
        else if (this.gadget.isPopup()) return true
        return false
    }
    notes(): string | null { return this._def.notes ?? null }

    orientation(): string | null { return this._def.orientation ?? null }
    padding(): string | null { return this._def.padding ?? null }
    password(): string | null { return this._def.password ?? null }
    readonly(): boolean { if (GObject.isValid(this._def.readonly)) return this._def.readonly; else return false } 

    //This indicates the root object of a descendent group of framework. It is used to make changens from the root downwards.
    root(): boolean {
        if (GObject.isValid(this._def.root)) return GObject.isTrue(this._def.root); else return false
    }
    root__get_root(): Gadget | STNull {
        let gadget: Gadget | STNull = this.gadget
        while (gadget != null) {
            if (gadget.def.root()) return gadget
            gadget = gadget._parent
        }
        return null
    }
    root__visible(logic: boolean): void {
        let root: Gadget | STNull = this.root__get_root()
        if (root != null) root.hide(!logic)
    }

    rows(): number | STNull { if (GObject.isValid(this._def.rows)) return GObject.toNumber(this._def.rows); else return null }
    selection_count(): number { if (GObject.isValid(this._def.heading_rows)) return GObject.toNumber(this._def.heading_rows); else return 0 } //For GGrid
    show_hide_children(): boolean {
        if (GObject.isValid(this._def.show_hide_children)) return GObject.isTrue(this._def.show_hide_children); else return false
    }
    show_hide_children__toggle(): void {
        this.gadget.hide(!this.gadget.is_hidden())
    }
    show_hide_children__all(logic: boolean) {
        this._show_hide_children__all(logic)
        if (this.embedded()) {
            this.gadget.reset_react_children_elements()
            Gadgets.inst().get_root_gadget().forceUpdate()
        } else {
            //this.forceUpdate()
        }
    }
    _show_hide_children__all(logic: boolean) {
        if (this.gadget._parent) {
            if (this.gadget._parent.def.show_hide_children()) {
                this.gadget.hide(!logic)
            }
        }
        if (this.gadget._children != null) for (let i = 0; i < this.gadget._children.length; i++) {
            this.gadget._children[i].def._show_hide_children__all(logic)
        }
    }
    tag(): string | STNull { return this._def.tag ?? null }
    script(): any { return this._def.script ?? null }
    script_change(): any { return this._def.script_change ?? null }
    script_access(): string | null { return this._def.script_access ?? null }
    style(): string | null { return this._def.style ?? null }
    style_outer(): string | null { return this._def.style_outer ?? null }
    table(): string | null { return this._def.table ?? null }
    tab(): number | STNull { return GObject.toNumber(this._def.tab) ?? null }
    tabulate_size(): number | STNull { if (GObject.isValid(this._def.tabulate_size)) return GObject.toNumber(this._def.tabulate_size); else return null }
    text(): string | STNull {
        if (GObject.isValid(this._def.text)) {
            SEvaluate.Str(this._def.text)
        } else {
            return null
        }
    }
    type(): string | null { return this._def.type ?? null }

    top(): string | null { return this._def.top ?? null }
    left(): string | null { return this._def.left ?? null }
    width(): string | null { return this._def.width ?? null }
    height(): string | null { return this._def.height ?? null }
    width_pro(): string | null { return this._def.width_pro ?? null }
    height_pro(): string | null { return this._def.height_pro ?? null }
        
    //*****************************************************
    field0(): string | null { 
        const result=this.field_ind(0)?.field ?? null
        return result
    }
    //*****************************************************
    fields(): STObjectAny | null {
        return this._def.fields ?? null
    }
    //*****************************************************
    field_ind(index:number): STObjectAny | null {
        if (Array.isArray(this._def.fields)) {
            if (index<this._def.fields.length) return this._def.fields[index] ?? null; else return null 
        } else {
            return null
        }
    }
    //*************************************************************************
    //This function will return an array of string pair object: value, caption
    //This will always return an array.
    public options() { return this._def.options ?? null }
    public options_arr(): Toptions[] | null {
        if (this._def.options) {
            const result:Toptions[]=[]
            let arrayLines:string[] | STNull
            if (Array.isArray(this._def.options)) {
                arrayLines=this._def.options
            } else {
                let options: string[] | STNull = null;
                options = this._def.options.split("\n")
                arrayLines=options
            }
            if (arrayLines) {
                for (const opt of arrayLines!) {
                    const i=opt.indexOf("=")
                    let value0=opt;
                    let caption0=opt;
                    if (i>=0) {
                        value0=opt.substring(0,i)
                        caption0=opt.substring(i+1,opt.length)
                    }
                    if (caption0.includes("[")) {
                        caption0=SEvaluate.Str(caption0)
                    } else {
                        caption0=this.gadget.gadgets().translate(caption0)
                    }
                    let item:Toptions={caption:caption0, value:value0}
                    result.push(item)
                }
            }
            return result
        } else {
            return null
        }
    }
    //-------------------------------------------
   //*****************************************************

    /*
    width_num():number|null {
        const w=this.width()
        if (w) {
            try {
                if (w.indexOf("%")<0) return Number(w)
            } catch (e) {
                return null
            }
        }
        return null
    }
    //*****************************************************
    height_num():number|null {
        const h=this.height()
        if (h) {
            try {
                
                if (h.indexOf("%")<0) return Number(h)
            } catch (e) {
                return null
            }
        }
        return null
    }
*/
    //*****************************************************
    //*****************************************************
    /*
    _getEquivalentSize(dim: any) {
        if (GString.hasOnlyNumericDigits(dim)) return dim + "px"
        return dim
    }
*/
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    /*
    public set_width(val:number):void {
        this._def.width=val
    }
    //*****************************************************
    public set_height(val:number):void {
        this._def.height=val
    }
    //*****************************************************
    */
}