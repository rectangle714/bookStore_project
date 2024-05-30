import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, InputAdornment } from '@mui/material';
import Styles from '../../styles/auth/LoginForm.module.css';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { Container } from "@mui/joy";
import { useAppDispatch } from "store/configureStore";
import { User, login, logout } from "store/modules/user";

let logoutTimer:NodeJS.Timeout;
declare global {
    interface Window {
        naver: any;
    }
}

const LoginForm = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const kakaoLoginUrl = process.env.REACT_APP_KAKAO_LOGIN_URL;
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const user = useRef<User>({ 
        email: '', password: '', nickname: '', phone: '', loading: '', 
        isLogin: false, role: '', zipNo:'', address: '', addressDetail:'' 
    });
    const [loginText, setLoginText] = useState('');

	const naverRef = useRef<any>(null);

    const NaverLogin = () => {
        const { naver } = window;
      
        const naverLogin = new naver.LoginWithNaverId(
          {
            clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
            callbackUrl: process.env.REACT_APP_NAVER_REDIRECT_URI,
            isPopup: false, /* 팝업을 통한 연동처리 여부, true 면 팝업 */
            loginButton: {color: "green", type: 2, height: 36.88}
          }
        );
      
        naverLogin.init();
    }

     // handleClick 함수 onClick 이벤트 발생 시 useRef 를 통해 지정한 naverRef 항목이 클릭 된다.
    // current 를 통해 아래 div 태그의 ref={} 속성을 줄 수 있다. ( 자세한 내용은 공식문서를 확인하자. )
	const handleNaverLogin = () => {
		naverRef.current.children[0].click()
	}

    useEffect(() => {
        NaverLogin(); // useEffect로 안하고 onclick하면 로그인배너아이콘 안뜸
      }, []);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current!.value;
        const enteredPassword = passwordInputRef.current!.value;

        if(enteredEmail == '') {
            setLoginText('이메일을 입력해주세요.');
            return false;
        }

        if(enteredPassword == '') {
            setLoginText('패스워드를 입력해주세요.');
            return false;
        }

        user.current = { 
            email:enteredEmail, password:enteredPassword, nickname:'', phone: '', loading:'', 
            isLogin: false, role:'', zipNo:'', address: '', addressDetail:'' 
        };

        const result = await dispatch(login(user.current));
        if(result.payload != undefined) {
            setLoginText('');
            const expirationTime:number = result.payload.refreshTokenExpiresIn;
            const currentTime = new Date().getTime();
            const adjExpirationTime = new Date(expirationTime).getTime();
            const remainingDuration = adjExpirationTime - currentTime;
            logoutTimer = setTimeout(() =>{
                alert('로그인 시간이 만료되었습니다.');
                dispatch(logout());
                navigate('/', {replace: true});
            }, remainingDuration);

            navigate('/', {replace:true, state:logoutTimer});
        } else {
            setLoginText('아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다.');
            return false;
        }

    }

    return (
        <>
            <Container maxWidth="lg" fixed>
                <section className={Styles.loginSection}>
                    <div style={{fontWeight:800, fontSize:'20px', lineHeight:'20px', textAlign:'center'}}>로그인</div>
                        <form style={{marginTop:'20px'}} onSubmit={submitHandler}>
                            <div>
                                <TextField 
                                    label='이메일'
                                    variant='outlined'
                                    autoComplete='true'
                                    style={{width:'290px', height: '60px'}}
                                    placeholder="이메일을 입력해주세요"
                                    id='email' 
                                    inputRef={emailInputRef}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                            <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                            </div>
                            <div style={{paddingTop:'10px'}}>
                                <TextField 
                                    label='패스워드'
                                    type='password'
                                    variant='outlined'
                                    style={{width:'290px'}}
                                    placeholder="패스워드를 입력해주세요"
                                    id='password' 
                                    inputRef={passwordInputRef} 
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                            <KeyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                            </div>
                            <div style={{display:"flex", justifyContent:'flex-end', marginTop: '10px', fontSize:'13px'}}>
                                    <a onClick={() => {navigate('/findEmail')}} style={{cursor:'pointer'}}>이메일 찾기 </a>
                                    <span style={{
                                        width:'1px',
                                        height: '13px',
                                        margin: '3px 6px 0px',
                                        backgroundColor: 'rgb(51, 51, 51)'
                                    }}></span>
                                    <a onClick={() => {navigate('/findPassword')}} style={{cursor:'pointer'}}> 패스워드 찾기</a>
                            </div>
                            <div>
                            <Button style={{width: '100%', height:'50px', marginTop:'28px'}} color='success' variant='contained' type='submit'>로그인</Button>
                            <Button style={{width: '100%', height:'50px', marginTop:'10px'}} color='success' variant='outlined' onClick={() => {navigate('/signup')}}>회원가입</Button>
                            </div>
                        </form>
                        <div style={{
                                paddingTop: 20,
                            }}>
                            <div className="grid-naver" ref={naverRef} id='naverIdLogin' style={{display:'none'}}></div>
                            <img onClick={handleNaverLogin} src='/images/auth/naverLoginButton.png' style={{width:140, cursor:'pointer'}}/>
                            <a style={{cursor:'pointer'}} href={kakaoLoginUrl}><img src='/images/auth/kakaoLoginButton.png' style={{width:150, marginLeft:5}}/></a>
                        </div>
                        <div style={{
                                paddingTop: 10,
                                fontSize: 12, 
                                color: 'red',
                                textAlign: 'center',
                                paddingLeft: 30
                        }}>
                            {loginText}
                        </div>
                </section>
            </Container>
        </>
    )

}

export default LoginForm;