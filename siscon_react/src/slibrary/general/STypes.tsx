import * as React from "react"
import Gadget from "../framework/gadget/Gadget"

export type STNull = null | undefined

export type STObjectAny = {[key: string]: any }

export type STException = any

export type STElement = JSX.Element  //React.Component

export type STValue = any

export type STCallBack_Basic = () => void
export type STCallBack_String = (result:string|STNull) => void
export type STCallBack_Error_Object = (error: string | null, result: STObjectAny) => void
export type STCallBack_Success = (success: boolean) => void
export type STCallBack_Error_String = (error:string|null) => void
export type STGadget_event = (event: STObjectAny | STNull, gadget: Gadget) => void

/*
export type STGadget_event_mouse = (event: STObjectAny, gadget: Gadget) => void
export type STGadget_event_change = (event: STObjectAny, gadget: Gadget) => void
export type STGadget_event_command = (event: STObjectAny, gadget: Gadget) => void

export type STComponentChangeEvent = React.ChangeEvent<HTMLInputElement>

export type STComponentMouseEvent = React.MouseEvent<HTMLDivElement>
export type STComponentMouseEventButton = React.MouseEvent<HTMLButtonElement>
export type STComponentMouseEventSelect = React.MouseEvent<HTMLSelectElement>
export type STComponentMouseEventLabel = React.MouseEvent<HTMLLabelElement>

export type STComponentFocusEvent = React.FocusEvent<HTMLInputElement>
export type STComponentBlurEvent = React.FocusEvent<HTMLInputElement> //This is the same as focus event.
export type STComponentSelectEventxxx = React.MouseEventHandler<HTMLSelectElement>
*/

export class STypes {
    static STEmptyElement: JSX.Element = <></>
}

export type STAjaxPacket = { [key: string]: any}

export type STConstructor<T = any> = new (...args: any[]) => T;
export type STClass<T = any> = InstanceType<STConstructor<T>>;

export type STFunction0= (() => void)
export type STFunction=<T>(arg: T) => T;
