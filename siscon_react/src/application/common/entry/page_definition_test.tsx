export default function Page_definition_test() {

    let context =
        {
            head: {
                title: "Pump System Control - Control1.com"
            }
            , body: {
                type: "GPanel"
                , direction: "vertical"
                , children:
                    [
                        {
                            type: "GEdit"
                            , dim_value_null: 1
                            , width: 60
                            , caption: "Period:"
                            , data_type: "time"
                            , server_unit: "minutes"
                            , format: "hh:mm"
                            , plc: {address: 1, type: "register"}
                            , script: ["com.server_plc_set_gadget()"]
                        }
                        , {
                        type: "GEdit"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Time:"
                        , data_type: "time"
                        , server_unit: "minutes"
                        , format: "hh:mm"
                        , readonly: "1"
                        , plc: {address: 3, type: "register"}
                    }
                        , {
                        type: "GCheckbox"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Line 1 Active (Chiller)"
                        , plc: {address: 20, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GCheckbox"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Pump 1-1 Active"
                        , plc: {address: 21, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GCheckbox"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Pump 1-2 Active"
                        , plc: {address: 22, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GImage"
                        , width: 100
                        , image_active: "images/pump_1.gif"
                        , image_inactive: "images/pump_0.gif"
                        , dim_value_null: 1
                        , plc: {address: 1, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GCheckbox"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Pump 1-1"
                        , plc: {address: 1, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GImage"
                        , width: 100
                        , image_active: "images/pump_1.gif"
                        , image_inactive: "images/pump_0.gif"
                        , dim_value_null: 1
                        , plc: {address: 2, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                        , {
                        type: "GCheckbox"
                        , dim_value_null: 1
                        , width: 60
                        , caption: "Pump 1-2"
                        , plc: {address: 2, type: "output"}
                        , script: ["com.server_plc_set_gadget()"]
                    }
                    ]

            }
        }

    return JSON.stringify(context)
}
