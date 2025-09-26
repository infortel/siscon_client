import Log from "./Log";

type STTime = { days: number, hours: number, minutes: number, seconds: number, milliseconds: number }

export default class STime {
    //*****************************************************
    static UNIT_DAYS="days"
    static UNIT_HOURS="hours"
    static UNIT_MINUTES="minutes"
    static UNIT_SECONDS="seconds"
    static UNIT_MILLISECONDS="milliseconds"
    //*****************************************************
    time:number=0
    //*****************************************************
    constructor() {
        //if (_time) this.time=_time
    }
    //*****************************************************
    get_in_unit(unit:string):number {
        let value=this.time
        if (unit===STime.UNIT_MILLISECONDS) return this.time
        else if (unit===STime.UNIT_SECONDS) return this.time/1000
        else if (unit===STime.UNIT_MINUTES) return this.time/60000
        else if (unit===STime.UNIT_HOURS) return this.time/3600000
        else if (unit===STime.UNIT_DAYS) return this.time/86400000
        return 0
    }
    //*****************************************************
    set_in_unit(value:number, unit:string):void {
        if (unit===STime.UNIT_MILLISECONDS) this.time=value
        else if (unit===STime.UNIT_SECONDS) this.time=value*1000
        else if (unit===STime.UNIT_MINUTES) this.time=value*60000
        else if (unit===STime.UNIT_HOURS) this.time=value*3600000
        else if (unit===STime.UNIT_DAYS) this.time=value*86400000
    }
    //*****************************************************
    get_time_split_array():number[] {
        let timea=[0,0,0,0,0] //MSec,Sec,Min,Hour,Days
        let div=[1000,60,60,24,1000000]
        let value=this.time
        for (let i=0; i<timea.length; i++) {
            timea[i]=value % div[i]
            value=Math.trunc(value/div[i])
        }
        return timea
    }
    //*****************************************************
    get_time_split_set(): STTime {
        let time=this.get_time_split_array()
        return {days:time[4], hours:time[3], minutes:time[2], seconds:time[1], milliseconds:time[0]}
    }
    //*****************************************************
    set_time_from_string(format:string, st:string):void {
        try {
            if (!format) format="hh:mm:ss"
            let sttime = st.split(":")
            let sformat= format.split(":")
            let sum=0
            for (let i=0; i<sttime.length; i++) {
                if (sformat[i].startsWith("d")) sum+=parseInt(sttime[i])*86400000
                if (sformat[i].startsWith("h")) sum+=parseInt(sttime[i])*3600000
                if (sformat[i].startsWith("m")) sum+=parseInt(sttime[i])*60000
                if (sformat[i].startsWith("s")) sum+=parseInt(sttime[i])*1000
            }
            this.time=sum

            //if (sttime.length === 2) {
            //    this.time = (parseInt(sttime[0])*3600000)+(parseInt(sttime[1])*60000)
            //} else if (sttime.length === 3) {
            //    this.time = (parseInt(sttime[0])*3600000)+(parseInt(sttime[1])*60000)+(parseInt(sttime[1])*1000)
            //}
        } catch (err) {
            //Log.log("set_time_string",e)
        }
    }
    //*****************************************************
    format(format:string) :string {
        let aformat=format.split;
        let ti=this.get_time_split_set()
        let result=format.replace("dd",(""+ti.days))
        result=result.replace("hh",this._toStringNumber(ti.hours,2))
        result=result.replace("mm",this._toStringNumber(ti.minutes,2))
        result=result.replace("ss",this._toStringNumber(ti.seconds,2))
        return (result)
            //this._toStringNumber((ti.days*24)+ti.hours,2)
            //+":"
            //+this._toStringNumber(ti.minutes,2)
        //)
    }
    //**************************
    _toStringNumber(int:number,len:number):string {
        let st=""+int
        while (st.length<len) st="0"+st
        return st
    }
    //*****************************************************
}