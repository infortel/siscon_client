import GObject from "./GObject";

export type TKeyDownEvent = (event: Event) => void

export class KeyManagement {
    //*********************************************************
    public static KEY_ESCAPE = 27;
    public static KEY_DELETE = 46;
    //*********************************************************
    private static _instance:KeyManagement
    private _onkeydown_event: TKeyDownEvent | null = null
    private _shift_key_down: boolean = false;
    private _alt_key_down: boolean = false;
    private _ctrl_key_down: boolean = false;
    //*********************************************************
    constructor() {
        KeyManagement._instance=this
        this._initialize()
    }
    //*********************************************************
    public static inst():KeyManagement {
        if (!KeyManagement._instance) new KeyManagement()
        return KeyManagement._instance
    }
    //*********************************************************
    _initialize() {
        document.addEventListener("keydown", this._handleKeyDown)
        document.addEventListener("keyup", this._handleKeyUp)
    }
    //*********************************************************
    //*********************************************************
    //*********************************************************
    //*********************************************************
    // Event handling.
    //*********************************************************
    _handleKeyDown(event: Event) {
        this._shift_key_down = (event as unknown as React.KeyboardEvent).shiftKey
        this._alt_key_down = (event as unknown as React.KeyboardEvent).altKey
        this._ctrl_key_down = (event as unknown as React.KeyboardEvent).ctrlKey
        if (GObject.isValid(KeyManagement.inst()._onkeydown_event)) {
            KeyManagement.inst()._onkeydown_event!(event)
        }
    }
    //*********************************************************
    _handleKeyUp(event: Event) {
        this._shift_key_down = (event as unknown as React.KeyboardEvent).shiftKey
        this._alt_key_down = (event as unknown as React.KeyboardEvent).altKey
        this._ctrl_key_down = (event as unknown as React.KeyboardEvent).ctrlKey
    }
//*********************************************************
    set_keydown_event(onkeydown: TKeyDownEvent) {
        this._onkeydown_event = onkeydown
    }
//*********************************************************
    is_shift_key(): boolean { return this._shift_key_down }
    is_alt_key(): boolean { return this._alt_key_down }
    is_ctrl_key(): boolean { return this._ctrl_key_down }
//*********************************************************
    get_keyCode(event: Event): number {
        return (event as unknown as React.KeyboardEvent).keyCode
    }
//*********************************************************
}