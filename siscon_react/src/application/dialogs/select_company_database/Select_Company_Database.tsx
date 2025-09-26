import { CTreeItem } from "../../../slibrary/framework/components/ctree/CTree_Inter"
import Gadget from "../../../slibrary/framework/gadget/Gadget"
import Gadgets from "../../../slibrary/framework/gadgets/Gadgets"
import GPopup_Window from "../../../slibrary/framework/popup_windows/GPopup_Window"
import GPopup_Windows from "../../../slibrary/framework/popup_windows/GPopup_Windows"
import Log from "../../../slibrary/general/Log"
import { STAjaxPacket, STCallBack_Success, STNull, STObjectAny } from "../../../slibrary/general/STypes"
import T from "../../../slibrary/translate/T"
import { Select_Company_Attach } from "../../attach/select_company/Select_Company_Attach"
import Page_Name from "../../common/generals/Page_Name"
import Server_Command from "../../common/generals/Server_Command"
import Param from "../../common/Param"
import { $database$get_database_list } from "../../common/system/ajax/$definitions/database/$database$get_database_list"
import { $database$select_database } from "../../common/system/ajax/$definitions/database/$database$select_database"
import Ajax from "../../common/system/ajax/Ajax"
import Select_Widget_Commands from "../select_widget/Select_Widget_Commands"
import Select_Company_Database_Commands from "./Select_Company_Database_Commands"

export type TG_Select_Company_Database = {
    databases: Gadget,
    select_company: Gadget,
}

export default class Select_Company_Database {
    static _instance: Select_Company_Database
    static SEPARATE_SERVER_DATABASE = ".."
    popup_window: GPopup_Window | STNull = null
    da!: TG_Select_Company_Database
    //***************************************************************************
    static inst(): Select_Company_Database {
        if (!Select_Company_Database._instance) new Select_Company_Database()
        return Select_Company_Database._instance
    }
    //*****************************************************
    constructor() {
        Select_Company_Database._instance = this
    }
    //*****************************************************
    open(page_name: string, callOnLogin: STCallBack_Success | STNull): void {
        GPopup_Windows.open("Select Company Database", page_name, Select_Company_Database_Commands.inst(), true, (popup_window: GPopup_Window | STNull) => {

            //Common dialog assignments

            this.popup_window = popup_window!
            this.da = this.popup_window.gadgets.da as TG_Select_Company_Database
            this.da.databases.event.set_onclick(this._database_clicked_event)

            this._populate_database()
        })
    }
    //*****************************************************
    _populate_database() {

        const $=$database$get_database_list
        new Ajax().call("Retrieving Databases", $.COMMAND, {}, (ajax: Ajax) => {
            const res = ajax.getResponse()
            this.da.databases.gtree()!.inter.set_tree(this._servers_to_tree(res.servers))
            const databaseId = Param.p.system.data()!.server + Select_Company_Database.SEPARATE_SERVER_DATABASE+ Param.p.system.data()!.database
            this.da.databases.set_value(databaseId)
        })
    }
    //------------------------------------
    _servers_to_tree(servers: STObjectAny[]): CTreeItem[] {
        const tree: CTreeItem[] = []
        for (let i = 0; i < servers.length; i++) {
            const item = {
                code: servers[i].server_name,
                caption: servers[i].server_title, //+" ("+servers[i].server_name+")" ,
                children: this._databases_to_tree(servers[i].server_name, servers[i].server_databases)
            }
            tree.push(item as CTreeItem)
        }
        return tree
    }
    //------------------------------------
    _databases_to_tree(server_code:string, databases: STObjectAny[]): CTreeItem[] {
        const tree: CTreeItem[] = []
        for (let i = 0; i < databases.length; i++) {
            const item = {
                code: server_code +Select_Company_Database.SEPARATE_SERVER_DATABASE+databases[i].database_name,
                caption: databases[i].database_name,
            }
            tree.push(item as CTreeItem)
        }
        return tree
    }
    //*****************************************************
    _database_clicked_event = (event: STObjectAny | STNull, gadget: Gadget) => {
        const database_id = gadget.get_value()
        const pair = database_id.split(Select_Company_Database.SEPARATE_SERVER_DATABASE)
        if (pair.length==2) {

            const request: STAjaxPacket = {}
            const $=$database$select_database
            request[$.I_SERVER] = pair[0]
            request[$.I_NAME] = pair[1]
            new Ajax().call("Selecting Database", $.COMMAND, request, (ajax) => {
                if (ajax.ok()) {
                    const select_company_attach = this.da.select_company.get_attach_object() as unknown as Select_Company_Attach
                    select_company_attach.reset_and_render()
                    Gadgets.inst().forEach(Gadgets.LEVEL_DEEP, (gadget) => {
                        if (gadget.isGAttach()) {
                            const att = gadget.get_attach_object()
                            if (att instanceof Select_Company_Attach) {
                                (att as Select_Company_Attach).reset_and_render()
                            }
                        }
                    })
                    this.da.select_company.activate_rendering()
               }
            })
        } else Log.alert(T.t("Node server was not found."))
    }
    //*****************************************************
}