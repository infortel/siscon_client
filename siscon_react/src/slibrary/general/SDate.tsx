import { STNull } from "./STypes"

export default class SDate {
    //*****************************************************
    date: Date = new Date()
    //*****************************************************
    constructor() {
    }
    //*****************************************************
    set_from_unit(value:number,unit:string):void {
        let time=[0,0,0,0,0] //MSec,Sec,Min,Hour,Days
        let div=[1000,60,60,24,1000000] //MSec,Sec,Min,Hour,Days
        let index=0
        if (unit==="milliseconds") index=0
        else if (unit==="seconds") index=1
        else if (unit==="minutes") index=2
        else if (unit==="hours") index=3
        else if (unit==="days") index=4
        for (let i=index; i<time.length; i++) {
            time[i]=value % div[i]
            value=Math.trunc(value/div[i])
        }
        this.date.setHours(time[3],time[2], time[1],time[0])
    }
    //*****************************************************
    setFromString(stdate:string):Date {
        let arr = stdate.split(":")
        let time = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            if (i < arr.length) time[i] = parseInt(arr[i])
        }
        let date = new Date();
        date.setHours(time[0], time[1], time[2])
        return date
    }
    //*****************************************************
    //utc: Universal Time Coordinated
    format(format: string): string {
        return this.format_utc(format, false);
    }
   //*****************************************************
    //utc: Universal Time Coordinated
    format_utc(format:string, utc:boolean):string {
        let MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        function ii(i:number, len:number):string {
            let s = i + "";
            len = len || 2;
            while (s.length < len) s = "0" + s;
            return s;
        }

        let y = utc ? this.date.getUTCFullYear() : this.date.getFullYear();
        format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
        format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
        format = format.replace(/(^|[^\\])y/g, "$1" + y);

        let M = (utc ? this.date.getUTCMonth() : this.date.getMonth()) + 1;
        format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
        format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
        format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M,0));
        format = format.replace(/(^|[^\\])M/g, "$1" + M);

        let d = utc ? this.date.getUTCDate() : this.date.getDate();
        format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
        format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
        format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d, 0));
        format = format.replace(/(^|[^\\])d/g, "$1" + d);

        let H = utc ? this.date.getUTCHours() : this.date.getHours();
        format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H, 0));
        format = format.replace(/(^|[^\\])H/g, "$1" + H);

        let h = H > 12 ? H - 12 : H == 0 ? 12 : H;
        format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h, 0));
        format = format.replace(/(^|[^\\])h/g, "$1" + h);

        let m = utc ? this.date.getUTCMinutes() : this.date.getMinutes();
        format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m, 0));
        format = format.replace(/(^|[^\\])m/g, "$1" + m);

        let s = utc ? this.date.getUTCSeconds() : this.date.getSeconds();
        format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s, 0));
        format = format.replace(/(^|[^\\])s/g, "$1" + s);

        let f = utc ? this.date.getUTCMilliseconds() : this.date.getMilliseconds();
        format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f, 0));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])f/g, "$1" + f);

        let T = H < 12 ? "AM" : "PM";
        format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
        format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

        let t = T.toLowerCase();
        format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
        format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

        let tz = -this.date.getTimezoneOffset();
        let K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
        if (!utc) {
            tz = Math.abs(tz);
            let tzHrs = Math.floor(tz / 60);
            let tzMin = tz % 60;
            K += ii(tzHrs, 0) + ":" + ii(tzMin, 0);
        }
        format = format.replace(/(^|[^\\])K/g, "$1" + K);

        let day = (utc ? this.date.getUTCDay() : this.date.getDay()) + 1;
        format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
        format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

        format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
        format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

        format = format.replace(/\\(.)/g, "$1");

        return format;
    };
    //*****************************************************
}