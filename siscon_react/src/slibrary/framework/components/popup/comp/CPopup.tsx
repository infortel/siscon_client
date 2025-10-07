import { STElement, STNull, STObjectAny } from '../../../../general/STypes';
import CComponent from "../../../components_base/CComponent"
import GPopup_Window from '../logic/GPopup_Window';
import GPopup_Windows from '../logic/GPopup_Windows';
import Gadget_drag from '../../../gadget/Gadget_drag';
import React from 'react';

export default class CPopup extends CComponent {

    _popup_window:GPopup_Window|STNull=null

    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }

    _get_popup_window(): GPopup_Window | STNull {
        let res = null
           if (!this._popup_window) this._popup_window = GPopup_Windows.get_from_gadgets(this.gadget.gadgets())

        return this._popup_window
    }

    bar_close = (event: STObjectAny) => {
        if (!this.gadget.gadgets().is_designing()) {
            this._get_popup_window()
            if (this._popup_window) this._popup_window.close()
        }
    }

    bar_mouse_down = (event: STObjectAny) => {
        if (!this.gadget.gadgets().is_designing()) {
            this._get_popup_window()
            Gadget_drag.start_drag(this.gadget, Gadget_drag.MODE_CENTER)
        }
    }

    private _get_render_heading():STElement[] {
        const result:STElement[]=[]
        const style=CComponent.add_style_flex({padding:2, gap:4, boxSizing: "border-box" },"row")
        const height="8px"
        result.push(
                <div style={style} className="GPopup-heading" key={this.key(["heading"])}>
                    
                    <div onMouseDown={(event)=>{this.bar_mouse_down(event)}}
                        style={{width:"100%"}}
                        >
                            {this.gadget.gadgets().head.title()}
                    </div>
                    <img src="images/dialogs/common/close.png" onClick={this.bar_close} style={{height:""+height}} key={this.key(["normal"])}></img>
                    <img src="images/dialogs/common/close.png" onClick={this.bar_close} style={{height:""+height}} key={this.key(["maximize"])}></img>
                    <img src="images/dialogs/common/close.png" onClick={this.bar_close} style={{height:""+height}} key={this.key(["close"])}></img>
                </div>
        )
        return result
    }

    render() {
        this._get_popup_window()
        
        let styleOuter = { ...this.get_style_outer(), ...this.get_style_size(), ...this.get_style_resize()}

        //style = { ...style, padding: "0px", border: "0px", borderSpacing: "0px" }
        let styleTable={ borderSpacing: "0px" }
        let window=
            <div 
                style={styleOuter}
                key={this.key([])}
                ref={this.ref_outer} 
                onMouseDown={(event)=>{this.event.ctrl_mousedown(event)}}
                onMouseUp={this.event.ctrl_mouseup}
                onClick={this.eventClick0}
                className={"GPopup GPopup-outer"}
                onMouseEnter={(event)=>{}}
                onMouseMove={(event)=>{}}
            >
                {this._get_render_heading()}
                <div className="GPopup-box">
                    {this.gadget.get_react_children_elements(null)}
                </div>
            </div>
            

        if (!this.gadget.gadgets().is_designing() && this._popup_window?.is_modal()) {
            window =
                <div className="GPopup-shield" key={this.key(["back"])}>
                    { window }
                </div>
        }

        this.render_report(window)
        return window

    }

}

/*
import { STElement, STNull, STObjectAny } from '../../../general/STypes';
import CComponent from "../../components_base/CComponent"
import GPopup_Window from '../../popup_windows/GPopup_Window';
import GPopup_Windows from '../../popup_windows/GPopup_Windows';
import Gadget_drag from '../../gadget/Gadget_drag';

export default class CPopup extends CComponent {

    _popup_window:GPopup_Window|STNull=null

    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }

    _get_popup_window(): GPopup_Window | STNull {
        let res = null
           if (!this._popup_window) this._popup_window = GPopup_Windows.get_from_gadgets(this.gadget.gadgets())

        return this._popup_window
    }

    bar_close = (event: STObjectAny) => {
        if (!this.gadget.gadgets().is_designing()) {
            this._get_popup_window()
            if (this._popup_window) this._popup_window.close()
        }
    }

    bar_mouse_down = (event: STObjectAny) => {
        if (!this.gadget.gadgets().is_designing()) {
            this._get_popup_window()
            Gadget_drag.start_drag(this.gadget, Gadget_drag.MODE_CENTER)
        }
    }

    private _get_render_heading():STElement[] {
        const result:STElement[]=[]
        result.push(
            <tr key={this.key(["tr"])}>
                <td className="GPopup-box">
                    <table className="GPopup-heading" key={this.key(["table2"])}>
                        <tbody>
                            <tr>
                                <td width="100%" onMouseDown={(event)=>{this.bar_mouse_down(event)}}>{this.gadget.gadgets().head.title()}</td>
                                <td><img src="images/dialogs/common/close.png" onClick={this.bar_close}></img></td>
                        <td></td>
                        </tr>
                        </tbody>
                </table>
            </td>
        </tr>
        )
        return result
    }

    render() {
        this._get_popup_window()
        
        let styleOuter = { ...this.get_style_outer(), padding: Gadget_drag.BORDER_THICKNESS}

        //style = { ...style, padding: "0px", border: "0px", borderSpacing: "0px" }
        let styleTable={ borderSpacing: "0px" }
        let window=
            <div 
                style={styleOuter}
                key={this.key([])}
                ref={this.ref_outer} 
                onMouseDown={(event)=>{this.event.ctrl_mousedown(event)}}
                onMouseUp={this.event.ctrl_mouseup}
                onClick={this.eventClick0}
                className={"GPopup-outer"}
                onMouseEnter={(event)=>{}}
                onMouseMove={(event)=>{}}
            >

                <table 
                    key={this.key(["table"])}
                    style={styleTable}
                    ref={this.ref_inner}
                    className={"GGrid "+this.gadget.def.class_name()}
                >
                    <tbody>
                        {this._get_render_heading()}
                    <tr>
                            <td className="GPopup-box">
                             {this.gadget.get_react_children_elements(null)}
                        </td>
                        </tr>
                        </tbody>
                </table>

            </div>
            

        if (!this.gadget.gadgets().is_designing() && this._popup_window?.is_modal()) {
            window =
                <div className="GPopup-shield" key={this.key(["back"])}>
                    { window }
                </div>
        }

        this.render_report(window)
        return window

    }

}

*/