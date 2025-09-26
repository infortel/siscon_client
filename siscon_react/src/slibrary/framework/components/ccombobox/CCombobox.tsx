import CComponent from "../../components_base/CComponent";
import GDefinitions from "../../gadget/GDefinitions";
import GObject from "../../../general/GObject";
import * as React from "react";
import { STElement, STObjectAny } from "../../../general/STypes";
import SEvaluate from "../../../sevaluations/SEvaluate";
import Gadget_constants from "../../gadget/Gadget_constants";
import { renderToString } from 'react-dom/server';

export default class CCombobox extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }

    private _eventClick = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        //this.event.command(event)
        this.event.ctrl_area_click(event)
    }

    //*****************************************************
    private _eventChange = (event: STObjectAny) => {
        this.event.ctrl_change(event)
        this.event.ctrl_command(event)
    }
    //*****************************************************
    private _getListRender(isCombobox:boolean): STElement {

        let eleCaptions: STElement[] = []
        for (const item of this.gadget.dlist()!.get_options()) {
            const key = this.key(["option",item.value])
            eleCaptions.push(<option value={item.value} key={key}>{item.caption}</option>)
        }

        let size=0
        if (this.gadget.isGListbox()) size = this.gadget.def.rows() ?? 0;

        let value=this.gadget.get_value()
        if (GObject.isInvalid(value)) value=""

        let style = { ...this.get_style(), ...this.get_style_size() }
        if (this.gadget.def.readonly()) style={ ...style, ...Gadget_constants.READONLY_STYLE}
        
        let classname = ""
        if (isCombobox) classname = "GCombobox"; else classname="GListbox"
        classname = this.gadget.def.class_name_add_concat(classname)

        let result: STElement = (
            <div onClick={this.event.ctrl_area_click}
                style={this.get_style_outer()}
                key={this.key(["div1"])}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
           >
                <table style={GDefinitions.TABLE_COMPACT_STYLE}
                    key={this.key(["table1"])}
                    ref={this.ref_inner}
                >
                    <tbody>
                <tr><td>
                            <label className="GCombobox-caption">{this.gadget.def.caption()}</label>
                </td></tr>

                <tr><td>
                    <select
                                className={classname}
                                onClick={(event: STObjectAny) => { this._eventChange(event) }}
                                key={this.key([])}
                                onChange={(event: any) => { this._eventChange(event) }}
                                disabled={this.get_readonly_render()}
                                value={value}
                                size={size}
                                style={style}
                            >

                        {eleCaptions}
                    </select>
                </td></tr>
                </tbody>
                </table>
            </div>
        )
        return result
    }


    render():any {
        const result:STElement=this._getListRender(true)
        this.render_report(result)
        return (result)
    }

}