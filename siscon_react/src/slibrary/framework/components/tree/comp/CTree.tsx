import { STElement, STNull, STObjectAny } from "../../../../general/STypes"
import CComponent from "../../../components_base/CComponent"
import * as React from "react";
import CTree_Inter, { CTreeItem } from "./CTree_Inter";
import GObject from "../../../../general/GObject";

//export type GTree_item_clicked_event = (item: GTreeItem) => void

export default class CTree extends CComponent {
    private static IMAGE_EXPANDED="images/gadgets/gtree/expanded.png"
    private static IMAGE_COLLAPSED="images/gadgets/gtree/collapsed.png"

    inter: CTree_Inter=new CTree_Inter(this)

    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClickArea0 = (event: STObjectAny) => {
        this.event.ctrl_area_click(event)
    }
    item_onClick(event: STObjectAny, item: CTreeItem) {
        if (CTree_Inter.is_group(item)) {
            item.expanded = (!item.expanded)
            this.gadget.render()
        } else {
            //if (this.item_clicked_event) this.item_clicked_event(item)
            this.gadget.set_value(item.code)
            if (!(this.gadget.def.readonly())) {
                this.event.ctrl_click(event)
                this.event.ctrl_command(event)
            }
        }
    }
    //*****************************************************
    //item_clicked_event:GTree_item_clicked_event|STNull
    //set_item_clicked_event(item_clicked_event: GTree_item_clicked_event):void {
    //    this.item_clicked_event = item_clicked_event
    //}
    //*****************************************************
    create_tree_elements(): STElement {
        this._key_count = 0
        return this._create_tree_elements(this.inter.get_tree())
    }
    _key_count=0
    _create_tree_elements(items: CTreeItem[]): STElement {
        const res: STElement[] = []
        const value = this.gadget.get_value()
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const item: CTreeItem = items[i]

                if (item.visible ?? true) {

                    let itemExpanded = true
                    if (GObject.isValid(item.expanded)) itemExpanded = (item.expanded)

                    let image = <></>
                    let className = null
                    if (CTree_Inter.is_group(item)) {
                        className = "GTree-group"
                        const height = "10px"
                        if (itemExpanded) image = <img src={CTree.IMAGE_EXPANDED} height={height}></img>
                        else image = <img src={CTree.IMAGE_COLLAPSED} height={height}></img>
                    } else {
                        className = "GTree-item"
                        if (value) if (value === item.code) {
                            className = "GTree-item-selected"
                        }
                    }


                    const ele: STElement =
                        <li className={className}
                            key={this.key([item.code])}
                        >
                            <span className="GTree-caret"
                                onClick={(event: STObjectAny) => { this.item_onClick(event,item) }}
                            >
                                {image}&nbsp;
                                {item.caption}
                            </span>
                        </li>

                    res.push(ele)
                    if (item.children != null) if (itemExpanded) {
                        res.push(this._create_tree_elements(item.children))
                    }
                }
            }
        }
        this._key_count++
        let style = {}
        if (this.gadget.def.tab()) style = { paddingLeft: this.gadget.def.tab()}
        return <ul className="GTree-ul"
            key={this.key(["ul",this._key_count])}
            style={style}
        >
            {res}
        </ul>
    }
    //*****************************************************
    // Reference: https://www.bestcssbuttongenerator.com/
    render() {
        let readonly = this.gadget.def.readonly() ? true : false
        if (this.gadget.gadgets().is_designing()) readonly = true
        let style = { ...this.get_style_outer(), ...this.get_style() }

        const element: STElement = this.create_tree_elements()

        let result: STElement =
            <div
                key={this.key([])}
                onClick={this.eventClickArea0}
                style={style}
                className={this.gadget.def.class_name_add_concat("GTree")}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
            >
                {element }

            </div>
        this.render_report(result)
        return result
    }
    //*****************************************************

}

