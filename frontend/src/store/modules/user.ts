import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { removeCookie, getCookie } from 'store/cookie';
import { LoginTokenHandler } from 'store/modules/auth'
import { kakaoParam } from "components/auth/OAuthLogin";

const initialState = {
    email: '',
    password: '',
    phone: '',
    nickname: '',
    loading: '',
    isLogin: false,
    role: '',
    zipNo: '',
    address: '',
    addressDetail: ''
};

interface Token {
    grantType: string,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number
}

export interface User {
    email: string,
    password: string,
    phone: string,
    nickname: string,
    loading: string,
    isLogin: boolean,
    role: string,
    zipNo: string,
    address: string,
    addressDetail: string
}

export interface emailAuth {
    email: string,
    authCode: string
}

export interface updatePassword {
    email: string,
    password: string
}

interface createAccount {
    email: string,
    path: string
}

interface Token {
    grantType: string,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number
}

const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        /** 로그인 **/
        builder.addCase(login.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.email = action.meta.arg.email;
                state.nickname = action.meta.arg.nickname;
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });

        /** 로그아웃 **/
        builder.addCase(logout.fulfilled, (state) => {
            state.email = '';
            state.nickname = '';
            state.isLogin = false;
            state.role = '';

            return state;
        });

        /** 사용자 조회 성공 **/
        builder.addCase(userInfo.fulfilled, (state, action) => {
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.nickname = action.payload.nickname;
            state.role = action.payload.role;
            state.zipNo = action.payload.zipNo;
            state.address = action.payload.address;
            state.addressDetail = action.payload.addressDetail;

            return state;
        });

        /** 사용자 조회 실패 **/
        builder.addCase(userInfo.rejected, (state, action) => {
            state.email = '';
            state.phone = '';
            state.nickname = '';
            state.role = '';
            state.isLogin = false;
            state.zipNo = '';
            state.address = '';
            state.addressDetail = '';

            return state;
        });

        /** 사용자 값 변경 성공 **/
        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            state.phone = action.meta.arg.phone;
            state.nickname = action.meta.arg.nickname;
            state.zipNo = action.meta.arg.zipNo;
            state.address = action.meta.arg.address;
            state.addressDetail = action.meta.arg.addressDetail;

            return state;
        });
        
        /** 네이버 로그인 **/
        builder.addCase(naverLogin.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });
        /** 카카오 로그인 **/
        builder.addCase(kakaoLogin.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });
    },
})

/* 회원가입 */
export const signup = createAsyncThunk('SIGNUP', async (user:User) => {
    try{
        const URL = process.env.REACT_APP_API_URL + "/auth/signup";
        const response = await axios.post(URL, user);
        
        return response.data;
    } catch(error) {
        console.log('회원가입 에러발생 : ' + error);
        return undefined;
    }
}); 

/* 로그인 */
export const login = createAsyncThunk('LOGIN', async (user:User) => {
    try {
        const URL = process.env.REACT_APP_API_URL + '/auth/login';
        const response = await axios.post(URL, user);
        if(response.status == 200) {
            const token:Token = response.data;
            LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
        }

        return response.data;
    } catch(error) {
        console.log('로그인 에러발생 : '+ error);
        return undefined;
    }
});

/* 로그아웃 */
export const logout = createAsyncThunk('LOGOUT', async () => {
    try {
        const URL = process.env.REACT_APP_API_URL + '/auth/logout';
        const response = await axios.post(URL, []);
        if(response.status == 200) {
            console.log('[로그아웃 성공]');
            removeCookie('accessToken', {path:'/'});
            console.log('accessToken', getCookie('accessToken'));
            removeCookie('refreshToken', {path:'/'});
            removeCookie('expirationTime', {path:'/'});
        }

        return response.data;
    } catch(error) {
        console.error('로그아웃 에러발생 : '+error);
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('expirationTime');

        if(logoutTimer != null && logoutTimer != undefined){
            clearTimeout(logoutTimer);
        }

        return undefined;
    }
});

/* 사용자 정보 조회 */
export const userInfo = createAsyncThunk('USER_INFO', async () => {
    const URL = process.env.REACT_APP_API_URL + '/member/me';
    const response = await axios.get(URL);
    return response.data;
});

/* 사용자 전체 정보 조회 */
export const allUserInfo = createAsyncThunk('ALL_USER_INFO', async () => {
    try {
         const URL = process.env.REACT_APP_API_URL + '/member/findAll';
         const response = await axios.get(URL);
         return response.data;

    } catch(error) {
        console.error('에러발생 :'+ error);
    }
});

/* 사용자 정보 수정 */
export const updateUserInfo = createAsyncThunk('UPDATE_USER_INFO', async (user:User) => {
    const URL = process.env.REACT_APP_API_URL + '/member/update';
    const response = await axios.post(URL, user);
    return response.status;
});

/* 사용자 패스워드 변경 */
export const updateUserPassword = createAsyncThunk('UPDATE_USER_PASSWORD', async ({email, password}:updatePassword) => {
    const URL = process.env.REACT_APP_API_URL + '/member/updatePassword';
    const response = await axios.post(URL, null, {params: {email:email, password:password}});
    return response.data;
});

/* 사용자 이메일 존재 확인 */
export const isExistEmail = createAsyncThunk('IS_EXIST_EMAIL', async ({email, path}:createAccount) => {
    let URL = ''
    if('' == path) {
        URL = process.env.REACT_APP_API_URL + '/auth/checkEmail?email='+email;
    } else {
        URL = process.env.REACT_APP_API_URL + '/auth/checkEmail?email='+email+'&path='+path;
    }
    const response = await axios.get(URL);
    return response.data;
});

/* 이메일로 인증코드 전송 */
export const verificationRequests = createAsyncThunk('VERIFICATION_REQUESTS', async (email:string) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/verificationRequests?email='+email;
    const response = await axios.get(URL);
});


/* 입력한 인증코드로 인증 */
export const verifications = createAsyncThunk('VERIFICATIONS', async ({email, authCode}: emailAuth) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/verifications';
    const response = await axios.post(URL, null, {params: {email:email, authCode:authCode}});

    return response.data;
});

/* 네이버 로그인 */
export const naverLogin = createAsyncThunk('NAVER_LOGIN', async (token:string) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/naverLogin?token='+token;

    const response = await axios.post(URL);
    if(response.status == 200) {
        const token:Token = response.data;
        LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
    }
    return response.data;

});

/* 카카오 로그인 */
export const kakaoLogin = createAsyncThunk('KAKAO_LOGIN_GET_TOKEN', async (param:kakaoParam) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/kakaoLogin';

    const response = await axios.post(URL, param);
    if(response.status == 200) {
        console.log('2');
        const token:Token = response.data;
        LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
    }
    return response.data;
});

export let logoutTimer:NodeJS.Timeout;
export default userSlice.reducer;
