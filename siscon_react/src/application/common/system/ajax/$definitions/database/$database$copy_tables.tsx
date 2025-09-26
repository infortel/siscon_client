export class $database$copy_tables {
    static COMMAND:string="database.copy_tables"

    static I_SOURCE_SERVER:string="server"
    static I_SOURCE_DATABASE:string="database"
    static I_DESTINATION_SERVER:string="destination_server"
    static I_DESTINATION_DATABASE:string="destination_database"
    static I_DESTINATION_COMPANY_NAME:string="destination_company_name"
    static I_TABLES:string="tables"
    static I_TABLES_NAME:string="table_name"
    static I_OVERWRITE:string="overwrite"
    static O_MESSAGE:string="message"
    static O_TABLES_EXISTED_COUNT:string="tables_existed_count"
}