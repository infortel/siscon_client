import Log from "../general/Log";
import GString from "../general/GString";
import { STException, STNull, STObjectAny } from "../general/STypes";
import SMetrics from "../general/SMetrics";
import SCookie from "../general/SCookie";
import Gen from "../general/Gen";

export default class LServer {
    //*****************************************************
    static _instance: LServer
    //***************************************************************************
    static inst(): LServer {
        return LServer._instance
    }
    //***************************************************************************
    //*****************************************************
    constructor() {
        LServer._instance=this
    }
    //*****************************************************
    //, credentials: 'include' //To enable session identification on server (development).
    call(title: string, data: STObjectAny, report_error: boolean, onResponse: (error: string | null, response: STObjectAny) => void) {

        const requestMetadata: STObjectAny = {
            method: "POST"
            , headers: {
                "Content-Type": "application/json"
            }
            , body: JSON.stringify(data)
        };

        //Send sessionid if developing in different site.
        if (Gen.DEVELOPMENT()) {
            const session_id = SCookie.getCookie(SCookie.DEVELOPMENT_SESSION_ID)
            if (GString.isStringWithText(session_id)) {
                requestMetadata.headers = { ...requestMetadata.headers, session_id: session_id }
            }
        }

        const url :string= SMetrics.inst().get_server_url_service()

        try {
            fetch(url, requestMetadata)
                .then(response => {
                    if (response.ok) {
                        let json_response: STObjectAny = response.json();
                        if (json_response.error) {
                            if (report_error) Log.log(title + " / " + json_response.error)
                            if (onResponse) onResponse(title + " / " + json_response.error, {})
                        } else {
                            return json_response
                        }
                    } else return ("Network error: " + response.status)
                })
                .then(
                    (response_data => {
                        if (onResponse) onResponse(null, response_data as STObjectAny)
                     }))
                .catch((error) => {
                    let err = "Title=" + title + " / Error=" + error + " / Url=" + url
                    if (report_error) Log.log(err)
                    if (onResponse) onResponse(err, {})
                })
        } catch (e1) {
            if (report_error) Log.logExc("Error calling server: " + url +" / "+title + " / " ,e1)
        }
    }
    //*****************************************************

}

