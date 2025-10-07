import GObject from "../../general/GObject";
import GString from "../../general/GString";
import Log from "../../general/Log";
import SMetrics from "../../general/SMetrics";
import { STNull } from "../../general/STypes";
import SEvaluate from "../../sevaluations/SEvaluate";
import Gadget from "../gadget/Gadget";
import { Toptions } from "../gadget/Gadget_def";
import CComponent from "./CComponent";

export type MyState = {
    caption: string | STNull;
    dim_value_null: boolean     //Indicates to dim control if value is null.
    x_activate_rendering: number | STNull
    height: string | STNull;
    x_hidden: boolean
    image: string | STNull;
    x_modifications: number;
    options: Toptions[] | STNull;
    x_selected: boolean;
    text: string | STNull;
    width: string | STNull;
}

export default class CComponent_st {
    //******************************************************************
    com!: CComponent
    gadget!: Gadget
    //******************************************************************
    constructor(com: CComponent) {
        this.com = com
    }
    //*****************************************************
    get_initial_value(): MyState {
        return {
              caption: this.gadget.def.caption()
            , dim_value_null: this.gadget.def.dim_value_null()
            , height: this.gadget.def.height()
            , image: this.gadget.def.image()
            , options: this.gadget.get_options()
            , text: this.gadget.get_value() // this.gadget.def.text()
            , width: this.gadget.def.width()
            , x_activate_rendering: 0
            , x_hidden: false
            , x_modifications: this.gadget.get_modifications()
            , x_selected: this.gadget.is_selected()
        }
    }
    //*****************************************************
    update_state_from_gadget() {
        try {
            if (GObject.isValid(this.gadget.def.caption())) this.com.setState({ caption: this.gadget.def.caption() })
            if (GObject.isValid(this.gadget.def.dim_value_null())) this.com.setState({ dim_value_null: this.gadget.def.dim_value_null() })
            if (GObject.isValid(this.gadget.def.height())) this.com.setState({ height: this.gadget.def.height()! })
            if (GObject.isValid(this.gadget.def.image())) this.com.setState({ image: this.gadget.def.image() })
            if (GObject.isValid(this.gadget.def.options())) this.com.setState({ options: this.gadget.get_options()! })
            if (GObject.isValid(this.gadget.def.text())) this.com.setState({ text: this.gadget.def.text() })
            if (GObject.isValid(this.gadget.def.width())) this.com.setState({ width: this.gadget.def.width()! })
        } catch (e) {
            Log.logExc("Error: GComponent_st:update_state_from_gadget",e)
        }
    }
    //*****************************************************
    //*****************************************************
    update_state_hidden() {
        this.com.setState({ x_hidden: this.gadget.is_hidden() })
    }
    //*****************************************************
    set_dim_value_null(logic: boolean): void {
        this.com.setState({ dim_value_null: logic })
    }

    //*****************************************************
    set_caption(caption: string | STNull): void {
        this.com.setState({ caption: GString.nullToText(caption) })
    }
    //******************************************************************
    set_x_activate_rendering(value: number) {
        this.com.setState({ x_activate_rendering: value })
    }
    //******************************************************************
} 