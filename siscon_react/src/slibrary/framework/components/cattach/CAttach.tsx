import CComponent from "../../components_base/CComponent"
import Log from "../../../general/Log";
import { STObjectAny, STElement, STypes } from "../../../general/STypes";

/*
This gadget is used for program pre defined features. Each feature is hard coded and identified via "id" 
*/

export default class CAttach extends CComponent {
    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }
     //*****************************************************
    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_area_click(event)
        this.event.ctrl_command(event)
        event.stopPropagation()
    }
    //*****************************************************
    render() {

        //Create child elements for panel if they do not exist.


        //If designing and the panel is empty create an elemento to fill the panel: Empty Panel.
        let design_empty_item = STypes.STEmptyElement
        try {
            if (this.gadget.gadgets().is_designing()) {
                if (this.gadget.get_children().length === 0) if (!this.gadget.def.caption()) {
                    if ((!this.gadget.def.width()) && (!this.gadget.def.height()))
                        design_empty_item = <label style={{ fontSize: "6px" }} key={this.key(["cap"])}>Empty</label>
                }
            }
        } catch (e) {
            Log.logExc("Error: GAttach.render-1", e)
        }

        //Create elements for panel.
        try {


            let classname = this.gadget.def.class_name_add_concat("GAttach")
            let result: STElement =
                <div key={this.key(["-outer"])}
                    onClick={this.eventClick0}
                    style={{...this.get_style_outer(), ...this.get_style(), ...this.get_style_size()}}
                    onMouseDown={this.event.ctrl_mousedown}
                    onMouseUp={this.event.ctrl_mouseup}
                    //onMouseMove={this.eventMouseMove}
                    ref={this.ref_outer}
                >
                    {this.gadget.get_attach_object().get_render_element()}
                </div>


            this.render_report(result)
            return result
        } catch (e) {
            Log.logExc("GPanel.render", e)
        }

    }
    //*****************************************************
}
