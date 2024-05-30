import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelect, useAppDispatch } from "store/configureStore";
import { userInfo, logout } from "store/modules/user";
import { IconButton, AppBar, Box, Toolbar, Typography} from '@mui/material';
import HeaderMenu from "./HeaderMenu";

const Header = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelect((state) => state.userReducer.isLogin);
    const role = useAppSelect((state) => state.userReducer.role);
    const { state } = useLocation();
    const navigate = useNavigate();

    const navFunction = (e:any, path:string) => {
        if(path == 'main') {  
            navigate('/');
        } else if(path == 'login') {
            navigate('/login');
        } else if(path == 'signup') {
            navigate('/signup');
        } else if(path == 'mypage') {
            navigate('/profile');
        } else if(path == 'admin') {
            navigate('/admin/info');
        } else if(path == 'cart') {
            navigate('/cart');
        }
    }
    

    const toggleLogoutHandler = async () => {
        const result = await dispatch(logout());
        if( result.payload != undefined ) {
            clearTimeout(state);
        }
        navigate('/');
    }

    useEffect(() => {
        if(isLogin) {
            async function getUserInfo() {
                const response = await dispatch(userInfo());
            }
            getUserInfo();
        }
    }, [isLogin]);

    return(
        <header style={{width:'100%'}}>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{bgcolor: 'white'}}>
                <div style={{backgroundColor:'white', textAlign:'right',display:'flex', justifyContent:'flex-end'}}>
                    <div>
                        {/* 사용자 */}
                        {
                            (isLogin && role == 'USER') &&
                                <span style={{width:'300px', display:'flex', justifyContent:'flex-start', marginTop:'10px'}}>
                                    <span onClick={(e)=>navFunction(e,'cart')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>장바구니</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={(e)=>navFunction(e,'mypage')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>마이페이지</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={toggleLogoutHandler} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>로그아웃</span>
                                </span>
                        }
                        
                        {/* 관리자 */}
                        {
                            (isLogin && role == 'ADMIN') &&
                                <span style={{width:'300px', display:'flex', justifyContent:'flex-start', marginTop:'10px'}}>
                                    <span onClick={(e)=>navFunction(e,'cart')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>장바구니</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={(e)=>navFunction(e,'mypage')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>마이페이지</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={toggleLogoutHandler} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>로그아웃</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span style={{fontSize:'12px', cursor:'pointer', color:'black'}} onClick={(e) => navFunction(e,'admin')}>관리자</span>
                                </span>
                        }

                        
                        {/* Auth 로그인 */}
                        {
                            (isLogin && role == 'GUEST') &&
                                <span style={{width:'300px', display:'flex', justifyContent:'flex-start', marginTop:'10px'}}>
                                    <span onClick={(e)=>navFunction(e,'cart')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>장바구니</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={(e)=>navFunction(e,'mypage')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>마이페이지</span>
                                    <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                    <span onClick={toggleLogoutHandler} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>로그아웃</span>
                                </span>
                        }

                        {
                            !isLogin &&
                                (
                                    <div style={{width:'300px', display:'flex', justifyContent:'flex-start', marginTop:'10px'}}>
                                        <span onClick={(e)=>navFunction(e,'signup')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>회원가입</span>
                                        <span style={{width:'1px', height:'15px', margin:'0px 12px', backgroundColor:'black'}}></span>
                                        <span onClick={(e)=>navFunction(e,'login')} style={{fontSize:'12px', cursor:'pointer', color:'black'}}>로그인</span>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <Toolbar style={{minHeight:'60px'}}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <div style={{color:'black'}} ><span onClick={(e)=>navFunction(e,'main')} style={{cursor:'pointer'}}>Ｃｏｌｌｉｅ</span></div>
                    </Typography>
                </Toolbar>
                <HeaderMenu></HeaderMenu>
            </AppBar>
            </Box>
        </header>
    )
}

export default Header;