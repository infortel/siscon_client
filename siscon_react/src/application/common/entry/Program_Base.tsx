import Commands from "../../../slibrary/framework/general/Commands";


export default class Program_Base {
    command_instance!: Commands;
    static _instance: Program_Base
    _program_name: string = ""
    //*********************************************************
    constructor(_program_name: string) {
        Program_Base._instance = this
        this._program_name = _program_name
     }
    //*********************************************************
    static inst(): Program_Base {
        return Program_Base._instance
    }
    //*********************************************************
    set_command_instance(command_instance: Commands) {
        this.command_instance = command_instance
    }
    //*********************************************************
    get_command_instance() {
        return this.command_instance
    }

//*********************************************************
}