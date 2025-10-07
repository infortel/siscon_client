import Gadget from "../../Gadget"

export default class DTabs {
    private _active_index=0
    //*************************************************************************
    private _gadget:Gadget

    //*************************************************************************
    constructor(gadget:Gadget) {
        this._gadget = gadget
    }
    //*************************************************************************
    public get_active_index():number {
        if (this._gadget.get_children().length==0) return -1
        if (this._active_index>=this._gadget.get_children().length) return 0
        return this._active_index
    }
    //*************************************************************************
    public set_active_index(index:number):void {
        this._active_index=index
    }
    //*************************************************************************
    public get_active_child():Gadget|null {
        const ai=this.get_active_index()
        if (ai<0) return null
        return this._gadget._children[ai]
    }
    //*************************************************************************
}