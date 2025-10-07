import * as React from "react";
import { Component } from "react";
import Program_Base from "../../../application/common/entry/Program_Base";
import GObject from "../../general/GObject";
import Log from "../../general/Log";
import SMetrics from "../../general/SMetrics";
import STime from "../../general/STime";
import { STElement, STNull, STObjectAny } from "../../general/STypes";
import SEvaluate from "../../sevaluations/SEvaluate";
import Data_type from "../general/Data_type";
import Gadget from "../gadget/Gadget";
import Gadget_drag from "../gadget/Gadget_drag";
import CComponent_event from "./CComponent_event";
import CComponent_st, { MyState } from "./CComponent_st";
import { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server'; //https://html.onlineviewer.net/
import { Utility } from "../general/Utility";
import { KeyManagement } from "../../general/KeyManagement";

//export type TOptions = {
//    designing:boolean
//}

//export type TParameterOptionList = string[]

type MyProps = {
    gadget:Gadget
}

export default class CComponent extends Component<MyProps,MyState> {
    public static SCREEN_UNIT="px"
    static KEY_DESIGNING="designing-"
    static _clickTime: number = 300
    static _designer_borderWidth = 1

    event: CComponent_event = new CComponent_event(this)
    st: CComponent_st = new CComponent_st(this)

    _mounted: number = 0
    focused: boolean=false
    gadget!: Gadget
    private _changecount_focused: number = 0         //Indicates the number of changes executed to the control.
    ref_outer: any 
    ref_inner: any //React.LegacyRef<HTMLButtonElement> | undefined
    ref_item: any
    //ref_area=React.createRef<HTMLIFrameElement>()
    //*****************************************************
    constructor(props: any) {
        super(props)
        try {
            Object.assign(this, props)

            this.ref_outer = React.createRef()
            this.ref_inner = React.createRef()
            this.ref_item = React.createRef()

            //this.pro=props.def.pro
            this.gadget = this.props.gadget
            this.event.gadget = this.props.gadget
            this.st.gadget = this.props.gadget
            this.gadget.set_com(this) //Set provitionally this component while constructor is finished.

            this.state = this.st.get_initial_value()

            if (GObject.isValid(this.gadget.def.text())) this.set_gadget_value_from_text(this.state.text)

        } catch (e) {
            Log.logExc("Error: GComponent constructor: "+this.gadget.get_string_detail(4),e)
        }
  

    }
    //*****************************************************
    apply_command() {
        return ((!this.gadget.gadgets().is_designing()) || (KeyManagement.inst().is_alt_key()))
    }
    //*****************************************************
    static get_designer_border_width() {
        return CComponent._designer_borderWidth
    }
    //*****************************************************
    static add_designer_border_width(value: number) {
        CComponent._designer_borderWidth += value
        if (CComponent._designer_borderWidth < 0) CComponent._designer_borderWidth = 0
    }
    //*****************************************************
    componentDidMount() {
        this._mounted++
    }
    //*****************************************************
    get_mounted() {
        return this._mounted
    }
    //*****************************************************
    _reportGadgetOnChange(event: STObjectAny) {
        if (this.apply_command()) {
            this.gadget.gadgets().event_gadgets_onchange(event, this.gadget)
            this.gadget.event.change(event)
        }
    }

    //*****************************************************
    //On control entry
    onFocus = (event: STObjectAny) => {
        if (this.apply_command()) {
            this._changecount_focused = 0
            this.focused = true;
        }
    }
    //*****************************************************
    //On control exit
    onBlur = (event: STObjectAny) => {
        this.assign_data_after_change_finish(event)
    }
    //*****************************************************
    public assign_data_after_change_finish(event: STObjectAny) {
        if (this.apply_command()) {
            if (this._changecount_focused > 0) {
                this.set_gadget_value_from_text(this.event._last_change_text)
            }
            this.focused = false;
            if ((this.gadget.isEdit()  || this.gadget.isTextarea()) && this._changecount_focused > 0) this._reportGadgetOnChange(event)
            this._changecount_focused = 0

            //Execute script on change if active.
            if (this.gadget.def.script_change()) {
                this.gadget.gadgets().execute_command(this.gadget,this.gadget.def.script_change())
            }
        }
    }
    //*****************************************************
    isFocused(): boolean {
        return this.focused;
    }
   //*****************************************************
    update_state_value() {

        if (this.apply_command()) {
            try {
                if (this._mounted) {

                    let text_value = this.get_value_as_text()
                    if (GObject.isInvalid(text_value)) text_value = ""
                    if (
                        (this.gadget.isEdit())
                        || (this.gadget.isCheckbox())
                        || (this.gadget.isTextarea())
                        || (this.gadget.isToggle())
                    ) {
                        this.setState({text: text_value})
                    } else if (this.gadget.isImage()) {
                        this.setState({image: this.gadget.def.image()})
                    } else {
                        let st = this.get_value_as_text()
                        this.setState({text: text_value})
                        this.setState({caption: text_value})
                    }
                }
            } catch (e) {
                Log.log("GComponent.update_state_value")
            }
        }
    }
    //*****************************************************
    get_style_outer() {
        let style = {}

        try {

            if (GObject.isValid(this.gadget.def.style_outer())) {
                try {
                    style=JSON.parse("{"+this.gadget.def.style_outer()+"}")
                } catch (e) {
                    Log.logExc("Error on form (style_outer). Item="+this.gadget.toString(),e)
                }
            }

            if ((this.gadget.is_selected()) || (this.gadget.gadgets().is_designing())) {
                if (this.gadget.is_selected()) {
                    style = { ...style, userSelect: "none", border: CComponent._designer_borderWidth + "px dashed red" }
                } else {
                    style = { ...style, userSelect: "none", border: CComponent._designer_borderWidth + "px dashed #888888" }
                }
            } else {
                //Do the dim part.
                let dim = false;
                if (this.gadget.def.dim_value_null() ?? 0 > 0) {
                    dim = (this.gadget.get_value() === undefined)
                }
                if (this.gadget.gadgets().is_designing()) dim = false

                if (dim) style = { ...style, opacity: 0.5 }
                else style = { ...style, opacity: 1.0 }

                if (this.gadget.get_modifications() > 0) {
                    style = { ...style, background: "#1f472a10" }
                }

            }

            //Get value from metrics. Otherwise, try by definition.
            let s_left=null
            let s_top=null
            if (this.gadget.metrics.get_left()!==null) s_left=""+this.gadget.metrics.get_left()+CComponent.SCREEN_UNIT; else if (this.gadget.def.left()!==null)  s_left=this.gadget.def.left()
            if (this.gadget.metrics.get_top()!==null) s_top=""+this.gadget.metrics.get_top()+CComponent.SCREEN_UNIT; else if (this.gadget.def.top()!==null)  s_top=this.gadget.def.top()
            if (s_left!==null || s_top!==null) if (!this.gadget.gadgets().is_designing()) {
                style={...style, position:"absolute"}
                if (s_left) style={...style, left:s_left}
                if (s_top) style={...style, top:s_top}
            }

            if (this.gadget.def.scroll()) style={...style,overflow:"auto"}
            
            

        } catch (e) {
            Log.logExc("GComponent:get_outer_style ",e)
        }

        return style
    }
    //*****************************************************
    get_style() {
        let style= {}

        try {

            if (GObject.isValid(this.gadget.def.style())) {
                try {
                    style=JSON.parse("{"+this.gadget.def.style()+"}")
                } catch (e) {
                    Log.logExc("Error on form (style_outer). Item="+this.gadget.toString(),e)
                }
            }

            if (this.gadget.def.css_name()) {
                let css_of_name = this.gadget.gadgets().get_css(this.gadget.def.css_name()!)
                style = { ...css_of_name, ...style }
            }

            if (this.gadget.def.movable()) {
                style = { ...style, zIndex:1, position: "absolute" }
            }

        } catch (e) {
            Log.logExc("GComponent:get_outer_style ",e)
        }

        return style
    }
    //*****************************************************
    public get_style_size() {
        let style={}
        try {
            //Get value from metrics. Otherwise, try by definition.
            if (this.gadget.metrics.get_width()!==null) style={...style, width:this.gadget.metrics.get_width()+CComponent.SCREEN_UNIT}; else if (this.gadget.def.width()!==null)  style={...style, width:this.gadget.def.width()}
            if (this.gadget.metrics.get_height()!==null) style={...style, height:this.gadget.metrics.get_height()+CComponent.SCREEN_UNIT}; else if (this.gadget.def.height()!==null) style={...style, height:this.gadget.def.height()}

            if (this.gadget.def.width_pro()!==null)  style={...style, width:this.gadget.def.width_pro()}
            if (this.gadget.def.height_pro()!==null)  style={...style, height:this.gadget.def.height_pro()}
        } catch (e) {
            Log.logExc("GComponent:get_outer_style ",e)
        }
        return style
   }
    //*****************************************************
    public get_style_resize() {
        let style={}
        try {
            const allow=this.gadget.def.allow_resize()
            if (!allow) return style
            const border=Gadget_drag.BORDER_THICKNESS+"px double #000000" //, padding: Gadget_drag.BORDER_THICKNESS
            if (allow.includes("n")) style={...style, borderTop:border}
            if (allow.includes("s")) style={...style, borderBottom:border}
            if (allow.includes("e")) style={...style, borderRight:border}
            if (allow.includes("w")) style={...style, borderLeft:border}


            /*
            const padding=Gadget_drag.BORDER_THICKNESS+"px" //, padding: Gadget_drag.BORDER_THICKNESS
            if (allow.includes("n")) style={...style, paddingTop:padding}
            if (allow.includes("s")) style={...style, paddingBottom:padding}
            if (allow.includes("e")) style={...style, paddingRight:padding}
            if (allow.includes("w")) style={...style, paddingLeft:padding}
            */

        } catch (e) {
            Log.logExc("GComponent:get_outer_style ",e)
        }
        return style
   }
   //*****************************************************
    //Get text based on value.
    get_value_as_text():string|STNull {
        let result = null
        try {
            if (GObject.isValid(this.gadget.get_value())) {
                if (!this.gadget.def.format()) {
                    result = "" + this.gadget.get_value()
                } else if ((this.gadget.def.data_type() === Data_type.time) && (this.gadget.def.data_type())) {
                    try {
                        result = this.gadget.get_value().format(this.gadget.def.format())
                    } catch (e) {
                        result = this.gadget.get_value()
                    }
                }
            } else {
                result = ""
            }
        } catch (e) {
            Log.logExc("get_value_as_text",e)
        }
        return result
    }

    //*****************************************************
    public set_gadget_value_from_text(text:string|STNull):void {
        if ((this.gadget.def.data_type() === Data_type.time) && (this.gadget.def.data_type())) {
            this.gadget.set_value(new STime())
            this.gadget.get_value().set_time_from_string(this.gadget.def.format(), text)
        } else {
            this.gadget.set_value(text)
        }
        this._changecount_focused = 0
        this.update_state_value()
    }

    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    /*
    clear_modifications():void {
        this.st.set_x_modifications(0)
    }
    get_modifications() {
        return this.state.x_modifications
    }
        */
    //*****************************************************
    get_caption():string|STNull {
        return this.state.caption
    }
    //*****************************************************
    public get_readonly_render() {
        let readonly: boolean = this.gadget.def.readonly() ? true : false
        if (this.gadget.gadgets().is_designing()) readonly=true
        return readonly
    }
    //*****************************************************
    render_report(render_data:STElement) {
        //console.log("Rendering:=======================================\n"+this.gadget.get_string_detail(-1)) 
        if (CComponent.render_report_activated()) {
            let proceed=true
            if (CComponent._render_report_filter) proceed=(this.gadget.def.type()!.indexOf(CComponent._render_report_filter)>=0)
            console.log(Utility.timestamp()+this.gadget.get_string_detail(CComponent._render_report_layers))
        }

        if (false) if (this.gadget.isGrid()) {
            console.log("\n========================================"+this.gadget.get_string_detail(0)+"+\n" + renderToString(render_data)) 
        }
    }
    public static render_report_activate(layers:number, filter:string|null) {
        CComponent._render_report_layers=layers
        CComponent._render_report_filter=filter
    }
    public static render_report_activated() {
        return (CComponent._render_report_layers>=0)
    }
    private static _render_report_layers=-1
    private static _render_report_filter:string|null=null
    //*****************************************************
    public get_changecount_focused():number {
        return this._changecount_focused
    }
    //*****************************************************
    public increment_changecount_focused(): void {
        this._changecount_focused++
    }
    //*****************************************************
    public reset_changecount_focused(): void {
        this._changecount_focused=0
    }
    //*****************************************************
    public key(names:any[]):string {
        let res=this.gadget.get_key()
        for (const it of names) {
            res+="."+it
        }
        //console.log(this.gadget.toString()+"    //## key="+res)
        return res
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    public static add_style_flex(style:STObjectAny, orientation:string|null):STObjectAny {
        if (orientation) style={...style, display:"flex", flexDirection:orientation}
        return style
    }
    //*****************************************************
}
