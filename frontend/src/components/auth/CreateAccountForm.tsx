import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, isExistEmail, signup } from "store/modules/user";
import AddressButton from "components/common/AddressButton";
import store from "store/configureStore";
import Button from '@mui/material/Button';
import Styles from 'styles/auth/CreateAccountForm.module.css';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import Face5Icon from '@mui/icons-material/Face5';

const CreateAccountForm = () => {

    const navigate = useNavigate();
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const nicknameInputRef = useRef<HTMLInputElement>(null);
    const [signupResultText, setSignupResultText] = useState('');
    const user = useRef<User>({ 
        email: '', password: '', nickname: '', phone:'', loading:'', isLogin: false, 
        role: '', zipNo:'', address: '', addressDetail:''
    });

    const [zipNoValue, setZipNoValue] = useState(''); // 우편번호
    const [addrValue, setAddrValue] = useState(''); // 도로명주소
    const [addrDetailValue, setAddrDetailValue] = useState(''); // 상세주소
    const handleAddrDetail = (event: ChangeEvent<HTMLInputElement>) => {
        setAddrDetailValue(event.target.value);
    };

    const addressHandler = (newAddr:string, newZipNo:string, newAddrDetail:string) => {
        setAddrValue(newAddr);
        setZipNoValue(newZipNo);
        setAddrDetailValue(newAddrDetail);
    }

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current!.value;
        const enteredPassword = passwordInputRef.current!.value;
        const enteredPhone = phoneInputRef.current!.value;
        const enteredNickname = nicknameInputRef.current!.value;

        if(!!!enteredEmail) {
            setSignupResultText('이메일을 입력해주세요.');
            return;
        }

        if(!!!emailValidation(enteredEmail)) {
            setSignupResultText('이메일을 정확하게 입력해주세요.');
            return;
        }

        const email = enteredEmail;
        const path= '';
        const isExist = await store.dispatch(isExistEmail({email, path}));
        if(!isExist.payload) {
            setSignupResultText('이미 존재하는 이메일입니다.');
            return;
        }

        if(!!!enteredPassword) {
            setSignupResultText('패스워드를 입력해주세요.');
            return;
        }

        if(!!!enteredPhone) {
            setSignupResultText('휴대폰 번호를 입력해주세요.');
            return;
        }

        if(!!!isCellPhone(enteredPhone)) {
            setSignupResultText('휴대폰 번호가 정확한지 확인해 주세요.');
            return;
        }

        if(!!!enteredNickname) {
            setSignupResultText('닉네임을 입력해주세요.');
            return;
        }

        if(!!!addrValue || !!!zipNoValue) {
            setSignupResultText('주소를 입력해주세요.');
            return;
        }

        user.current = { 
            email: enteredEmail, password: enteredPassword, nickname: enteredNickname, phone: enteredPhone, isLogin: false, 
            loading:'', role:'', zipNo:zipNoValue, address: addrValue, addressDetail:addrDetailValue
        };
        const result = await store.dispatch(signup(user.current));
        console.log('dd', result.payload);
        if(result.payload == 'success') {
            alert('회원가입에 성공했습니다.');
            navigate('/', {replace:true});
        } else {
            alert('회원가입에 실패했습니다.');
            return;
        }
    
    }

    /* 이메일 validation 체크 */
    const emailValidation = (email:string) => {
        const regEmail = /^[a-zA-Z]+[!#$%&'*+-/=?^_`(){|}~]*[a-zA-Z0-9]*@[\w]+\.[a-zA-Z0-9-]+[.]*[a-zA-Z0-9]+$/;
        return regEmail.test(email);
    }

    /* 휴대폰 validation 체크 */
    const isCellPhone = (phoneNum:string) => {
        phoneNum = phoneNum.split('-').join('');
        const regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
        return regPhone.test(phoneNum);
    }

    return (
        <section className={Styles.AccountSection}>
            <div style={{fontWeight:800, fontSize:'20px', lineHeight:'20px', textAlign:'center'}}>회원가입</div>
            <form style={{marginTop:'30px'}} onSubmit={submitHandler}>
                <div>
                   <TextField 
                        label="이메일"
                        variant="outlined"
                        id='outlined-password-input'
                        autoComplete='true'
                        style={{width:'364px', height: '60px'}}
                        placeholder="이메일을 입력해주세요"
                        inputRef={emailInputRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField 
                        label="패스워드" 
                        type="password" 
                        variant="outlined" 
                        style={{width:'364px', height: '60px'}}
                        placeholder="패스워드를 입력해주세요"
                        inputRef={passwordInputRef} 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <KeyIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField 
                        label="휴대폰"
                        variant="outlined"
                        id='phone'
                        style={{width:'364px', height: '60px'}}
                        placeholder="휴대폰 번호를 입력해주세요."
                        inputRef={phoneInputRef}
                        inputProps={{
                            maxLength: 11
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <SmartphoneIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField 
                        label="닉네임"
                        variant="outlined"
                        id='nickname'
                        style={{width:'364px', height: '60px'}}
                        placeholder="닉네임을 입력해주세요"
                        inputRef={nicknameInputRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <Face5Icon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField 
                        label="우편번호"
                        variant="outlined"
                        id='ZipNo'
                        placeholder='우편번호'
                        style={{width:'270px', height: '60px', paddingRight:'5px'}}
                        value={zipNoValue}
                        disabled
                    />
                    <AddressButton addressHandler={addressHandler}/>
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField
                        label="도로명주소"
                        variant="outlined"
                        id='address'
                        placeholder='도로명주소'
                        style={{width:'364px', height: '60px'}}
                        disabled
                        value={addrValue}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <TextField 
                        label="상세주소"
                        variant="outlined"
                        id='addressDetail'
                        style={{width:'364px', height: '60px'}}
                        onChange={handleAddrDetail}
                    />
                </div>
                <div style={{
                    paddingTop: 20,
                    fontSize: 12, 
                    color: 'red',
                    textAlign: "center"
                }}>{signupResultText}</div>
                <div style={{ paddingTop: 30}}>
                <Button style={{width: '100%', height:'50px'}} variant="contained" color="success" type='submit'>등록</Button>
                </div>
            </form>
        </section>
    )
}

export default CreateAccountForm;