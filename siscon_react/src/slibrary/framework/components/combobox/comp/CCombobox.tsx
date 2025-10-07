import CComponent from "../../../components_base/CComponent";
import GObject from "../../../../general/GObject";
import { STElement, STObjectAny } from "../../../../general/STypes";
import Gadget_constants from "../../../gadget/Gadget_constants";
import Gadget_def from "../../../gadget/Gadget_def";

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
        if (this.gadget.get_options()) {
            let count=0
            for (const item of this.gadget.get_options()!) {
                eleCaptions.push(<option value={item.value} key={this.key(["option",count])}>{item.caption}</option>)
                count++
            }
        }

        let size=0
        if (this.gadget.isListbox()) size = this.gadget.def.rows() ?? 0;

        let value=this.gadget.get_value()
        if (GObject.isInvalid(value)) value=""
        
        let styleOuter={...this.get_style_outer(), ...this.get_style()}
        styleOuter=CComponent.add_style_flex(styleOuter,this.gadget.def.orientation() ?? Gadget_def.ORIENTATION.column)

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
                <label className="GCombobox-caption" key={this.key(["label"])}>{this.gadget.def.caption()}</label>
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