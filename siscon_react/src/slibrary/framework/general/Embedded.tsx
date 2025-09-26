import * as React from "react"
import GObject from "../../general/GObject"
import { STElement, STNull, STObjectAny } from "../../general/STypes"
import Gadget from "../gadget/Gadget"
import Gadgets from "../gadgets/Gadgets"

export class Embedded {
    static map: Map<string, Gadget> = new Map()
    //*******************************************************************
    static activate(makeActive: boolean, gadget: Gadget):void {
        let update = false;
        if (makeActive) {
            update=Embedded.setEmbedded(gadget)
        } else {
            update = Embedded.removeEmbedded(gadget)
        }
        if (update) Gadgets.inst().root_gadget.forceUpdate()
    }
    //*******************************************************************
    static isActive(gadget: Gadget):boolean {
        return (Embedded.getEmbedded(gadget)!=null)
    }
    //*******************************************************************
    static getEmbedded(gadget: Gadget): Gadget | STNull {
        let embedded: Gadget | STNull = Embedded.map.get(gadget.get_key())
        if (!embedded) embedded=null
        return embedded
    }
    //*******************************************************************
    static setEmbedded(gadget: Gadget): boolean {
        const result = (!Embedded.map.has(gadget.get_key()))
        if (result) Embedded.map.set(gadget.get_key(), gadget)
        return result
    }
    //*******************************************************************
    static removeEmbedded(gadget: Gadget): boolean {
        const result = (Embedded.map.has(gadget.get_key()))
        if (result) Embedded.map.delete(gadget.get_key())
        return result
    }
    //*******************************************************************
    /*
    static get_active_menu_gadget() {
        return Embedded._menu_gadget
    }
    */
    //*******************************************************************
    static expand_gadgets(logic:boolean, event: STObjectAny, gadget:Gadget) {
        event.stopPropagation()
        const root = gadget.def.embedded__get_root()
        if (root != null) {
            root.def.show_hide_children__all(logic)
        }
    }
    //*******************************************************************
    static close_gadgets(event: STObjectAny, gadget: Gadget) {
        event.stopPropagation()
        const root = gadget.def.embedded__get_root()
        if (root != null) {
            Embedded.activate(false, root)
        }
    }
    //*******************************************************************
    static get_embedded_gadget_rendering(items: STElement[]): void {
        Embedded.map.forEach((gadget: Gadget, key: string) => {
            const firstChild = gadget.get_first_child()
            if (firstChild!=null) items.push(Embedded._get_embedded_gadget_rendering(firstChild))
        })
    }
//*******************************************************************
    static _get_embedded_gadget_rendering(gadget: Gadget): STElement {

        const items_embedded: STElement = gadget.get_render_elements()
        let topDesignerAdjust = 0
        if (gadget.gadgets().is_designing()) topDesignerAdjust = 100
        const sep = "10px"
        let topStyle = { }

        if (GObject.isValid(gadget.def.left())) topStyle = { ...topStyle, left: (gadget.def.left() ?? 0) }

        if (GObject.isValid(gadget.def.top())) topStyle = { ...topStyle, top: (gadget.def.top() ?? 0) }  //+ topDesignerAdjust
        else topStyle = { ...topStyle, top: topDesignerAdjust }

        topStyle = { ...topStyle, cursor: "pointer" }

        const result = <table className="embedded" style={topStyle}  >
            <tbody>
                        <tr>
                            <td className="embedded-box">
                    <table className="embedded-heading">
                        <tbody>
                                        <tr>
                                            <td width="100%"></td>
                                    <td onClick={(event: STObjectAny) => { Embedded.expand_gadgets(false, event,gadget) }}><img src="images/gadgets/gmenutitle/common/contract.png" ></img></td>
                                    <td width={sep}></td>
                                    <td onClick={(event: STObjectAny) => { Embedded.expand_gadgets(true, event, gadget) }}><img src="images/gadgets/gmenutitle/common/expand.png" ></img></td>
                                    <td width={sep}></td>
                                    <td onClick={(event: STObjectAny) => { Embedded.close_gadgets(event, gadget) }}><img src="images/gadgets/gmenutitle/common/close.png" ></img></td>
                                    <td width={sep}></td>
                            </tr>
                            </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                        {items_embedded}
                            </td>
            </tr>
                </tbody>
                </table>
            
        return result
    }

//*******************************************************************
//*******************************************************************

}