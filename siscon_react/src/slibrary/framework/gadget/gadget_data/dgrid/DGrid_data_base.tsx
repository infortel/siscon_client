import { STObjectAny, STValue } from "../../../../general/STypes"
import { DGrid } from "./DGrid"

export type TGridData = STObjectAny

export class DGrid_data_base {
    //*************************************************************************
    public data: TGridData = [] //[row][col]
    public dgrid!: DGrid
    //*************************************************************************
    constructor (dgrid:DGrid) {
        this.dgrid=dgrid
    }
    //*************************************************************************
    get_row_count():number {
        return this.data.length
    }
    //*************************************************************************
    public get_row_data(row_number:number):STObjectAny|null {
        if (row_number<this.data.length) {
            return this.data[row_number]
        } else {
            return null
        }
    }
    //*************************************************************************
    public set_all_rows(data: TGridData, populate_fields:boolean, assign_head_fields:boolean) {
        this.data = data
        if (populate_fields) this.dgrid.field().populate(data)
        if (assign_head_fields) {
            for (let key in data[0]) {
                let name=key.toLowerCase()
                name=name.charAt(0).toUpperCase() + name.slice(1)
                this.dgrid.head().set(0,key,name)
            }
        }
        this.dgrid.display().clear_sort_feature(false)
        this.dgrid.gadget().forceUpdate()
    }
    //*************************************************************************
    public set(row:number, field_any:any, value:STValue) {
        let rowsAdded:number=0
        while (row>=this.data.length) {
            this.data.push({})
            rowsAdded++
        }
        this.data[row][this.dgrid.field().get_fieldname(field_any)] = value
        if (rowsAdded) this.dgrid.gadget().forceUpdate()
    }
    //*************************************************************************
    public get(row: number, field_any:any): STValue {
        let result = null
        try {
            result = this.data[row][this.dgrid.field().get_fieldname(field_any)]
        } catch (e) {
            //Do nothing
        }
        return result
    }
    //*************************************************************************
}