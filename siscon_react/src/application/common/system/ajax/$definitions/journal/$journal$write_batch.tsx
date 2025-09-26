export class $journal$write_batch {
    static COMMAND:string="journal.write_batch"

    static I_METHOD:string="method"
    static I_METHOD__RECURRING:number=1
    static I_METHOD__CONTEXT:number=2
    static I_METHOD__SCRIPT:number=3
    static I_METHOD__SCRIPT_FILE:number=4
    static I_CONTEXT:string="context"
    static I_FILENAME:string="filename"
    static I_SCRIPT_FILE:string="script_file"
    static I_FINAL_PROCESS:string="final_process"
    static I_PREDEFINED:string="predefined"
    static I_PREDEFINED_SETTING:string="setting"
    static I_PROG_PARAMETERS:string="prog_parameters"
    static I_PARAMETERS_SETTING:string="setting"
    static O_LOG:string="log"
    static O_COUNT:string="count"
    static O_ERROR_COUNT:string="error_count"
    static O_FIRST_NUMBER:string="first_number"
    static O_LAST_NUMBER:string="last_number"
}