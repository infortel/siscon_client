export class Utility {
    private static startTime:number=Date.now() as number
    //*************************************************************************
    public static timestamp():string {
        const period=(Date.now()-Utility.startTime)/1000 as number
        let timestamp = '[' + period + '] ';
        return timestamp
    }
    //*************************************************************************
    public static timestamp_unique_string():string {
        const period=(Date.now()-Utility.startTime)/1000 as number
        let timestamp = ""+period;
        return timestamp
    }
    //*************************************************************************
}