import { STGadget_event, STNull, STObjectAny } from "../../general/STypes"
import { Embedded } from "../general/Embedded"
import Gadget from "./Gadget"
import Gadget_drag from "./Gadget_drag"

export default class Gadget_event {
    //******************************************************************
    gadget:Gadget
    public _onclick!: STGadget_event
    public _onchange!: STGadget_event
    public _on_dynamic_change!: (gadget:Gadget, value:string|STNull)=>void
    public _area_onclick!: STGadget_event
    public keydown_from_ctrl!: STGadget_event
    public _last_click_count: number = 0
    public _last_area_click_count: number = 0
    //******************************************************************
    constructor(gadget: Gadget) {
        this.gadget=gadget
    }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    click(event: STObjectAny | STNull): void {

        //Close embedded and show/hide items.
        if (this.gadget.def.embedded()) {
            Embedded.activate((!Embedded.isActive(this.gadget)), this.gadget)
        } else {
            //if type show/hide proceed.
            if (this.gadget.def.show_hide_children()) {
                let logic = false
                if (this.gadget._children) for (let i = 0; i < this.gadget._children.length; i++) {
                    const child = this.gadget._children[i]
                    if (i == 0) logic = (!child.is_hidden())
                    child.hide(logic)
                }
                const child = this.gadget.get_first_child()
            }
        }

        if (this._onclick) this._onclick(event, this.gadget)
    }
    //******************************************************************
    change(event: STObjectAny | STNull): void {
        if (this._onchange) this._onchange(event, this.gadget)
    }
    //******************************************************************
    dynamic_change(value: string | STNull): void {
        if (this._on_dynamic_change) this._on_dynamic_change(this.gadget, value)
    }
    //******************************************************************
    areaclick(event: STObjectAny | STNull): void {
        this._last_area_click_count = ((event as STObjectAny).click_count as number);
        if (this._area_onclick) this._area_onclick(event, this.gadget)
    }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    //******************************************************************
    mouseDown(event: MouseEvent): void {
    
        if (this.gadget.is_dragable()) {
            const mode=Gadget_drag.get_potential_mode(event,this.gadget)
            if (mode!==Gadget_drag.MODE_INACTIVE && mode!=Gadget_drag.MODE_CENTER) {
                Gadget_drag.start_drag(this.gadget,mode)
            }
        }
    }
    //******************************************************************
    mouseUp(event: MouseEvent): void {
        //Do nothing.
    }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    set_onclick(function_var: STGadget_event): void {
        this._onclick = function_var
    }
    //******************************************************************
    set_onchange(function_var: STGadget_event): void {
        this._onchange = function_var
    }
    //******************************************************************
    set_on_dynamic_change(function_var: (gadget:Gadget, value:string|STNull)=>void) {
        this._on_dynamic_change = function_var
    }
    //******************************************************************
    set_gadget_area_onclick(function_var: STGadget_event): void {
        this._area_onclick = function_var
    }
    //******************************************************************
    //******************************************************************
    //******************************************************************
    //******************************************************************
    get_last_click_count(): number {
        return this._last_click_count
    }
    //******************************************************************
    set_last_click_count(count: number): void {
        this._last_click_count = count
    }
    //******************************************************************
    get_last_area_click_count(): number {
        return this._last_area_click_count
    }
    //******************************************************************
    set_last_area_click_count(count: number): void {
        this._last_area_click_count = count
    }
    //******************************************************************
    set_onKeyDown(function_var: STGadget_event): void {
        this.keydown_from_ctrl = function_var
    }
    //******************************************************************

}