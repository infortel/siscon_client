import GString from "../../../general/GString"
import { STElement, STObjectAny } from "../../../general/STypes"
import CComponent from "../../components_base/CComponent"
import Gadget from "../../gadget/Gadget"
import Gadget_constants from "../../gadget/Gadget_constants"
import Gadget_def from "../../gadget/Gadget_def"

export class CEdit_CTextarea {
    _isGedit:boolean=false
    com:CComponent
    constructor(component:CComponent, isGedit:boolean) {
        this.com=component
        this._isGedit=isGedit
    }
   //*****************************************************
    _eventKeyDown = (event: STObjectAny) => {
        //## check this. */
        //if (this.com.gadget.event.keydown_from_ctrl) {
        //    this.gadget.event.keydown_from_ctrl(event, this.gadget)
        //}
    }
   //*****************************************************
   private _generate_input():STElement[] {
        let result:STElement[]=[]

        let style={...this.com.get_style(), ...this.com.get_style_size()}
        if (this.com.gadget.def.width_pro()) style={...style, width:this.com.gadget.def.width_pro()! }
        if (this.com.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}

       //Generate input button.
        let type="text"
        if (this.com.gadget.def.password()) type = "password"

        let value=GString.nullToText(this.com.state.text)
        let optionsName:string=this.com.key(["opt"])
        if (this._isGedit) {
            result.push(
                <input key={this.com.key([])}
                    type={type}
                    onChange={(event)=>this.com.event.ctrl_change(event)}
                    onFocus={this.com.onFocus}
                    onBlur={this.com.onBlur}
                    onKeyDown={this._eventKeyDown}
                    value={value}
                    readOnly={ this.com.get_readonly_render() }
                    className={this.com.gadget.def.class_name_add_concat("GEdit")}
                    style={style}
                    ref={this.com.ref_item}
                    list={optionsName}
                />
            )
        } else {
            result.push(
                <textarea key={this.com.key([])}
                    onChange={(event)=>this.com.event.ctrl_change(event)}
                    onFocus={this.com.onFocus}
                    onBlur={this.com.onBlur}
                    onKeyDown={this._eventKeyDown}
                    value={value}
                    readOnly={ this.com.get_readonly_render() }
                    className={this.com.gadget.def.class_name_add_concat("GEdit")}
                    style={style}
                    ref={this.com.ref_item}
                />
            )
        }

        //Add options if needed
        if (this._isGedit) {
            const options=this.com.gadget.def.options()
            if (options) {
                const optionsBody:STElement[] = []
                let count=0
                for (const item of options) {
                    const i=item.indexOf("=")
                    if (i>=0) {
                        optionsBody.push(<option key={this.com.key(["opt",count])} value={item.substring(0,i)}>{item.substring(i+1,item.length)}</option>)
                    } else {
                        optionsBody.push(<option key={this.com.key(["opt",count])}>{item.substring(i+1,item.length)}</option>)
                    }
                    count++
                }
                result.push(
                    <datalist key={this.com.key(["datalist"])} id={optionsName}>
                        {optionsBody}
                    </datalist>
                )
            }
        }

        return result
   }
   //*****************************************************
   private _generate_input_complex():STElement[] {
        let result:STElement[]=[]

        //Combine horizontal input with execution button if required.
        let inputCombo:STElement[]=[]
        if (this.com.gadget.def.script()) {
            inputCombo.push(
                <div key={this.com.key(["duplex"])} style={CComponent.add_style_flex({},"row")}>
                    {this._generate_input()}
                    <div key={this.com.key(["duplex"])} onClick={(event)=>{this.com.event.ctrl_command(event)}} className="GEdit-button">.</div>
                </div>)         
        } else {
            inputCombo=this._generate_input()
        }

        if (this.com.gadget.def.caption()) {
            let orientation =this.com.gadget.def.orientation() ?? Gadget_def.ORIENTATION.column
            let stylef=CComponent.add_style_flex({}, this.com.gadget.def.orientation() ?? Gadget_def.ORIENTATION.column)
            result.push(
                <div key={this.com.key(["flex"])} 
                    style={stylef}
                    >
                    <label key={this.com.key(["caption"])} className="GGeneral-caption" >{this.com.state.caption}</label>
                    {inputCombo}
                </div>
            )
        } else {
            result=inputCombo
        }
        return result
    }
   //*****************************************************
    render() {
        let style={...this.com.get_style_outer(), ...this.com.get_style()}
        if (this.com.gadget.def.width_pro()) style={...style, flexBasis:this.com.gadget.def.width_pro()! }
        const result:STElement=
            <div
                key={this.com.key(["outer"])}
                onClick={(event)=>this.com.event.ctrl_area_click(event)}
                style={style}
                className="GEdit"
                ref={this.com.ref_outer}
                onMouseDown={this.com.event.ctrl_mousedown}
                onMouseUp={this.com.event.ctrl_mouseup}
            >
                {this._generate_input_complex()}
            </div>
        this.com.render_report(result)
        return result
    }
   //*****************************************************
}