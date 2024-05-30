import { Cookies } from "react-cookie";

const cookie = new Cookies()

export const setCookie = (name:string, value:string, option?:any) => {
    return cookie.set(name,value, {...option});
}

export const getCookie = (name:string) => {
    return cookie.get(name);
}

export const removeCookie = (name:string, option?:any) => {
    return cookie.remove(name, option);
}