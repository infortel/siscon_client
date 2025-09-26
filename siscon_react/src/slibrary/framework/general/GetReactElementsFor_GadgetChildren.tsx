import GObject from "../../general/GObject"
import GString from "../../general/GString"
import Gadget from "../gadget/Gadget";
import { STElement, STNull, STypes } from "../../general/STypes";
import * as React from "react";
import CComponent from "../components_base/CComponent";
import Log from "../../general/Log";
export default class GetReactElementsFor_GadgetChildren {
   //******************************************************************
    static createChildrenElementsForPanelParent(parent: Gadget, child_index:number|null): STElement {
        let result: STElement=<></>

        try {

            let element: STElement[]= []
            if (GObject.isInvalid(parent.get_children())) return <></>

            let childCount = 0
            let lastActiveChild:Gadget|null=null

            if (Array.isArray(parent.get_children())) {

                let include_childs=true
                if (parent.def.embedded()) include_childs = false

                if (parent.def.show_hide_children()) {
                    const child = parent.get_first_child()
                    if (child) include_childs = (!child.is_hidden())
                }

                if (include_childs) {
                    let count=0
                    if (GObject.isValid(child_index)) {
                        if (child_index!>=0) {
                            count=GetReactElementsFor_GadgetChildren._addChild(element,parent,child_index!)
                            if (count>0) lastActiveChild=parent.get_children()[child_index!]
                            childCount+=count
                        }
                    } else {
                        for (let i = 0; i < parent.get_children().length; i++) {
                            count=GetReactElementsFor_GadgetChildren._addChild(element,parent,i)
                            if (count>0) lastActiveChild=parent.get_children()[i]
                            childCount+=count
                        }
                    }
                }
            }
            
            if (childCount==0) {
                result= <></>
            } else if (childCount>=1) {
                return <>{element}</>
                }
        } catch (e) {
            Log.logExc("GetReactElementsFor_GadgetChildren.createChildrenElementsForPanelParent",e)
        }
        return result

    }

    //******************************************************************

    private static _addChild(element: STElement[],  parent:Gadget, index:number):number {
        let childCount=0
        try {
            let child= parent.get_children()[index]
            let include_child = (!child.is_hidden())
            if (include_child) {        
                childCount++

                let child_element = child.get_render_elements()

                if (GObject.isValid(child_element)) {
                    element.push(<React.Fragment key={child.get_key()+"xxx"} >{child_element}</React.Fragment>)
                }
            }
        } catch (e) {
            Log.logExc("GetReactElementsFor_GadgetChildren._addChild",e)
        }
        
        return childCount
    }
    //******************************************************************
}