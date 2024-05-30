import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from "store/configureStore";
import { naverLogin, kakaoLogin, logout } from "store/modules/user";

let logoutTimer:NodeJS.Timeout;

export interface kakaoParam {
  code : string,
  clientId : string,
  redirectUri : string
}

const OAuthLogin = (props:any) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const OAuth2 = async() => {
      

      /** 네이버 oauth2 요청 **/
      if(props.oauthType == 'NAVER') {
        const searchParams = new URLSearchParams(location.hash);
        const token = searchParams.get('#access_token'); // code 취득
        if(token != undefined && token != '') {
            const result = await dispatch(naverLogin(token));
            if(result.payload != undefined) {
              const expirationTime:number = result.payload.refreshTokenExpiresIn;
              const currentTime = new Date().getTime();
              const adjExpirationTime = new Date(expirationTime).getTime();
              const remainingDuration = adjExpirationTime - currentTime;
              logoutTimer = setTimeout(() =>{
                  dispatch(logout());
                  navigate('/', {replace: true});
              }, remainingDuration);
  
              navigate('/', {replace:true, state:logoutTimer});
          } else {
            console.log(result);
            alert('에러가 발생했습니다.');
            navigate('/');
          }
        }
      };

      /** 카카오 oauth2 요청 **/
      if(props.oauthType == 'KAKAO') {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code') || '';
        const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID || '';
        const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI || '';
        const param:kakaoParam = { clientId:clientId, code:code, redirectUri:redirectUri };

        const result = await dispatch(kakaoLogin(param));
        console.log('result ',result);
        if(result.payload != undefined) {
          const expirationTime:any = result.payload.refreshTokenExpiresIn;
          const currentTime = new Date().getTime();
          const adjExpirationTime = new Date(expirationTime).getTime();
          const remainingDuration = adjExpirationTime - currentTime;
          logoutTimer = setTimeout(() =>{
              dispatch(logout());
              navigate('/', {replace: true});
          }, remainingDuration);

          navigate('/', {replace:true, state:logoutTimer});
        } else {
            alert('에러가 발생했습니다.');
            navigate('/');
        }
      }
    }

    useEffect(() => {
      OAuth2();
    }, [])

  return (
    <>
    </>
  )
}

export default OAuthLogin;