import Commands from "../../../slibrary/framework/general/Commands";
import { STAjaxPacket, STNull } from "../../../slibrary/general/STypes";
import Log from "../../../slibrary/general/Log";
import Login_Popup from "../../dialogs/login/Login_Popup";
import General_Dialog from "../../dialogs/general_dialog/General_Dialog";
import Select_Company_Database from "../../dialogs/select_company_database/Select_Company_Database";
import Metrics from "../metrics/Metrics";
import Search from "../../dialogs/search/Search";
import GObject from "../../../slibrary/general/GObject";
import Ajax_Monitor from "../../dialogs/monitor/ajax_monitor/Ajax_Monitor";
import Ajax from "../system/ajax/Ajax";
import Sql_Monitor from "../../dialogs/monitor/sql_monitor/Sql_Monitor";
import { $general$system$logout } from "../system/ajax/$definitions/general/system/$general$system$logout";
import { $master$read } from "../system/ajax/$definitions/master/$master$read";
// Update the import path below to the correct location of Ajax_Audit, for example:

export default class Commands_General extends Commands {
    //***************************************************************************
    // This method processes all general commands.
    //***************************************************************************
    constructor() {
        super()
    }
    //***************************************************************************
    b_logout(): void {
        //Execute a logout
        const $=$general$system$logout
        new Ajax().call("Logout",$.COMMAND, { }, (ajax) => {
            window.open("./?page=desk/login/main", '_self');
        });
    }
    //***************************************************************************
    b_open_general_dialog(page_name: string): void {
        //Open general dialog indicating path
        new General_Dialog("General Dialog",page_name)
    }
    //***************************************************************************
    b_login(page_name:string|STNull): void {
        //Execute login
        Login_Popup.inst().open(page_name, null)
    }
    //***************************************************************************
    // target: _blank=new tab, _self=same tab.
    b_goto_page(pagename: string): void {
        //Goto application page.
        const target = "_blank" //_self would be same page. _blank=new page.
        window.open("./"+Metrics.inst().get_default_index_html()+"?page=" + pagename, target);
    }
    //***************************************************************************
    b_select_company_database(page_name: string): void {
        //Select company/database
        Select_Company_Database.inst().open(page_name, null)
    }
    //***************************************************************************
    b_search_populate_from_table(tablename: string, keyfield:string) {
        //Search data and populate gadget fields from this data.
        try {
            const gadget=this.get_gadget();
            const pattern = gadget!.get_value()
            new Search().search(tablename, keyfield, pattern, (result) => {

                //Populate response.
                let fields=gadget!.gadgets().fields_get_list(tablename)

                const $=$master$read
                const request:STAjaxPacket={}
                request[$.I_TABLE]=tablename
                request[$.I_KEYFIELD_NAME]=keyfield
                request[$.I_CODE]=result
                request[$.I_FIELDS]=fields.join(",")
                new Ajax().call("Get master data", $.COMMAND, request, (ajax) => {
                    let table_data=ajax.getResponse()[tablename]
                    gadget!.gadgets().fields_populate(tablename,table_data)
                    gadget?.set_value(null)
                });

            })
        } catch (e) {
            Log.logExc("Commands_General.b_search_populate_from_table",e)
        }
    }
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    // Auditing
    //***************************************************************************
    public b_open_ajax_monitor(is_auditing:boolean): void {
        //Open Ajax monitor
        new Ajax_Monitor(is_auditing)
    }
    //***************************************************************************
    public b_open_sql_monitor(is_auditing:boolean): void {
        //Open SQL monitor
        new Sql_Monitor(is_auditing)
    }
    //***************************************************************************
    public b_open_script_monitor(is_auditing:boolean): void {
        //Open script monitor
        Log.alert("Pending developement")
    }
    //***************************************************************************
    public b_open_message_monitor(is_auditing:boolean): void {
        //Open message monitor.
        Log.alert("Pending developement")
    }
    //***************************************************************************
}
