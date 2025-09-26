import { STNull, STObjectAny } from "../../general/STypes"
import CWidget from "../components/cwidget/CWidget"
import CWidgetpanel from "../components/cwidgetpanel/CWidgetpanel"
import GDefinitions from "./GDefinitions"
import Gadget from "./Gadget"


export type TMode = {
    px:number,
    width:number,
    py:number,
    height:number
}

export default class Gadget_drag {
    public static BORDER_THICKNESS=6;

    public static MODE_NW=       {px:1, width:-1, py:1, height:-1, border:"nw", cursor:"nw-resize"}
    public static MODE_N=        {px:0, width:0, py:1, height:-1, border:"n", cursor:"n-resize"}
    public static MODE_NE=       {px:1, width:1, py:1, height:-1, border:"ne", cursor:"ne-resize"}
    public static MODE_W=        {px:1, width:-1, py:0, height:0, border:"w", cursor:"w-resize"}
    public static MODE_CENTER=   {px:1, width:0, py:1, height:0, border:"c", cursor:"move"}
    public static MODE_E=        {px:0, width:1, py:0, height:0, border:"e", cursor:"e-resize"}
    public static MODE_SW=       {px:1, width:-1, py:1, height:1, border:"sw", cursor:"sw-resize"}
    public static MODE_S=        {px:0, width:0, py:0, height:1, border:"s", cursor:"s-resize"}
    public static MODE_SE=       {px:0, width:1, py:0, height:1, border:"se", cursor:"se-resize"}
    public static MODE_INACTIVE= {px:0, width:0, py:0, height:0, border:"", cursor:"default"}

    static style_dragging = {
        position: "absolute"
    }
    //******************************************************************
    private static _dragging_gadget: Gadget | STNull = null
    private static _mode:TMode=this.MODE_INACTIVE
    private static _moving_count=0
    private static _last_x: number       //current position
    private static _last_y: number
    private static _initial_offset_x: number=0
    private static _initial_offset_y: number=0

    //******************************************************************
    //constructor(gadget: Gadget) {
    //    this.gadget = gadget
    //}

    //******************************************************************
    public static start_drag(gadget:Gadget, dragging_mode:TMode) {
        if (dragging_mode!==this.MODE_INACTIVE && this._dragging_gadget===null) {
            this._dragging_gadget = gadget
            this._mode=dragging_mode
            this._moving_count = 0
        }
     }
    //******************************************************************
    public static event_global_mouse_move(x:number, y:number):void {
        if (this._dragging_gadget != null) {

            const metrics=this._dragging_gadget.metrics
            if (this._moving_count == 0) {
                this._last_x=x
                this._last_y=y

                this._initial_offset_x=x-metrics.get_left_or_mounted()
                this._initial_offset_y=y-metrics.get_top_or_mounted()
            } else {

                const dx=x-this._last_x
                const dy=y-this._last_y

                if (dx!=0 || dy!=0) {
                    const adjX=dx*this._mode.px
                    const adjY=dy*this._mode.py
                    const adjW=dx*this._mode.width
                    const adjH=dy*this._mode.height

                    let render=false
                    if (adjX!=0) {
                        metrics.set_left(x+adjX-this._initial_offset_x)
                        render=true;
                    }
                    if (adjY!=0) {
                        metrics.set_top(y+adjY-this._initial_offset_y)
                        render=true;
                    }

                    const child_adj={width:0, height:0}
                    if (adjW!=0 || adjH!=0) this._adjust_children(this._dragging_gadget, adjW,adjH,child_adj)
                    
                    //change size if no child extended or object has width defined.
                    if (adjW!=0 && (child_adj.width==0 || this._dragging_gadget.def.width())) {
                        metrics.set_width(metrics.get_width_or_mounted()+adjW)
                        render=true
                    }
                    if (adjH!=0 && (child_adj.height==0 || this._dragging_gadget.def.height())) {
                        metrics.set_height(metrics.get_height_or_mounted()+adjH)
                        render=true
                    }
                    if (render) this._dragging_gadget.activate_rendering()

                }
            }
            this._last_x=x
            this._last_y=y

            this._moving_count++
        }
    }
    //------------------------------------------------------------------
    private static _adjust_children(parent:Gadget, adjW:number,adjH:number, child_adj:STObjectAny) {
        for (const gadget of parent.get_children()) {
            let render=false
            if (gadget.is_hidden()) {}
            if (adjW!=0 && gadget.def.expand_width()) {
                gadget.metrics.set_width(gadget.metrics.get_width_or_mounted()+adjW)
                render=true
                child_adj.width++
            }
            if (adjH!=0 && gadget.def.expand_height()) {
                gadget.metrics.set_height(gadget.metrics.get_height_or_mounted()+adjH)
                render=true
                child_adj.height++
            }
            if (render) {
                gadget.activate_rendering()
            }
            this._adjust_children(gadget,adjW,adjH,child_adj)
        }
        return child_adj
    }
    //******************************************************************
    public static event_global_mouse_up():void {
        if (this._dragging_gadget != null) {
            this._dragging_gadget = null
        }
    }
    //******************************************************************
    public static get_potential_mode(event:STObjectAny, gadget:Gadget):TMode {
        let result=this.MODE_INACTIVE

        if (this._dragging_gadget!=null) return result

        if (gadget.gadgets().is_designing()) return result
        if (!gadget.def.allow_resize()) return result

        const px=(event.pageX-gadget.metrics.get_left_or_mounted())
        const py=(event.pageY-gadget.metrics.get_top_or_mounted())
        const width=gadget.metrics.get_mounted_width()+2*this.BORDER_THICKNESS
        const height=gadget.metrics.get_mounted_height()+2*this.BORDER_THICKNESS
        const w3=width/3
        const h3=height/3

        if (px<0 || px>width || py<0 || py>height) return result

        const allow=gadget.def.allow_resize()
        const center:boolean=allow!.includes("c")
        const north:boolean=allow!.includes("n")
        const south:boolean=allow!.includes("s")
        const east:boolean=allow!.includes("e")
        const west:boolean=allow!.includes("w")

        if (north && py<=this.BORDER_THICKNESS) {
            //Check upper path
            if (west && px<w3) result=this.MODE_NW
            else if (east && px>w3*2) result=this.MODE_NE
            else result=this.MODE_N
        } else if (south && py>=height-this.BORDER_THICKNESS) {
            //check lower path
            if (west && px<w3) result=this.MODE_SW
            else if (east && px>w3*2) result=this.MODE_SE
            else result=this.MODE_S
        } else if (west && px<this.BORDER_THICKNESS) {
            //check west path
            if (north && py<w3) result=this.MODE_NW
            else if (south && py>w3*2) result=this.MODE_SW
            else result=this.MODE_W           
        } else if (east && px>width-this.BORDER_THICKNESS) {
            //check east
            if (north && py<w3) result=this.MODE_NE
            else if (south && py>w3*2) result=this.MODE_SE
            else result=this.MODE_E           
        } else if (center) result=this.MODE_CENTER

        return result
    }
    //******************************************************************
}