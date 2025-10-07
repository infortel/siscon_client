import Gadgets from "../../../gadgets/Gadgets"
import { STNull, STObjectAny } from "../../../../general/STypes"
import Param from "../../../../../application/common/Param"
import GString from "../../../../general/GString"
import T from "../../../../translate/T"
import Gadget from "../../../gadget/Gadget"
import Log from "../../../../general/Log"
import CWidgetpanel_Defaults from "./CWidgetpanel_Defaults"
import Metrics from "../../../../../application/common/metrics/Metrics"
import GArray from "../../../../general/GArray"
import GObject from "../../../../general/GObject"

export type T_GWidgetpanel_Def = {
    page: string
    column: number
    gadgets:Gadgets
}
type TCoordinate = { col: number, row: number } | STNull

export default class CWidgetpanel_Definitions {
    
    static _map: Map<string, CWidgetpanel_Definitions> = new Map()
    static _login_code: string | null = null
    static _globalActivity: string | STNull = null
    _name: string = ""
    _defs: T_GWidgetpanel_Def[] = []
    _matrix: T_GWidgetpanel_Def[][]=[] //[column][row]
    _activity: string | STNull = null
    _gadget_panel!: Gadget
    //*********************************************************************************
    static getGlobalActivity(): string | STNull {
        return CWidgetpanel_Definitions._globalActivity
    }
    //*********************************************************************************
    static get(name: string): CWidgetpanel_Definitions|STNull {
        return CWidgetpanel_Definitions._map.get(name)
    }
    //*********************************************************************************
    static initialize(gadget: Gadget) {

        const name = gadget.get_key_clean()
        CWidgetpanel_Definitions._globalActivity=T.t("Initializing")
        if (Param.p.system.data()!.login_code === null) {
            //No login, clear and exit.
            CWidgetpanel_Definitions._map.clear()
            return
        }

        let system_reseting = false
        if (CWidgetpanel_Definitions._login_code !== Param.p.system.data()!.login_code) {
            system_reseting = true
            CWidgetpanel_Definitions._map.clear()
         }

        //Check if data exist with correct login.
        let widgetpanel = CWidgetpanel_Definitions._map.get(name)
        if (!widgetpanel) {
            CWidgetpanel_Definitions._get_widgetpanel_from_server(system_reseting, gadget,name)
        } else {
            CWidgetpanel_Definitions._globalActivity = null
            widgetpanel._gadget_panel=gadget
        }
    }
    //*****************************************************
    static _get_widgetpanel_from_server(system_reseting:boolean, gadget: Gadget, name: string) {

        Metrics.inst().profile_read(name, (error, result_call) => {
            //let widgetpanel: GWidgetpanel_Definitions|STNull = null
            if (error===null) {
                let widgetpanel_defs = CWidgetpanel_Definitions._map.get(name)
                if (!widgetpanel_defs) {
                    widgetpanel_defs = new CWidgetpanel_Definitions()
                    widgetpanel_defs._name = name
                    CWidgetpanel_Definitions._map.set(name, widgetpanel_defs)
                }

                widgetpanel_defs._gadget_panel=gadget
                try {
                    widgetpanel_defs!._defs = result_call as T_GWidgetpanel_Def[]
                } catch (e) {
                    if (name === "main") widgetpanel_defs!._defs = CWidgetpanel_Defaults.main as T_GWidgetpanel_Def[]
                    else widgetpanel_defs!._defs=[]
                }
                widgetpanel_defs._defs_to_matrix()
                widgetpanel_defs._create_gadgets_from_profile(0)
                CWidgetpanel_Definitions._login_code = Param.p.system.data()!.login_code
            }
            CWidgetpanel_Definitions._globalActivity = null
        })
    }
    //*****************************************************
    save_profile() {
        const defs = []
        for (let i = 0; i < this._defs.length; i++) {
            const def0 = this._defs[i]
            const def1 = { page: def0.page, column: def0.column }
            defs.push(def1)
        }
        Metrics.inst().profile_save(this._name, defs, (error, result) => {
            //Do nothing.
        })
    }
    //*****************************************************
    add_profile() {
        Metrics.inst().profile_add((page_name: string | STNull) => {
            if (page_name != null) {
                if (GString.isStringWithText(page_name)) {
                    const def: T_GWidgetpanel_Def = {
                        page: page_name, column: 0, gadgets: {} as Gadgets
                    }
                    const page = Metrics.WIDGETS_DIRECTORY + def.page
                    def.gadgets = new Gadgets(false, page, { omit_open_error:true}, null, (ok: boolean) => {
                        //ready
                        def.gadgets.set_command_instance(this._gadget_panel.gadgets()._command_instance!)
                        if (ok) {
                            this._activity=null
                            this._add_profile_result(def)
                        } else {
                            def.gadgets = new Gadgets(false,this._get_empty_widget_definition(page), {}, null, (ok: boolean)=>{
                                this._add_profile_result(def)
                            })
                        }
                    })
                }
            }
        })
    }
    //----------------------------------------------------
    _get_empty_widget_definition(page: string): STObjectAny {
        const caption=T.t("Could not read widget"+" "+page)
        return {
            head: {
                title: caption
            },
            body: {
                type: "GWidget",
                caption: caption
            }
        }
    }
    //----------------------------------------------------
    _add_profile_result(def:T_GWidgetpanel_Def) {
        if (this._matrix.length <= 0) this._matrix.push([])
        this._matrix[0].push(def)
        this._matrix_to_defs()
        this._gadget_panel.render()
    }
    //*****************************************************
    getActivity(): string | STNull {
        return this._activity
    }
    //*****************************************************
    _create_gadgets_from_profile(index: number) {
        this._activity=T.t("Creating Window")+" #"+(index+1)
        if (Array.isArray(this._defs)) {
            if (index < this._defs.length) {
                const def: T_GWidgetpanel_Def = this._defs[index];
                if (def.gadgets) {
                    //Go to next, there is no need to create the framework.
                    this._create_gadgets_from_profile(index + 1)
                } else {
                    const page = Metrics.WIDGETS_DIRECTORY + def.page
                    def.gadgets = new Gadgets(false, page, { omit_open_error: true }, null, (ok: boolean) => {
                        def.gadgets.set_command_instance(this._gadget_panel.gadgets()._command_instance!)
                        if (ok) {
                            this._create_gadgets_from_profile(index + 1)
                        } else {
                            def.gadgets = new Gadgets(false, this._get_empty_widget_definition(page), {}, null, (ok: boolean) => {
                                if (ok) {
                                    this._create_gadgets_from_profile(index + 1)
                                } else {
                                    Log.alert(T.t("Error creating Widget") + " " + page)
                                }
                            })
                        }
                    })
                }
            } else {
                //Update Gadgets.
                this._activity = null
                const gadget_widgetpanel = Gadgets.inst().get(this._name)
                //if (gadget_widgetpanel) gadget_widgetpanel.forceUpdate()
                this._gadget_panel.render()
            }
        } else {
            this._activity = T.t("No widgets have been setup.")
            const gadget_widgetpanel = Gadgets.inst().get(this._name)
            //if (gadget_widgetpanel) gadget_widgetpanel.forceUpdate()
            this._gadget_panel.render()
        }

    }

