import * as React from "react";
import { STObjectAny, STElement } from "../../../general/STypes";
import CComponent from "../../components_base/CComponent";
import CCombobox from "../ccombobox/CCombobox";
import SEvaluate from "../../../sevaluations/SEvaluate";
import GObject from "../../../general/GObject";
import Gadget_constants from "../../gadget/Gadget_constants";
import GDefinitions from "../../gadget/GDefinitions";
import Gadget from "../../gadget/Gadget";
import Gadget_def from "../../gadget/Gadget_def";

export default class CListbox extends CComponent {
    //Reviewed Sep.24/2025
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this as CComponent)
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
        if (this.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}
        
        let classname = ""
        if (isCombobox) classname = "GCombobox"; else classname="GListbox"
        classname = this.gadget.def.class_name_add_concat(classname)

        let styleOuter={...this.get_style_outer(), ...this.get_style()}
        styleOuter=CComponent.add_style_flex(styleOuter,this.gadget.def.orientation() ?? Gadget_def.ORIENTATION.column)

        let result: STElement = (
            <div onClick={this.event.ctrl_area_click}
                style={styleOuter}
                key={this.key(["div1"])}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
           >
                <label className="GCombobox-caption">{this.gadget.def.caption()}</label>
                <select
                            className={classname}
                            onClick={(event: STObjectAny) => { this._eventClick(event) }}
                            key={this.key([])}
                            onChange={(event: any) => { this._eventChange(event) }}
                            disabled={this.get_readonly_render()}
                            value={value}
                            size={size}
                            style={style}
                            ref={this.ref_inner}
                        >

                    {eleCaptions}
                </select>
            </div>
        )
        return result
    }
    
    render(): STElement {
        const result: STElement = this._getListRender(false)
        this.render_report(result)
        return (result)
    }

}