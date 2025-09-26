
import Gadgets from "../gadgets/Gadgets";
import Log from "../../general/Log";
import GPopup_Windows from "./GPopup_Windows";
import Commands from "../general/Commands";
import { STElement, STFunction, STFunction0, STNull, STObjectAny } from "../../general/STypes";
import SMetrics from "../../general/SMetrics";

type Popup_Window_Create_Callback=(result:boolean)=>void

export default class GPopup_Window {
    //*****************************************************
    page_name: string
    gadgets!: Gadgets
    title: string
    root_element: STElement | STNull
    _is_modal:boolean=true
    _opened_count:number=0
    //private _on_close: (() => void) | null = null
    private _on_close: STFunction0 | null=null
    //*****************************************************
    constructor(title: string, page_name: string, command_instance: Commands|STNull, is_modal:boolean, callback_opened: Popup_Window_Create_Callback) {
        this.title = title
        this.page_name = page_name
        this._is_modal = is_modal
        this._create(command_instance, callback_opened)
    }
    //*****************************************************
    _create(command_instance: Commands|STNull, callback_opened: Popup_Window_Create_Callback): void {
        try {
            this.gadgets = new Gadgets(false, this.page_name, {}, null, (success) => {
                if (success) {
                    if (command_instance) this.gadgets.set_command_instance(command_instance)
                    this._create_return(callback_opened)
                    this.gadgets.root_gadget.activate_rendering()
                } else {
                    if (callback_opened) callback_opened(false)
                }
            })
        } catch (e) {
            Log.logExc("Com_Designer.read", e)
            if (callback_opened) callback_opened(false)
        }
    }
    //-------------------------
    _create_return(callback: Popup_Window_Create_Callback): void {
        if (callback) callback(true)
    }
    //*****************************************************
    public increment_opened_count() {
        this._opened_count++
    }
    //*****************************************************
    public move_to_zone(when_opened_always:boolean, horizontal:number, vertical:number) {
        if (when_opened_always || this._opened_count==0) {
            this.gadgets.root_gadget.execute_on_mounted(() => { this._move_to_area(horizontal,vertical) })
        }
    }
    //*****************************************************
    private _move_to_area(horizontal:number, vertical:number) {
        let screen_width=SMetrics.inst().get_global_width()
        let screen_height=SMetrics.inst().get_global_height()
        let popup_width=this.gadgets.root_gadget.metrics.get_mounted_width();
        let popup_height=this.gadgets.root_gadget.metrics.get_mounted_height();

        let x=0
        if (horizontal<0) x=0;
        else if (horizontal>0) x=screen_width-popup_width;
        else x = (screen_width - popup_width) / 2;

        let y=0
        if (vertical<0) y=0;
        else if (vertical>0) y=screen_height-popup_height;
        else y = (screen_height - popup_height) / 2;

        if (x<0) x=0;
        if (y<0) y=0;
        
        const x0=this.gadgets.root_gadget.metrics.get_mounted_left()
        const y0=this.gadgets.root_gadget.metrics.get_mounted_top()
        const count=20
        this._move_to_area_gradual(count,x,y,(x-x0)/20,(y-y0)/20)
    }
    //-------------------------------------------------------
    //Gradual move to new location
    private _move_to_area_gradual(count:number, x:number, y:number, incX:number, incY:number) {
        const x0=this.gadgets.root_gadget.metrics.get_mounted_left()
        const y0=this.gadgets.root_gadget.metrics.get_mounted_top()
        let cont=false
        let x1=x0+incX
        let y1=y0+incY

        let finishCount=0
        if (incX>0) {
            if (x1>=x) {
                x1=x
                finishCount++
            }
        } else {
            if (x1<x) {
                x1=x
                finishCount++
            }
        }
        if (incY>0) {
            if (y1>=y) {
                y1=y
                finishCount++
            }
        } else {
            if (y1<=y) {
                y1=y
                finishCount++
            }
        }

        this.gadgets.root_gadget.metrics.set_left(x1);
        this.gadgets.root_gadget.metrics.set_top(y1);
        this.gadgets.root_gadget.activate_rendering();

        if (finishCount<2 && count>=0) {
            setTimeout(()=>{
                this._move_to_area_gradual(count-1,x,y,incX,incY)
            },10)
        }

    }
    //*****************************************************
    get_opened_count() {
        return this._opened_count
    }
    //*****************************************************
    forceUpdate(): void {
        this.gadgets.root_gadget.forceUpdate()
    }
    //*****************************************************
    close(): void {
        if (this._on_close) this._on_close()
        GPopup_Windows.remove_active_window_from_array(this)
        Gadgets.inst().root_gadget.forceUpdate()
    }
    //*****************************************************
    get_rendering_elements(): STElement {
        if (!this.root_element) this.root_element = this.gadgets.root_gadget.get_render_elements()

        return <div key={this.gadgets.root_gadget.get_key()+"-root_dlg"}>{this.root_element as any}</div>

        /*
        if (this._is_modal) {
            return <div key={this.framework.root_gadget.get_key()+"-root_dlg"}>{this.root_element as any}</div>
        } else {
            return this.root_element
        }
            */
    }
    //*****************************************************
    public set_on_close(on_close: () => void) {
        this._on_close = on_close;
    }
    //*****************************************************
    public is_modal():boolean {
        return this._is_modal;
    }
    //*****************************************************
}