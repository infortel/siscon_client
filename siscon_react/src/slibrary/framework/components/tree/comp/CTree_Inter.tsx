import GString from "../../../../general/GString"
import Log from "../../../../general/Log"
import { STElement, STNull, STObjectAny } from "../../../../general/STypes"
import SEvaluate from "../../../../sevaluations/SEvaluate"
import CTree from "./CTree"

export type TListFromServer = {
    indicator: string           //Personal=+, Original=-
    name: string                //Form filename
    title: string               //Title name of the form
}

export type CTreeItem = {
    //This definition is for reference only and it is not used.
    code: string,               //Original assigned Data
    caption: string,            //Original assigned Data
    children: CTreeItem[] | null
    expanded: boolean    
    visible:boolean
}
//**********************************************************
export default class CTree_Inter {
    _com!:CTree
    _tree: CTreeItem[] = []
    constructor(component: CTree) {
        this._com=component
    }
    //**********************************************************
    get_tree(): CTreeItem[] {
        return this._tree
    }
    //*****************************************************
    set_tree(tree:STObjectAny[]) {
        this._tree = tree as CTreeItem[]
        this.expand_all(false, -1)
        this.expand_all(true,0)
    }
    //*****************************************************
    static is_group(item: STObjectAny) {
        if (item.children) return true
    }
    //*****************************************************
    populate_tree_from_tree(tree_list: CTreeItem[]) {
        this._tree = tree_list
        this._com.gadget.render()
    }
    //*****************************************************
    populate_tree_from_list(list: TListFromServer[]) {
        this._tree=[]
        try {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                console.log(item.indicator + " / " + item.title + " / " + item.name)
                const codes = item.name.split("/")
                let trs: CTreeItem[] = this._tree
                let codeDir=""
                for (let x = 0; x < codes.length; x++) {
                    codeDir += codes[x] + "/"
                    let tr: CTreeItem = this._get_branch(trs, codeDir)
                    if (x < codes.length-1) {
                        tr.caption = codes[x]
                        tr.code = codeDir
                        if (!tr.children) tr.children = []
                        trs = tr.children
                    } else {
                        tr.caption = SEvaluate.Str(item.title)
                        tr.code=item.name
                    }                  
                }
            }
            this._com.gadget.render()
        } catch (e) {
            Log.logExc("GTree_Collection.populate_tree_from_list", e)
        }
    }
    //-----------------------------
    _get_branch(tree: CTreeItem[], code:string) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].code===code) return tree[i]
        }
        const tr = {} as CTreeItem
        tree.push(tr)
        return tr        
     }
    //*****************************************************
    expand_all(logic: boolean, depth: number) {
        this._expand_all(this._tree, logic, depth, 0)
        this._com.gadget.render()
    }
    _expand_all(items: CTreeItem[], logic: boolean, depth: number, level: number) {
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const item: CTreeItem = items[i]
                item.visible=true
                if (CTree_Inter.is_group(item)) {
                    item.expanded = logic
                }
                if (item.children) if ((level < depth) || (depth < 0)) {
                    this._expand_all(item.children, logic, depth, level + 1)
                }
            }
        }
    }
    //*****************************************************
    search(text: string | STNull) {
        if (GString.isStringWithText(text)) {
            const count = this._search(text!.toLowerCase(), this._tree)
        } else {
            this.expand_all(true, 1)
        }
        this._com.gadget.render()
    }
    _search(text: string, items: CTreeItem[]):number {
        let count = 0
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const item: CTreeItem = items[i]

                if (CTree_Inter.is_group(item)) {
                    let thisCount = 0
                    if (item.children) thisCount+=this._search(text, item.children)
                    item.expanded = (thisCount > 0)
                    item.visible = (thisCount > 0)
                    count += thisCount
                } else {
                    let sel = (item.caption.toLocaleLowerCase().search(text) >= 0)
                    item.visible = sel
                    if (sel) count++
                }
            }
        }
        return count
    }
    //**********************************************************
    get_node(child_code: string) {
        return this._get_node(this._tree,child_code)
    }
    _get_node(items: CTreeItem[], child_code: string):CTreeItem|STNull {
        let result=null
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.code === child_code) result=item
            else if (item.children) result = this._get_node(item.children, child_code)
            if (result) break
        }
        return result
    }
    //**********************************************************
    get_parent_node(child_node_code: string): CTreeItem | STNull {
        for (let i = 0; i < this._tree.length; i++) {
            const item = this._tree[i]
            if (item.code === child_node_code) return item
            else {
                if (item.children) if (this.get_node(child_node_code)) return item
            }
        }
        return null
    }
    //**********************************************************
}