import GObject from "../../general/GObject"
import { STNull, STObjectAny } from "../../general/STypes"
import Gadget from "../gadget/Gadget"
import Gadgets from "../gadgets/Gadgets"
import CComponent from "./CComponent"

export default class CComponent_event {
    //******************************************************************
    com!: CComponent
    gadget!:Gadget
    _last_change_text: string | STNull = null    //Last change value text the control had.
    //******************************************************************
    constructor(com: CComponent) {
        this.com = com
    }
    //******************************************************************
    //*****************************************************
    public ctrl_mousedown = (event: STObjectAny) => {
        if (this.gadget) this.gadget.event.mouseDown(event as MouseEvent)
    }
    //*****************************************************
    public ctrl_mouseup = (event: STObjectAny) => {
        if (this.gadget) this.gadget.event.mouseUp(event as MouseEvent)
    }
    //*****************************************************
    public ctrl_click = (event: STObjectAny | STNull) => {
        if (this._ctrl_click_timer != null) {
            //This is not the first click.
            window.clearTimeout(this._ctrl_click_timer as number)
            this._ctrl_click_timer = null
        } else {
            //This is the first click
            this._ctrl_click_count = 0
        }
        this._ctrl_click_count++


        this._ctrl_click_timer = window.setTimeout(() => {
            this.gadget.event.set_last_click_count(this._ctrl_click_count)
            this._ctrl_click_timer = null
            this._clickService(event as STObjectAny)
        }, CComponent._clickTime) as number

        if (event) try { event.stopPropagation() } catch (e) { }
    }
    //---------------------------
    private _ctrl_click_timer: number | null = null //Timer to count the number of clicks.
    private _ctrl_click_count: number = 0
    //---------------------------
    private _clickService(event: STObjectAny | null) {
        if (true) {

            if (this.com.apply_command()) {

                if (this.gadget.isToggle()) {
                    if (this.gadget.get_value()) {
                        this.gadget.set_value(0)
                    } else {
                        this.gadget.set_value(1)
                    }
                }

                //Propagate to sub programs.
                this.gadget.gadgets().event_gadgets_onclick(event, this.gadget)
                this.gadget.event.click(event)

            }

        }
    }
    //*****************************************************
    public ctrl_area_click = (event: STObjectAny | null) => {

        if (this.checkAreaClickTime()) {

            if (this._ctrl_area_click_timer === null) {
                //This is the first click
                this._ctrl_area_click_count = 0
            } else {
                //This is not the first click.
                window.clearTimeout(this._ctrl_area_click_timer as number)
                this._ctrl_area_click_timer = null
            }
            this._ctrl_area_click_count++

            this._ctrl_area_click_timer = window.setTimeout(() => {
                this.gadget.event.set_last_area_click_count(this._ctrl_area_click_count)
                this._ctrl_area_click_timer = null
                this._areaClickService(event)
            }, CComponent._clickTime) as number
        }
        if (event) try { event.stopPropagation() } catch (e) { }
    }
    //---------------------------
    private _ctrl_area_click_timer: number | null = null //Timer to count the number of clicks.
    private _ctrl_area_click_count: number = 0
    //---------------------------
    private static enableEventAreaClickTime: boolean = true
    private checkAreaClickTime(): boolean {
        let result: boolean = CComponent_event.enableEventAreaClickTime
        if (result) {
            CComponent_event.enableEventAreaClickTime = false
            setTimeout(() => { CComponent_event.enableEventAreaClickTime = true }
                , 50)
        }
        return result
    }
    //---------------------------
    _areaClickService(event: STObjectAny | null) {
        this.gadget.gadgets().event_gadgets_area_onclick(event as STObjectAny | STNull, this.gadget)
        this.gadget.event.areaclick(event)

        //if (this.gadget.framework().is_designing()) {
        if (this.gadget.can_be_selected()) {

            //Turn all off
            if (event) if (!event.shiftKey) {
                this.gadget.gadgets().clear_all_selections(Gadgets.LEVEL_BASIC)
            }

            if (this.gadget.is_selected()) {
                this.gadget.set_selected(false)
            } else {
                this.gadget.set_selected(true)
            }

            try { this.gadget.render() } catch (e) { }
        }
    }
    //*****************************************************
    public ctrl_command = (event: STObjectAny | STNull) => {
        if (this.com.apply_command()) {
            if (this.com.get_changecount_focused() > 0) {
                this.com.set_gadget_value_from_text(this._last_change_text)
            }
            this.gadget.gadgets().event_gadgets_oncommand(event, this.gadget)
        }
    }
    //*****************************************************
    public ctrl_change = (event: STObjectAny) => {
        if (this.com.apply_command()) {

            this._last_change_text = event.target.value
            if (this.gadget.isCheckbox() || this.gadget.isCombobox()) {
                try {
                    if (this.gadget.get_value()===event.target.value) return
                } catch (e) {
                    return
                }
            }

            this.com.increment_changecount_focused()

            this.gadget.register_modification()

            if (this.gadget.isCheckbox()) {
                //Convert to the digital value.
                if (GObject.isValid(event.target.checked)) {
                    if (event.target.checked) this._last_change_text = "1";
                    else this._last_change_text = "0"
                }
            }

            if (this.gadget.isEdit() || this.gadget.isTextarea()) {
                this.com.setState({ text: this._last_change_text })
            } if (this.gadget.isListbox() || this.gadget.isCombobox()) {
                this.com.assign_data_after_change_finish(event)
            } else {
                this.com.reset_changecount_focused()
                this.com.set_gadget_value_from_text(this._last_change_text)
            }

            if (!this.gadget.isEdit() || this.gadget.isTextarea()) this.com._reportGadgetOnChange(event)

            this.gadget.event.dynamic_change(this._last_change_text)

        }
    }
    //*****************************************************

}