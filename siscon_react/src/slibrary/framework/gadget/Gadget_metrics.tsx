import { STNull, STObjectAny } from "../../general/STypes"
import Gadget from "./Gadget"

export default class Gadget_event {
    //******************************************************************
    gadget: Gadget
    public _left: number|null = null
    public _top: number|null =  null
    public _width: number|null =  null
    public _height: number|null =  null
    //******************************************************************
    constructor(gadget: Gadget) {
        this.gadget = gadget
    }
    //******************************************************************
    //*****************************************************
    set_left(x: number|null) {
        this._left = x
    }
    //*****************************************************
    set_top(y: number|null) {
        this._top = y
    }
    //*****************************************************
    set_width(width: number|null) {
        this._width = width
    }
    //*****************************************************
    set_height(height: number|null) {
        this._height = height
    }
    //*****************************************************
    get_left(): number|null {
        return this._left
     }

    //*****************************************************
    get_top(): number|null {
        return this._top
    }
    //*****************************************************
    get_width(): number|null {
        return this._width
    }

    //*****************************************************
    get_height(): number|null {
        return this._height
    }
    //*****************************************************
    get_left_or_mounted(): number {
        if (this._left) return this._left
        return this.get_mounted_left()
    }

    //*****************************************************
    get_top_or_mounted(): number {
        if (this._top) return this._top
        return this.get_mounted_top()
    }
    //*****************************************************
    get_width_or_mounted(): number {
        if (this._width) return this._width
        return this.get_mounted_width()
    }

    //*****************************************************
    get_height_or_mounted(): number {
        if (this._height) return this._height
        return this.get_mounted_height()
    }
    //******************************************************
    private get_outer_ref(): STObjectAny | STNull {
        if (this.gadget._component) if (this.gadget._component.ref_outer) if (this.gadget._component.ref_outer.current) {
            return this.gadget._component.ref_outer.current
        }
        return null
    }
    //******************************************************
    private get_inner_ref(): STObjectAny | STNull {
        if (this.gadget._component) if (this.gadget._component.ref_inner) if (this.gadget._component.ref_inner.current) {
            return this.gadget._component.ref_inner.current
        }
        return null
    }
    //******************************************************
    get_mounted_width(): number {
        let r = 0
        if (this.get_outer_ref()) r = this.get_outer_ref()!.clientWidth
        if (r == 0) if (this.get_inner_ref()) r = this.get_inner_ref()!.clientWidth
        return r
    }
    //******************************************************
    get_mounted_height(): number {
        let r = 0
        if (this.get_outer_ref()) r = this.get_outer_ref()!.clientHeight
        if (r == 0) if (this.get_inner_ref()) r = this.get_inner_ref()!.clientHeight
        return r
    }
    //******************************************************
    get_mounted_left(): number {
        let r = 0
        if (this.get_outer_ref()) r = this.get_outer_ref()!.offsetLeft
        if (r == 0) if (this.get_inner_ref()) r = this.get_inner_ref()!.offsetLeft
        return r
    }
    //******************************************************
    get_mounted_top(): number {
        let r = 0
        if (this.get_outer_ref()) r = this.get_outer_ref()!.offsetTop
        if (r == 0) if (this.get_inner_ref()) r = this.get_inner_ref()!.offsetTop
        return r
    }
    //******************************************************
    console_log_metrics(caption:string) {
        console.log(caption+" = "
            + "  xo=" + this.get_outer_ref()!.offsetLeft
            + "  wo=" + this.get_outer_ref()!.clientWidth
            + "  xi=" + this.get_inner_ref()!.offsetLeft
            + "  wi=" + this.get_inner_ref()!.clientWidth
        )

    }
    //******************************************************    
}