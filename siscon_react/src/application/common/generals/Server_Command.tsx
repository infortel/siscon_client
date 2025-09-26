
export type O_database_get_company_list = {
    baseid: string,
    server: string,
    database: string,
    logo_width: number,
    logo_height: number,
    companies: O_database_get_company_list__company[] 
}
export type O_database_get_company_list__company = {
    selected: string,
    code: string,
    name: string,
    logo_url: string,
}

export default class Server_Command {

    //***************************************************************************
    static general_files_Read_relative_file = "general.files.read_relative_file"
    static general_files_File_list = "general.files.file_list"
    static general_files_Save_file = "general.files.save_file"
    static general_files_Create_directory = "general.files.create_directory"
    static general_files_Delete_file = "general.files.delete_file"
    //***************************************************************************
    static general_profile_Get_profile = "general.profile.get_profile"
    static general_profile_Save_profile = "general.profile.save_profile"
    //***************************************************************************
    static general_search_Master = "general.search.master"
    //***************************************************************************
    static general_system_Evaluate= "general.system.evaluate"
    static general_system_Logout = "general.system.logout"
    static general_system_Change_password="general.system.change_password"
    //***************************************************************************
    static database_get_company_list = "database.get_company_list"
    static database_get_database_list = "database.get_database_list"
    static database_select_company = "database.select_company"
    static database_select_database = "database.select_database"
    //***************************************************************************
    static report_get_list = "report.get_list"
    static report_update_list = "report.update_list"
    //***************************************************************************
    static master_read = "master.read"
    //***************************************************************************
    
}
