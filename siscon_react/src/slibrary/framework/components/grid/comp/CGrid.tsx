import Gen from "../../../../general/Gen"
import { STElement, STObjectAny } from "../../../../general/STypes"
import CComponent from "../../../components_base/CComponent"
import * as React from "react";
import Log from "../../../../general/Log";
import GString from "../../../../general/GString";
import { renderToString } from 'react-dom/server';
import { useEffect } from 'react';
import Gadget_constants from "../../../gadget/Gadget_constants";
import { DGrid } from "../logic/DGrid";
/*
Style examples.
https://divtable.com/table-styler/
*/

    export default class CGrid extends CComponent {
//*************************************************************************
    private _dgrid:DGrid
    constructor(props: any) {
        super(props)
        this._dgrid=this.gadget.dgrid() as DGrid

        this.gadget.set_com(this)
    }
    //*************************************************************************
    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_area_click(event)
        this.event.ctrl_command(event)
    }
    //*************************************************************************
    private _on_body_cell_click = (row:number, col:number) => {
        this._dgrid.body().set_selected(true, row)
        this._dgrid.body().on_clicked(row,col)
    }
    //*************************************************************************
    private _edit_on_change(event:STObjectAny, row:number, col:number) {
        const value=event.target.value
        this._dgrid.body().set(row,col,value)
        this.gadget.render()
    }
    //*************************************************************************
    private _sortIconOnClick = (col:number) => {
        if (this._dgrid.display().get_sort_col()==col) {
            let dir=this._dgrid.display().get_sort_direction()
            if (dir==0) this._dgrid.display().sort(col,+1)
            else if (dir==1) this._dgrid.display().sort(col,-1)
            else this._dgrid.display().clear_sort_feature(true)
        } else {
            this._dgrid.display().sort(col,+1)
        }
        this.gadget.forceUpdate()
    }
    //*************************************************************************
    private _filterIconOnClick = (col:number) => {
        let filter=this._dgrid.display().get_col_filter(col)
        if (filter==null) filter=""; else filter=null
        this._dgrid.display().set_col_filter(col,filter);
        this.gadget.forceUpdate()
    }
    //*************************************************************************
    private _filterEditOnChange=(event:STObjectAny, col:number) => {
        const value=event.target.value
        this.setState({text:value})
        this._dgrid.display().set_col_filter(col,value)
    }
    //*************************************************************************
    _get_title_elements():STElement[] {
        const cols: STElement[] = []
        const sort_dir:number=this._dgrid?.display().get_sort_direction() as number
        const sort_col:number=this._dgrid?.display().get_sort_col() as number
        for (let r = 0; r < this._dgrid.head().get_row_count(); r++) {
            for (let c = 0; c < this._dgrid.field().get_display_count(); c++) {
                let icons:STElement[]=[]

                if (r==0) {
                    //Add sort icon.
                    let name="sort_disabled.svg"
                    if (r==0 && sort_col==c && sort_dir!=0) {
                        if (sort_dir<0) name="sort_descending.svg"; else name="sort_ascending.svg"
                    }
                    name="images/gadgets/ggrid/"+name
                    icons.push(<label key={this.key(["sort",c,r])}>&nbsp;</label>)
                    icons.push(<img src={name} key={this.key(["sort"])} className="GGrid-icon"
                        onClick={(event)=> this._sortIconOnClick(c)}
                    />)

                    //Add filter icons.
                    icons.push(<label key={this.key(["fil0",c,r])}>&nbsp;</label>)
                    icons.push(<img src="/images/gadgets/ggrid/search.svg" key={this.key(["fil1",c,r])} className="GGrid-icon"
                                    onClick={(event) => this._filterIconOnClick(c)}
                    />)

                    //Add search entry data icon.
                    const filter=this._dgrid?.display().get_col_filter(c)
                    if (this._dgrid?.display().get_col_filter(c)!=null) {
                        //Add entry box.
                        icons.push(<input type="text" value={this._dgrid.display().get_col_filter(c) as string} key={this.key(["search",c,r])}
                            onChange={(event)=> this._filterEditOnChange(event,c)}
                            className="GGrid-filter"
                        />)
                    }
                }

                cols.push(
                    <th key={this.key(["title.row",c,r])}
                    >
                        {this._dgrid.head().get(r,c)}
                        {icons}
                    </th>
                )
            }
        }
        return cols
    }
    //*************************************************************************
    _get_body_columns(selected:boolean, row:number): STElement[] {
        const columns: STElement[] = []
        for (let c = 0; c < this._dgrid.field().get_display_count(); c++) {
            const body:STElement[]=[]

            let data:string=this._dgrid.body().getString(row,c)
            let filter:string|null=this._dgrid.display().get_col_filter(c)
            if (filter==null) filter=this._dgrid.display().get_general_filter_display()
        
            if (this._dgrid.body().is_editing_cell(row,c)) {
                columns.push(
                    <td key={this.key(["td",row,c])}
                        onClick={(event) => this._on_body_cell_click(row, c)}
                    >
                        <input key={this.key(["edit"])}
                            onChange={(event)=>this._edit_on_change(event,row,c)}
                            value={data}
                            className={this.gadget.def.class_name_add_concat("GEdit")}
                        />

                    </td>
                )
            } else if (c===0 && data.length===0) {
                columns.push(
                    <td key={this.key(["td",c,row])}
                        onClick={(event) => this._on_body_cell_click(row, c)}
                    >
                        &nbsp;
                    </td>
                )
            } else if (filter) {
                while (data.length>0) {
                    this.count_match++
                    const i=this._dgrid.display().get_filter_position(filter,data)
                    if (i>=0) {
                        body.push(<span key={this.key(["nor",i,c,row,this.count_match])}>{data.substring(0,i)}</span>)
                        body.push(<span key={this.key(["enh",i,c,row,this.count_match])} className="GGrid-filter-match">{data.substring(i,i+filter.length)}</span>)
                        data=data.substring(i+filter.length,data.length)
                    } else {
                        body.push(<span key={this.key(["nor",i,c,row,this.count_match])}>{data}</span>)
                        data=""
                    }
                }
                columns.push(
                    <td key={this.key(["td",c,row])}
                        onClick={(event) => this._on_body_cell_click(row, c)}
                    >
                        {body}
                    </td>
                )

            } else {
                columns.push(
                    <td key={this.key(["td",c,row])}
                        onClick={(event) => this._on_body_cell_click(row, c)}
                    >
                        {data}
                    </td>
                )
            }
            

        }
        return columns
    }
    //*************************************************************************
        private count_match=0
    _get_rows_element(): STElement[] {
        const rows: STElement[] = []
        try {
            this.count_match=0
            let title_lines = 1
            if (title_lines > 0) {
                rows.push(
                    <tr className={"GGrid-heading"} key={this.key(["head.row"])}>
                        {this._get_title_elements()}
                    </tr>
                )
            }


            for (let r0 = 0; r0 < this._dgrid.body().get_row_count(); r0++) {
                const r=this._dgrid.display().get_core_row(r0)
                const display=this._dgrid.display().display_this_row(r)
                if (display) {
                    const selected= (this._dgrid.body().is_row_selected(r))
                    const row_style = this._dgrid.get_row_style(r)
                    
                    rows.push(<tr className={"GGrid-body"} key={this.key(["data.row",r])}
                        style={row_style}
                    >
                        {this._get_body_columns(selected,r)}
                    </tr>
                )
                }
            }
        } catch (e) {
            Log.logExc("CGrid._get_rows_element()",e)
        }

        return rows
    }
    //*************************************************************************

    render() {

        const rows: STElement[] = []

        let outer_style = {...this.get_style_outer(), ...this.get_style_size()}

        let classname = this.gadget.def.class_name_add_concat("GGrid")

        let style=this.get_style()
        if (this.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}

        let result: STElement = (
            <div
                key={this.key([])}
                style={outer_style}
                onClick={this.eventClick0}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
            >
                <table
                    style={style}
                    className={classname}
                    key={this.key(["table"])}
             >
                <tbody key={this.key(["body"])}>
                    {this._get_rows_element()}
                </tbody>
                </table>
                </div>
                )

        this.render_report(result)        
        return result
    }
    //*************************************************************************

}