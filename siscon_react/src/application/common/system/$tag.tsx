export class $tag {
        //**********************************************************************
        static  X_ARRAY="array"
        //static  GENERAL_DATA="data"
        //**********************************************************************
        static  TAG_GENERAL_DATA="data"
        static  TAG_GENERAL_ROW=$tag.X_ARRAY //"row"

        static  XML_HEADER="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    
        static  I_REQUEST="request"                     //XML General RESPUESTA
        static  I_COMMAND="command"
        static  I_GROUP="group"
        static  I_CALL_TYPE="call_type"
        static  I_BINARY_DESCRIPTOR="binary_descriptor"
        static  I_BINARY_DESCRIPTOR__NAME="name"
        static  I_BINARY_DESCRIPTOR__TABLE="table"
        static  I_BINARY_DESCRIPTOR__FIELD="field"
        static  I_PREDEFINED_COMPANY="predefined_company"

        static  O_RESPONSE="response"                     //XML General RESPUESTA
        
        static  O_ERROR="error"                           //Errores.
        static  O_ALERT="alert"                           //Alerts.
        static  O_UNTERMINATED="unterminated"                       //Generate with thread.
        static  O_PROCESSID="processid"
        static  O_ACCESS_REQUIRED="access_required"

        static  O_NEW_SESSION="new_session"             //New Session in force.
        
        static  O_RESULT="result"
        static  O_BASEID="baseid"                      //Id identifying database and company to detect any changes.
        
        static  I_TRACE_SQL="trace_sql"                //Used to indicate a trace with SQL commands.
        static  O_TRACE_SQL="trace_sql"                //Used to indicate a trace with SQL commands.
        static  O_TRACE_SQL_QUERY=$tag.X_ARRAY //"query"              //Used to indicate a trace with SQL commands.
    
        static  I_TRACE_SCRIPT="trace_script"                //Used to indicate a trace with SCRIPT commands.
        static  O_TRACE_SCRIPT="trace_script"                //Used to indicate a trace with SCRIPT commands.
        static  O_TRACE_SCRIPT_TEXT=$tag.X_ARRAY //"script"                //Used to indicate a trace with SCRIPT commands.
        static  O_TRACE_SCRIPT_VARIABLES="variables"                //Used for variables
        static  O_TRACE_SCRIPT_VARIABLES_VARIABLE="variable"                //Used for variables
        static  O_TRACE_SCRIPT_VARIABLES_VARIABLE_NAME="name"                //Used for variables
        static  O_TRACE_SCRIPT_VARIABLES_VARIABLE_VALUE="value"                //Used for variables
        static  O_TRACE_SCRIPT_EQUATIONS="equations"
        static  O_TRACE_SCRIPT_EQUATIONS_LEVEL='\t'
        static  O_TRACE_SCRIPT_EQUATIONS_LEVEL_MAX=100
        
        static  I_TRACE_MESSAGE="trace_message"                //Used to indicate a trace with Messages
        static  O_TRACE_MESSAGE="trace_message"                //Used to indicate a trace with Messages
        static  O_TRACE_MESSAGE_TEXT="message"                //Used to indicate a trace with Messages
    
        static  I_AUDIT_TIME_MILISECONDS="audit_time_seconds"
        static  I_AUDIT_PAGE="audit_page"
        //**********************************************************************
        static  I_PARAMETERS="parameters"
        //**********************************************************************
}