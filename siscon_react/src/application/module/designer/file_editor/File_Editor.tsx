import Gadget from "../../../../slibrary/framework/gadget/Gadget"
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows"
import Page_Name from "../../../common/generals/Page_Name"
import File_Editor_Commands from "./File_Editor_Commands"

export type Tda = {
    content:Gadget
}

export class File_Editor {
public da!:Tda
//*************************************************************************
constructor() {
    const commands=new File_Editor_Commands(this)
    GPopup_Windows.open("File Editor", Page_Name.DESIGNER_FILE_EDITOR, commands, true, (popup_window) => {
        //Nothing to do
        this.da = popup_window!.gadgets.da as Tda
        commands.c_read()
    })  
}
//*************************************************************************
}