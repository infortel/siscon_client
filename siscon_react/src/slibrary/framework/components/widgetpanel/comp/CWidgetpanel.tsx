import * as React from 'react';
import Log from '../../../../general/Log';
import { STElement, STNull, STObjectAny } from '../../../../general/STypes';
import Gadget from '../../../gadget/Gadget';
import CComponent from "../../../components_base/CComponent"
import { Embedded } from '../../../general/Embedded';
import CWidget from '../../widget/comp/CWidget';
import SMetrics from '../../../../general/SMetrics';
import CWidgetpanel_Definitions, { T_GWidgetpanel_Def } from './CWidgetpanel_Definitions';
import T from '../../../../translate/T';
import { useRef } from 'react';
import Gadgets from '../../../gadgets/Gadgets';
import { renderToString } from 'react-dom/server'
import Gen from '../../../../general/Gen';
import GetReactElementsFor_GadgetChildren from '../../../general/GetReactElementsFor_GadgetChildren';

export default class CWidgetpanel extends CComponent {
    _widgetDefs:CWidgetpanel_Definitions|STNull=null
    //******************************************************************

    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
        CWidgetpanel_Definitions.initialize(this.gadget)
    }
//*******************************************************************************
    get_panel_definitions() {
        return this._widgetDefs
    }
//*******************************************************************************
    set_editMode(logic: boolean) {
        if (logic == false) {
            for (let i = 0; i < this._widgetDefs!._defs.length; i++) {
                this._widgetDefs!._defs[i].gadgets.clear_all_selections(Gadgets.LEVEL_BASIC)
            }
        }
        this.setState({ c_editing: logic } as any)
        //this.gadget.activate_rendering()
    }

    is_editMode(): boolean {
        let result=false
        if (this.state as STObjectAny) result=(this.state as STObjectAny).c_editing ?? false;
        return result
    }
    event_SetEditing = (event: STObjectAny) => {
        this.set_editMode(true)
    }
    event_ExitEditing = (event: STObjectAny) => {
        this.set_editMode(false)
    }
    event_SaveEditing = (event: STObjectAny) => {
        //Save window setup.
        this.set_editMode(false)
        this._widgetDefs?.save_profile()
    }
    event_Add = (event: STObjectAny) => {
        //Save window setup.
        this._widgetDefs?.add_profile()
    }
//*******************************************************************************

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }
//-------------------------------------------
    _tableRowsForThisColumn(def_rows:T_GWidgetpanel_Def[]): STElement {
        const rows: STElement[] = []
        for (let i: number = 0; i < def_rows.length; i++) {
            const widget = def_rows[i]
            if (widget.gadgets) {

                widget.gadgets.set_owner(this.gadget)
                
                const elements = widget.gadgets.get_render_elements()
                rows.push(<tr key={this.key(["trc",i])} >
                    <td className="GWidgetpanel-widget-cell"
                        key={this.key(["trc1",i])}
                    >
                        {elements}
                    </td></tr>)
            }
        }

        let tableRows: STElement = <></>
        if (rows.length == 0) {
            tableRows = <tr><td>*</td></tr>
        } else {
            tableRows = <>{rows}</>
        }
        let result: STElement = <table key={this.key(["trct"])}><tbody>{tableRows}</tbody></table>
        return result
    }
//-------------------------------------------
    _tableCompleteContent(): STElement {
        let content=<></>
        if (this._widgetDefs) {
            //Found depository

            if (this._widgetDefs.getActivity() != null) {
                content = <>{this._widgetDefs.getActivity()}</>
            } else {

                //Create the columns
                const colums: STElement[] = []
                //const colCount = this._widgetDefs.get_column_count()
                for (let col = 0; col < this._widgetDefs._matrix.length; col++) {
                    colums.push(
                        <td valign="top" key={this.key(["tccc",col])}>{this._tableRowsForThisColumn(this._widgetDefs._matrix[col])}</td>
                    )
                }
                content = <table key={this.key(["tcc"])}><tbody><tr>{colums}</tr></tbody></table>
            }

        } else {
            //There is no repository
            if (CWidgetpanel_Definitions.getGlobalActivity() != null) {
                content = <>{CWidgetpanel_Definitions.getGlobalActivity()}</>
            }

        }
        return content
    }
//-------------------------------------------

    render() {

        this._widgetDefs = CWidgetpanel_Definitions.get(this.gadget.get_key_clean())


        let style = { ...this.get_style_outer(), ...this.get_style() }

        const rootGadget = this.gadget.def.root__get_root()


        let rend = <></>
        try {
            const key = this.key([])

            let commands=<></>
            if (this.is_editMode()) {
                commands =
                    <>
                    <td><button onClick={this.event_SaveEditing}>{T.t("Save")}</button></td>
                    <td><button onClick={this.event_Add}>{T.t("Add")}</button></td>
                    <td><button onClick={this.event_ExitEditing}>{T.t("Exit")}</button></td>
                    </>
            } else {
                commands=<td><button onClick={this.event_SetEditing}>...</button></td>
            }

            rend = < div
                style={this.get_style_outer()}
                key={key}
                onClick={this.eventClick0}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
            >


                <table className={this.gadget.def.class_name_add_concat("GWidgetpanel")}
                    style={style}
                    key={key + "-1"}
                    ref={this.ref_inner}
                >
                    <tbody>
                        <tr>
                                <td>
                                <table key={key + "-2"} className="GWidgetpanel-bar">
                                    <tbody>
                                        <tr>
                                            <td width="100%">{this.state.caption}</td>
                                            {commands}
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        <tr><td>{this._tableCompleteContent()}</td></tr>
                        </tbody>
                    </table>


            </div >

        } catch (e) {
            Log.logExc("Error rendering GWidgetpanel", e)
        }
        this.render_report(rend)
        return (rend)
    }

}
