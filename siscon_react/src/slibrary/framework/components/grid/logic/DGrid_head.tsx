import Program_Base from "../../../../../application/common/entry/Program_Base"
import { KeyManagement } from "../../../../general/KeyManagement"
import { STValue } from "../../../../general/STypes"
import Gadget from "../../../gadget/Gadget"
import { DGrid } from "./DGrid"
import { DGrid_data_base, TGridRowData } from "./DGrid_data_base"

export default class DGrid_head extends DGrid_data_base {
//*************************************************************************
    //*************************************************************************
    constructor(dgrid:DGrid) {
        super(dgrid)
    }

    //*************************************************************************
    /*
    public set_body_data(data: TGridData, populate_fields:boolean) {
        if (data.length > 0) {
            this.data = data
            if (populate_fields) {
                this.dgrid.field().populate(data)
            }
        }
        this._dgrid.gadget().activate_rendering()
    }
        */
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    // Cell operations.
    //*************************************************************************
    /*
    private _getField(field_any: string | number): string {
        if (typeof field_any === "number") {
            return this.dgrid._display_fields[field_any];
        }
        return String(field_any);
    }
        */
    //*************************************************************************
    //*************************************************************************
}