import Gadget_drag from "../gadget/Gadget_drag"

export default class Mouse_Handle {
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    static x: number = 0
    static y: number = 0
    //*****************************************************
    //static handle mouse move.
    static initialize() {
        document.addEventListener("mousemove", Mouse_Handle.handleMouseMove)
        document.addEventListener("mouseup", Mouse_Handle.handleMouseUp)
    }
    //*****************************************************
    static handleMouseMove(event: MouseEvent) {
        Gadget_drag.event_global_mouse_move(event.clientX, event.clientY)
    }
    //*****************************************************
    static handleMouseUp(event: MouseEvent) {
        Gadget_drag.event_global_mouse_up()
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
}