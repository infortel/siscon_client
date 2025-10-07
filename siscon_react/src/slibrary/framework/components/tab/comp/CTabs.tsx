import CComponent from "../../components_base/CComponent"
import Log from "../../../general/Log";
import * as React from "react";
import { STElement, STObjectAny, STypes } from "../../../general/STypes";
import GDefinitions from "../../gadget/GDefinitions";
import Gadget from "../../gadget/Gadget";
import GObject from "../../../general/GObject";

export default class CTabs extends CComponent {
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
    _eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_area_click(event)
        this.event.ctrl_command(event)
        event.stopPropagation()
    }
    //*****************************************************
    _tabClick = (event: STObjectAny) => {
        const index=Number(event.target.value)
        if (GObject.isValid(index)) {
            this.gadget.dtabs()?.set_active_index(index)
            this.gadget.forceUpdate()
        }
    }
    //*****************************************************
    private _show_tabs():STElement[] {
        let result:STElement[] = []
        const styleTable = { ...CComponent.add_style_flex({},"row"), ...GDefinitions.TABLE_COMPACT_STYLE }
        result.push(
            <div key={this.key(["tab"])} style={styleTable} >
                {this._get_tab_rows()}
            </div>
        )

        return result
    }
    //-----------------------------
    private _get_tab_rows():STElement[] {
        let result:STElement[] = []
        let i:number=0
        for (const child of this.gadget.get_children()) {
            let caption=child.def.caption()
            if (!caption) caption="Child "+i

            let class0="GTabs-unselected"
            if (i===this.gadget.dtabs()?.get_active_index()) class0="GTabs-selected"

            result.push(
                <button value={i} onClick={this._tabClick} className={class0} key={this.key(["b",i])} >{caption}</button>
            )
            i++
        }
        return result
    }
    //*****************************************************
    render() {  

        if (this.gadget.is_hidden()) return <></>
        else {

            //Create elements for panel.
            try {
                let active_index=this.gadget.dtabs()?.get_active_index()
                if (!active_index) active_index=0

                let classname = this.gadget.def.class_name_add_concat("GTabs")
                let result: STElement =
                    <div key={this.key(["outer"])} 
                        onClick={this._eventClick0}
                        style={this.get_style_outer()}
                        onMouseDown={this.event.ctrl_mousedown}
                        onMouseUp={this.event.ctrl_mouseup}
                        //onMouseMove={this.eventMouseMove}
                        ref={this.ref_outer}
                    >

                        <div style={this.get_style()} className={classname} key={this.key(["inner"])}
                            ref={this.ref_inner}
                        >
                            {this._show_tabs()}
                            {this.gadget.get_react_children_elements(active_index)}
                            {this.state.caption}
                        </div>
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
