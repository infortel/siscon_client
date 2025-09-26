import { STValue } from "../../../../general/STypes";
import { DGrid } from "./DGrid";
import { TGridData } from "./DGrid_data_base";

export class DGrid_field {
    //*************************************************************************
    _display_fields: string[] = []
    dgrid:DGrid
    constructor(dgrid:DGrid) {
        this.dgrid=dgrid;
    }

    //*************************************************************************
    public get_field(col:number):string {
        return this._display_fields[col]
    }
    //*************************************************************************
    public populate(data: TGridData): void {
        this._display_fields=[]
        if (data.length > 0) {
            for (let key in data[0]) {
                this._display_fields.push(key)
            }
        }
    }
    //*************************************************************************
    get_display_count(): number {
        return this._display_fields.length
    }
    //*************************************************************************
    set_fields(fields: string[]): void {
        this._display_fields = fields
    }
    //*************************************************************************
    clear() {
        this._display_fields=[]
    }
    //*************************************************************************
    public get_fieldname(field_any: string | number): string {
        if (typeof field_any === "number") {
            return this._display_fields[field_any];
        }
        return String(field_any);
    }
    //*************************************************************************
}