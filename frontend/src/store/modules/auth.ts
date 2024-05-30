import { setCookie, getCookie } from '../cookie';

/* 토큰 생성 */
export const createTokenHeader = (accessToken:string, refreshToken:string) => {
    return {
        headers: {
            'Authorization' : 'Bearer ' + accessToken,
            'RefreshToken' : 'Bearer ' + refreshToken
        }
    }
}

/* 토큰 체크 */
export const validToken = () => {

    let accessToken = '';
    let refreshToken = '';

    if(getCookie('accessToken') != undefined) { accessToken = getCookie('accessToken') } else { throw new Error('accessToken이 존재하지 않습니다.') };
    if(getCookie('refreshToken') != undefined) { refreshToken = getCookie('refreshToken') } else { throw new Error('refreshToken이 존재하지 않습니다.') };

    if(getCookie('accessToken') != undefined || getCookie('refreshToken') != undefined) {
        accessToken = getCookie('accessToken');
        refreshToken = getCookie('refreshToken');
    }

    return {accessToken, refreshToken};
}

/* 토큰 만료시간 계산 */
export const calculateRemainingTime = (expirationTime:number) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
}

/* 토큰값, 만료시간을 저장 */
export const LoginTokenHandler = (accessToken:string, refreshtoken:string, expirationTime:number) => {
    setCookie('accessToken', accessToken, {path:'/'});
    setCookie('refreshToken', refreshtoken, {path:'/'});
    setCookie('expirationTime', String(expirationTime), {path:'/'});
    const remaingTime = calculateRemainingTime(+ expirationTime);
    return remaingTime;
}

/* 재발급 토큰 설정 */
export const reissue = (response:any) => {
    if(response.headers.authorization != null && response.headers.authorization != '') {
        const newToken = response.headers.authorization.substring(7);
        setCookie('accessToken', newToken);
    }
}