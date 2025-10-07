import CComponent from "../../../components_base/CComponent"
import Log from "../../../../general/Log";
import GPopup_Windows from "../../popup/logic/GPopup_Windows";
import { STObjectAny, STElement, STypes } from "../../../../general/STypes";
import { Embedded } from "../../../general/Embedded";
import * as React from "react";
import Gadget from "../../../gadget/Gadget";

export default class CPanel extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }
    //*****************************************************
    //_fallbackComponent = ({ error, componentStack, resetErrorBoundary }: { error: any, componentStack: any, resetErrorBoundary: any }) => {
        _fallbackComponent = ({ error}: { error: any, componentStack: any, resetErrorBoundary: any }) => {
        return (
            <div>
                <h1>An error occurred: {error.message}</h1>
            </div>
        );
    };
    //*****************************************************
    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_area_click(event)
        this.event.ctrl_command(event)
        event.stopPropagation()
    }
    //*****************************************************
    get_floating_elements_at_root():STElement[] {
        let items: STElement[] = []
        try {
            if (this.gadget.gadgetIsMainWindowRoot()) {

                //Generate popup items if it is the case.
                for (let i = 0; i < GPopup_Windows.active_windows.length; i++) {
                    items.push(GPopup_Windows.active_windows[i].get_rendering_elements())
                }
                //Add embedded
                Embedded.get_embedded_gadget_rendering(items)
            }

        } catch (e) {
            Log.logExc("GPanel.get_floating_elements_at_root", e)
        }
        return items
    }
    //*****************************************************
    static x:number=0
    render() {

        if (this.gadget.is_hidden()) return <></>
        else {

            //If designing and the panel is empty create an elemento to fill the panel: Empty Panel.
            let design_empty_item = STypes.STEmptyElement
            try {
                if (this.gadget.gadgets().is_designing()) {
                    if (this.gadget.get_children().length === 0) if (!this.gadget.def.caption()) {
                        if ((!this.gadget.def.width()) && (!this.gadget.def.height())) {
                            let caption="<"+this.gadget.toString()+">"
                            if (this.gadget.def.include_file()) caption="Include: "+this.gadget.def.include_file()
                            design_empty_item = <label style={{ fontSize: "6px" }} key={this.key(["cap"])}>{caption}</label>
                        }
                    }
                }
            } catch (e) {
                Log.logExc("Error: GPanel.render-1",e)
            }

            //Create elements for panel.
            try {

                let styleAll={...this.get_style(), ...this.get_style_outer(), ...this.get_style_size()}
                if (this.gadget.def.gap()) styleAll={...styleAll, gap:this.gadget.def.gap()}
                if (this.gadget.def.padding()) styleAll={...styleAll, padding:this.gadget.def.padding()}
                if (this.gadget.def.h_align()) styleAll={...styleAll, justifyContent:this.gadget.def.h_align()}

                const orientation=this.gadget.def.orientation()
                if (orientation) styleAll=CComponent.add_style_flex(styleAll,orientation)

                let classname = this.gadget.def.class_name_add_concat("GPanel")
                let caption=this.gadget.def.caption() ?? ""
                if (this.gadget.get_parent() && this.gadget.get_parent()?.isTabs()) caption=""

                let result: STElement =
                    <div 
                        key={this.key(["outer",CPanel.x])} 
                        className={classname} 
                        onClick={this.eventClick0}
                        style={{...styleAll}}
                        onMouseDown={this.event.ctrl_mousedown}
                        onMouseUp={this.event.ctrl_mouseup}
                        ref={this.ref_outer}
                    >
                            {this.get_floating_elements_at_root()}
                            {this.gadget.get_react_children_elements(null)}
                            {this.gadget.get_nested_items()}
                            {design_empty_item}
                            {caption}
                    </div>

                this.render_report(result)
                return result
            } catch (e) {
                Log.logExc("GPanel.render",e)
            }
        }

    }
    //*****************************************************

}
