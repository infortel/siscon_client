export class $transaction$write_batch {
    static COMMAND:string="transaction.write_batch"

    static I_TRANSACTION_TYPE:string="transaction_type"
    static I_TARGET_PROCESS:string="target_process"
    static I_METHOD:string="method"
    static I_METHOD__RECURRING:number=1
    static I_METHOD__CONTEXT:number=2
    static I_METHOD__SCRIPT:number=3
    static I_METHOD__SCRIPT_FILE:number=4
    static I_CONTEXT:string="context"
    static I_FILENAME:string="filename"
    static I_FINAL_PROCESS:string="final_process"
    static I_PREDEFINED:string="predefined"
    static I_PREDEFINED_SETTING:string="setting"
    static I_PROG_PARAMETERS:string="prog_parameters"
    static I_SCRIPT_FILE:string="script_file"
    static I_PARAMETERS_SETTING:string="setting"
    static I_LEDGER:string="ledger"
    static I_LEDGER_ID_:string="id_"
    static I_LEDGER_ID_ROW:string="row"
    static I_LEDGER_ID_ROW_CODE:string="code"
    static I_LEDGER_ID_ROW_AMOUNT:string="amount"
    static O_LOG:string="log"
    static O_COUNT:string="count"
    static O_ERROR_COUNT:string="error_count"
    static O_FIRST_NUMBER:string="first_number"
    static O_LAST_NUMBER:string="last_number"
    static O_LEDGER:string="ledger"
    static O_LEDGER_ID_:string="id_"
    static O_LEDGER_ID_TITLE:string="title"
    static O_LEDGER_ID_TOTAL:string="total"
    static O_LEDGER_ID_ROW:string="row"
    static O_LEDGER_ID_ROW_CODE:string="code"
    static O_LEDGER_ID_ROW_DESCRIPCION:string="description"
}