    //*****************************************************
    get_column_count(): number {
        let max = 0
        for (let i = 0; i < this._defs.length; i++) {
            const def = this._defs[i]
            const c = GObject.toNumber(def.column)
            if (max < c) max = c
        }
        return max + 1
    }
    //*****************************************************
    /*
    dragged_up(gadget: Gadget) {
        for (let i = 0; i < this._defs.length; i++) {
            let def = this._defs[i]
            let root = def.framework.root_gadget
        }
    }
    */
    //*****************************************************
    _get_coordinate_given_gadgets(gadgets: Gadgets): TCoordinate {
        for (let c = 0; c < this._matrix.length; c++) {
            for (let r = 0; r < this._matrix[c].length; r++) {
                if (this._matrix[c][r].gadgets === gadgets) {
                    return { col: c, row: r }
                }
            }
        }
        return null
    }
    //*****************************************************
    _defs_to_matrix() {
        for (let i = 0; i < this._defs.length; i++) {
            const def = this._defs[i]
            while (def.column >= this._matrix.length) this._matrix.push([])
            this._matrix[def.column].push(def)
        }
    }
    //*****************************************************
    _matrix_to_defs() :void {
        const defs = []
        for (let c = 0; c < this._matrix.length; c++) {
            for (let r = 0; r < this._matrix[c].length; r++) {
                const def = this._matrix[c][r]
                defs.push(def)
            }
        }
        this._defs = defs
    }
    //*****************************************************
    _matrix_switch(c0: number, r0: number, c1: number, r1: number) {
        const def0 = this._matrix[c0][r0]
        const def1 = this._matrix[c1][r1]
        this._matrix[c0][r0] = def1
        this._matrix[c1][r1] = def0
        def0.column = c0
        def1.column = c1

   }
    //*****************************************************
    event_action(gadgets:Gadgets, type:string) {
        const c = this._get_coordinate_given_gadgets(gadgets)
        if (c != null) {
            if (type === "d") {
                if (c.row < this._matrix[c.col].length - 1) {
                    this._matrix_switch(c.col, c.row, c.col, c.row + 1)
                }
            } else if (type === "u") {
                if (c.row >0) {
                    this._matrix_switch(c.col, c.row, c.col, c.row - 1)
                }
            } else if (type === "r") {
                while (this._matrix.length <= c.col + 1) this._matrix.push([])
                const defs0 = this._matrix[c.col][c.row]
                this._matrix[c.col] = GArray.delete_element(this._matrix[c.col],c.row)
                this._matrix[c.col + 1].push(defs0)
                defs0.column = c.col + 1
                if (this._matrix[c.col].length == 0) this._matrix = GArray.delete_element(this._matrix, c.col)
                this._gadget_panel.render()
            } else if (type === "l") {
                if (c.col > 0) {
                    const defs0 = this._matrix[c.col][c.row]
                    this._matrix[c.col] = GArray.delete_element(this._matrix[c.col],c.row)
                    this._matrix[c.col - 1].push(defs0)
                    defs0.column = c.col - 1
                    if (this._matrix[c.col].length == 0) this._matrix=GArray.delete_element(this._matrix,c.col)
                    this._gadget_panel.render()
                }
            } else if (type === "c") {
                this._matrix[c.col] = GArray.delete_element(this._matrix[c.col], c.row)
                if (this._matrix[c.col].length == 0) this._matrix = GArray.delete_element(this._matrix, c.col)
                this._gadget_panel.render()
            }

            this._matrix_to_defs() 
            this._matrix = [] //This is done to reset rendering to nothing.
            this._gadget_panel.render()
            this._gadget_panel.execute_on_mounted(() => {
                this._defs_to_matrix()
                this._gadget_panel.render()
            })
        }
    }
    //*****************************************************
}
