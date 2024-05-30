import { ChangeEvent, useRef, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useAppSelect } from "store/configureStore";
import { User } from "store/modules/user";
import store from "store/configureStore";
import { updateUserInfo } from 'store/modules/user';
import AddressButton from 'components/common/AddressButton';

const Profile = () => {

    const email = useAppSelect((state) => state.userReducer.email);
    const phone = useAppSelect((state) => state.userReducer.phone);
    const role = useAppSelect((state) => state.userReducer.role);
    const nickname = useAppSelect((state) => state.userReducer.nickname);
    const zipNo = useAppSelect((state) => state.userReducer.zipNo);
    const address = useAppSelect((state) => state.userReducer.address);
    const addressDetail = useAppSelect((state) => state.userReducer.addressDetail);

    const [zipNoValue, setZipNoValue] = useState(''); // 우편번호
    const [addrValue, setAddrValue] = useState(''); // 도로명주소
    const [addrDetailValue, setAddrDetailValue] = useState(''); // 상세주소
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const nicknameInputRef = useRef<HTMLInputElement>(null);
    const zipNoInputRef = useRef<HTMLInputElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const addressDetailInputRef = useRef<HTMLInputElement>(null);
    const [validationText, setvalidationText] = useState('');
    const user = useRef<User>({ 
        email: '', password: '', nickname: '', phone:'', loading:'', isLogin: false, 
        role: '', zipNo:'', address: '', addressDetail:''
    });

    const addressHandler = (newAddr:string, newZipNo:string, newAddrDetail:string) => {
        setAddrValue(newAddr);
        setZipNoValue(newZipNo);
        setAddrDetailValue(newAddrDetail);
    }

    const handleAddrDetail = (event: ChangeEvent<HTMLInputElement>) => {
        setAddrDetailValue(event.target.value);
    };

    const onClickBtn = async (event: React.MouseEvent) => {
        event.preventDefault();

        const enteredPassword = passwordInputRef.current?.value;
        const enteredPhone = phoneInputRef.current?.value;
        const enteredNickname = nicknameInputRef.current?.value;
        const enteredzipNo = zipNoInputRef.current?.value;
        const enteredAddress = addressInputRef.current?.value;
        const enteredAddressDetail = addressDetailInputRef.current?.value ?? '';

        if(!!!enteredPassword) {
            setvalidationText('변경할 패스워드를 입력해주세요');
            return;
        }

        if(!!!enteredPhone) {
            setvalidationText('변경할 휴대폰 번호를 입력해주세요.');
            return;
        }

        if(!!!isCellPhone(enteredPhone)) {
            setvalidationText('휴대폰 번호가 정확한지 확인해 주세요.');
            return;
        }


        if(!!!enteredNickname) {
            setvalidationText('변경할 닉네임을 입력해주세요.');
            return;
        }

        if(!!!enteredzipNo || !!!enteredAddress) {
            setvalidationText('변경할 주소를 입력해주세요.');
            return;
        }

        user.current = { 
            email: email, password: enteredPassword, nickname: enteredNickname, 
            phone: enteredPhone, isLogin: false, loading:'', role:'', 
            zipNo: enteredzipNo, address: enteredAddress, addressDetail: enteredAddressDetail
        };

        const result = await store.dispatch(updateUserInfo(user.current));
        if(result.payload == '200') {
            alert('정보를 수정하였습니다.');
            window.location.replace('/');
        } else {
            alert('정보 수정을 실패했습니다.');
            return;
        }
    }

    /* 휴대폰 validation 체크 */
    const isCellPhone = (phoneNum:string) => {
        phoneNum = phoneNum.split('-').join('');
        const regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
        return regPhone.test(phoneNum);
    }

    return (
        <>
            <div style={{height:'100%', margin:'50px'}} >
                <div style={{textAlign:'center'}}>
                    <span style={{fontWeight: '500', fontSize: '24px', color: 'rgb(51, 51, 51)', lineHeight:'48px'}}>마이페이지</span>
                </div>
                <div style={{textAlign:'center'}}>
                    <table style={{width: '490px', marginLeft: 'auto', marginRight: 'auto', borderCollapse: 'separate', borderSpacing: '10px 20px'}}>
                        <colgroup>
                                <col width={'30%'} />
                                <col width={'70%'}/>
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>이메일</td>
                                <td>
                                    <TextField 
                                        variant='outlined'
                                        sx={{width:'100%', input: {textAlign: "center"}}}
                                        disabled
                                        defaultValue={ email }
                                        id='email'
                                    />
                                </td>
                            </tr>
                            { role != 'GUEST' ? 
                                <tr>
                                    <td>패스워드</td>
                                    <td>
                                        <TextField 
                                            type='password'
                                            variant='outlined'
                                            sx={{width:'100%', input: {textAlign: "center"}}}
                                            placeholder="패스워드를 입력해주세요"
                                            id='password'
                                            inputRef={ passwordInputRef } 
                                        />
                                    </td>
                                </tr> : ''
                            }
                            <tr>
                                <td>휴대폰</td>
                                <td>
                                    <TextField 
                                        variant='outlined'
                                        sx={{width:'100%', input: {textAlign: "center"}}}
                                        defaultValue={ phone }
                                        inputRef={ phoneInputRef }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>닉네임</td>
                                <td>
                                    <TextField 
                                        variant='outlined'
                                        sx={{width:'100%', input: {textAlign: "center"}}}
                                        defaultValue = { nickname }
                                        inputRef={ nicknameInputRef }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>주소</td>
                                <td style={{textAlign:'left'}}>
                                    <TextField 
                                        variant='outlined'
                                        style={{paddingRight:'10px'}}
                                        sx={{width:'66%', input: {textAlign: "center"}}}
                                        value = {zipNoValue != '' ? zipNoValue : zipNo}
                                        disabled
                                        inputRef={ zipNoInputRef }
                                    />
                                     <AddressButton addressHandler={addressHandler}></AddressButton>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <TextField 
                                        variant='outlined'
                                        sx={{width:'100%', input: {textAlign: "center"}}}
                                        value = { addrValue != '' ? addrValue : address }
                                        disabled
                                        inputRef={ addressInputRef }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>상세주소</td>
                                <td>
                                    <TextField 
                                        variant='outlined'
                                        sx={{width:'100%', input: {textAlign: "center"}}}
                                        defaultValue = { addressDetail }
                                        inputRef={ addressDetailInputRef }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{height:'30px'}}>
                                    <span style={{color:'red'}}>{validationText}</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <Button style={{width: '50%', height:'50px'}} color='success' variant='contained' onClick={onClickBtn}>정보 수정</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Profile;