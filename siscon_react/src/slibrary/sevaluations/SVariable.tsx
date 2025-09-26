export default class SVariable {
    //***************************************************************************
    static combine(textArr: string[], index:number): string {
        let result = ""
        for (let i = index; i < textArr.length; i++) {
            if (i == index) result += textArr[i]
            else result += "." + textArr[i]
        }
        return result
    }
    //***************************************************************************
}