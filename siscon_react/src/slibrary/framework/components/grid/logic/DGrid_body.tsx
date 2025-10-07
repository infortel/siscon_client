import { STValue } from "../../../../general/STypes"
import { DGrid } from "./DGrid"
import { DGrid_data_base } from "./DGrid_data_base"

export class DGrid_body extends DGrid_data_base {
    //*************************************************************************
    private static SELECTION_COUNT_NO_SELECTABLE=0
    private static SELECTION_COUNT_SINGLE_SELECTION=1
    private static SELECTION_COUNT_MULTI_SELECTION=-1 
    _selected: number[] = []
    _selection_count:number=0
    //*************************************************************************
    constructor(dgrid:DGrid) {
        super(dgrid)
        this._selection_count = this.dgrid.gadget().def.selection_count()
        this.adjust_row_count()
    }
    //*************************************************************************
    public on_clicked(row:number, col:number) {
        if (this.dgrid.gadget().get_on_selected()) this.dgrid.gadget().get_on_selected()!()
    }
    //*************************************************************************
    set_selection_count(count: number) {
        this._selection_count=count
    }
    //*************************************************************************
    public get_next_free_row(): number {
        return this.get_row_count()
    }
    //*************************************************************************
    clear(clear_fields:boolean) {
        this.data = []
        if (clear_fields) this.dgrid.field().clear()
        this.dgrid.gadget().activate_rendering()
    }
    //*************************************************************************
    clear_selection() {
        if (this._selected.length > 0) {
            this._selected = []
            this.dgrid.gadget().activate_rendering()
        }
    }
    //*************************************************************************
    roll_selection(direction:number) {
        if (this._selection_count == DGrid_body.SELECTION_COUNT_SINGLE_SELECTION && this.get_row_count()>0) {
            if (this._selected.length==0) {
                // Select the first row
                this._selected.push(0)
            } else {
                // Move selection
                const currentIndex = this._selected[0]
                const newIndex = (currentIndex + direction+this.get_row_count()) % this.get_row_count()
                this._selected[0] = newIndex
            }
        }
        this.dgrid.gadget().activate_rendering()
    }
    //*************************************************************************
    set_selected(logic: boolean, row: number): void {
        if (row<this.data.length && row>=0) {
            if (this._selection_count == DGrid_body.SELECTION_COUNT_SINGLE_SELECTION) {
                this._selected = []
                if (logic) this._selected.push(row);
            } else if (this._selection_count == DGrid_body.SELECTION_COUNT_MULTI_SELECTION) {
                let index=-1;
                for (let i = 0; i < this._selected.length; i++) {
                    if (this._selected[i] === row) {
                        index = i;
                        break;
                    }
                }
                if (logic) {
                    if (index<0) {
                        this._selected.push(row);
                    }
                } else {
                    if (index>=0) {
                        this._selected.splice(index, 1);
                    }
                }
            }

            this.dgrid.gadget().activate_rendering()
        }
    }
    //*************************************************************************
    is_row_selected(row: number):boolean {
        for (let i = 0; i < this._selected.length; i++) {
            if (this._selected[i]===row) return true
        }
        return false
    }
    //*************************************************************************
    get_first_selected_row():number {
        if (this._selected.length==0) return -1
        return this._selected[0]
    }
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    //*************************************************************************
    public getString(row: number, field_any:any): STValue {
        let result=this.get(row,field_any)
        if (result===null || result===undefined) return ""
        //if (typeof result==="string") return result
        return String(result)
    }
    //*************************************************************************
    public adjust_row_count() {
        if (this.dgrid.gadget().def.readonly()) return

        //This is an editable grid. Adjust rows.
        let last=this.get_row_count()-1
        if (last<0) {
            //Add an empty row
            this.set_row_count(1);
            return
        }
        
        if (this.is_row_empty(last)) {
            //Last row is empty. Remove all empty rows at the end, except one
            let c=0
            while (last>=1 && this.is_row_empty(last-1)) {
                last--;
                c++;
            }
            if (c) this.set_row_count(last+1);
            return
        } else {
            //Last row is not empty. Add an empty row
            this.set_row_count(last+2);
            return
        }
    }
    //*************************************************************************
}
