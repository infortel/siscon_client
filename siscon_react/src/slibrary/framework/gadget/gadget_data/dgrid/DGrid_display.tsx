import Log from "../../../../general/Log"
import { STNull } from "../../../../general/STypes"
import { DGrid } from "./DGrid"

export class DGrid_display {
    private dgrid:DGrid
    constructor(dgrid:DGrid) {
        this.dgrid=dgrid
    }
    //*************************************************************************
    private _display_row_index:number[]|null=null //Gives the display position given the index of the core row number.
    private _display_sort_direction:number=0
    private _display_col_sort=-1

    private _general_filter_display:string|null=null

    private _col_filters:(string|null)[]=[]
    //*************************************************************************
    public get_core_row(core_row:number) {
        if (this._display_row_index==null) return core_row

        if (core_row<this._display_row_index.length) return this._display_row_index[core_row]
        else return core_row
    }
    //*************************************************************************
    public sort(column:number, direction:number) {
        this._display_col_sort=column
        const fieldname=this.dgrid.field().get_field(column)
        this._display_sort_direction=direction
        this._display_row_index=[]

        for (let i=0; i<this.dgrid.body().data.length; i++) {
            this._display_row_index.push(i)
        }

        //Sort
        this._display_row_index.sort((a, b) => {
            let res=0
            const aa=this.dgrid.body().get(a,fieldname)
            const bb=this.dgrid.body().get(b,fieldname)
            if (aa===null && bb===null) {
                res=-1
            } else if (aa===null) {
                res=+1
            } else {
                //ascending is -1 (a<b), descending is +1 (a>b)
                res=aa.localeCompare(bb, "en", { sensitivity: 'base' })
            }
            res=res*this._display_sort_direction
            return res
        })

        this.dgrid.gadget().forceUpdate()
    }
    //*************************************************************************
    public clear_sort_feature(update_window:boolean) {
        const previous_row_index=this._display_row_index
        this._display_row_index=null
        this._display_sort_direction=0;
        this._display_col_sort=-1
        this._col_filters=[]
        if (update_window && previous_row_index!==this._display_row_index) this.dgrid.gadget().forceUpdate()
    }
    //*************************************************************************
    public get_sort_col():number {
        return this._display_col_sort
    }
    //*************************************************************************
    public get_sort_direction():number {
        return this._display_sort_direction
    }
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    public set_col_filter(col:number, value:string|null) {
        while (col>=this._col_filters.length) this._col_filters.push(null)
        this._col_filters[col]=value as string
    }
    //*************************************************************************
    public get_col_filter(col:number):string|null {
        if (col>=this._col_filters.length) return null
        else return this._col_filters[col]
    }
    //*************************************************************************
    public set_general_filter_display(value:string|null) {
        this._general_filter_display=value
    }
    //*************************************************************************
    public get_general_filter_display():string|null {
        return this._general_filter_display
    }
    //*************************************************************************
    public is_filter_active(col:number): boolean {
        if (col>=this._col_filters.length) return false
        return (this._col_filters[col]!==null && this._col_filters[col]!.length>0)
    }
    //*************************************************************************
    public display_this_row(row:number):boolean {
        let unmatches:number=0; 

        let firstCol=-1;
        for (let c=0; c<this._col_filters.length; c++) {
            if (this.is_filter_active(c)) {
                firstCol=c;
                break;
            }
        }

        if (firstCol<0) return true

        let ok=this._display_this_row_ok(row,firstCol)
        if (ok) {
            for (let c=firstCol+1; c<this._col_filters.length; c++) {
                if (this.is_filter_active(c)) {
                    if (!this._display_this_row_ok(row,c)) {
                        ok=false
                        break
                    }
                }
            }
        }

        return ok
    }
    //-------------------------------------------------------
    private _display_this_row_ok(row:number, col:number):boolean {
        const data:string=this.dgrid.body().get(row,col)
        const pattern:string=this._col_filters[col] as string
        if (data.toLowerCase().includes(pattern.toLowerCase(),0)) {
            return true
        } else {
            return false
        }
    }
    //*************************************************************************
    public get_filter_position(pattern:string, data:string):number {
        return data.toLowerCase().indexOf(pattern.toLowerCase())
    }
    //*************************************************************************
}