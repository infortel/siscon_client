export default class SCookie {
    static DEVELOPMENT_SESSION_ID="session_id" 
    static setCookie365(cname:string, cvalue:any):void {
        SCookie.setCookieTime(cname,cvalue,365)
    }
    static setCookie(cname: string, cvalue: string):void {
        document.cookie = cname + "=" + cvalue + ";;path=/";
    }
    static setCookieTime(cname: string, cvalue: string, exdays: number): void {
        let expires=""
         if (exdays) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            expires = "expires=" + d.toUTCString();
        }
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname:string) :any {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
}