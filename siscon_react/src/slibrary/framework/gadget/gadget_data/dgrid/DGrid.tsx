import { STObjectAny, STValue } from "../../../../general/STypes"
import Gadget from "../../Gadget"
import { DGrid_body } from "./DGrid_body"
import { TGridData } from "./DGrid_data_base"
import { DGrid_display } from "./DGrid_display"
import { DGrid_field } from "./DGrid_field"
import DGrid_head from "./DGrid_head"


export class DGrid {
//*************************************************************************
    private static SELECTION_COUNT_NO_SELECTABLE=0
    private static SELECTION_COUNT_SINGLE_SELECTION=1
    private static SELECTION_COUNT_MULTI_SELECTION=-1 
//*************************************************************************
    _gadget:Gadget
    _row_style: string[] = []
    _row_style_definitions: { [key: string]: any } = {} //We can define style names to be used on rows.
    private _head:DGrid_head
    private _body:DGrid_body
    private _field:DGrid_field
   private _display:DGrid_display
    //*************************************************************************
    constructor(gadget:Gadget) {
        this._gadget = gadget
        this._head = new DGrid_head(this)
        this._body = new DGrid_body(this)
        this._field = new DGrid_field(this)
        this._display = new DGrid_display(this)
    }
    //*************************************************************************
    public gadget():Gadget {
        return this._gadget
    }
    //*************************************************************************
    public head():DGrid_head {
        return this._head
    }
    //*************************************************************************
    public body():DGrid_body {
        return this._body
    }
    //*************************************************************************
    public field():DGrid_field {
        return this._field
    }
    //*************************************************************************
    public display():DGrid_display {
        return this._display
    }
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    // Row operations
    //*************************************************************************
    public add_row_style_difinition(name:string, style:Object) {
        this._row_style_definitions[name]=style
        //this._row_style_definitions={ ...this._row_style_definitions, style }
    }
    //*************************************************************************
    public set_row_style_name(row:number, name:string) {
        this._row_style[row] = name
    }
    //*************************************************************************
    public get_row_style(row:number):Object {
        let result:any={}

        if (row<this._row_style.length) {
            const name=this._row_style[row]
            const style:any=this._row_style_definitions[name]
            result=style || {}
        } else {
            result={background: "white"}
        }

        if  (this.body().is_row_selected(row)) {
            let background=result.background
            let color=result.color
            if (background===undefined) background="#ffffff"
            if (color===undefined) color="#666666"
            result={background: color, color: background}
        }
        return result
    }
    //*************************************************************************
}