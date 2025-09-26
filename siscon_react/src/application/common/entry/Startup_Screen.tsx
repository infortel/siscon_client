import * as React from "react";
import {Component} from "react"
import Gadgets from "../../../slibrary/framework/gadgets/Gadgets";
import { STObjectAny } from "../../../slibrary/general/STypes";
import Param from "../Param";

export default class Startup_Screen extends Component {
    constructor(props:STObjectAny) {
        super(props)
    }
    render() {
        //Designed: https://www.3dgifmaker.com/Heartbeat
        const source = "images/general/logo_loading.gif"
        return (
            <table key={Gadgets.generate_key()} style={{ display: "flex", alignItems: "center", justifyContent: "center", color:"#444444" }}>
                <tbody>
                <tr><td height="40"></td></tr>
                <tr><td style={{textAlign: "center"}}><b><label style={{fontSize: "30px"}}>SISCON</label></b></td></tr>
                <tr><td height="20"></td></tr>
                <tr><td style={{textAlign: "center"}}><img src={source} width={200} height={200}/></td></tr>

                <tr><td height="20"></td></tr>
                    <tr><td style={{ textAlign: "center" }}><label style={{ fontSize: "20px" }}>Loading Program ...</label></td></tr>
                    </tbody>
            </table>
        )
    }
}