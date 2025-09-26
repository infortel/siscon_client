export default class GArray {
//*****************************************************
    static delete_element(array: any[], index: number) {
    const res = []
    for (let i = 0; i < array.length; i++) {
        if (i != index) res.push(array[i])
    }
    return res
}
//*****************************************************
    static get_index(array: any, item: any) {
        if (!Array.isArray(array)) return -1

        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) return i
        }
        return -1
    }
}
//*****************************************************
