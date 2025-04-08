import { ChangeEvent, useRef, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Paper,
    Divider
} from '@mui/material';
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

    const [zipNoValue, setZipNoValue] = useState('');
    const [addrValue, setAddrValue] = useState('');
    const [addrDetailValue, setAddrDetailValue] = useState('');
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const nicknameInputRef = useRef<HTMLInputElement>(null);
    const zipNoInputRef = useRef<HTMLInputElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const addressDetailInputRef = useRef<HTMLInputElement>(null);
    const [validationText, setvalidationText] = useState('');
    const user = useRef<User>({
        email: '', password: '', nickname: '', phone: '', loading: '', isLogin: false,
        role: '', zipNo: '', address: '', addressDetail: ''
    });

    const addressHandler = (newAddr: string, newZipNo: string, newAddrDetail: string) => {
        setAddrValue(newAddr);
        setZipNoValue(newZipNo);
        setAddrDetailValue(newAddrDetail);
    };

    const handleAddrDetail = (event: ChangeEvent<HTMLInputElement>) => {
        setAddrDetailValue(event.target.value);
    };

    const isCellPhone = (phoneNum: string) => {
        phoneNum = phoneNum.split('-').join('');
        const regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
        return regPhone.test(phoneNum);
    };

    const onClickBtn = async (event: React.MouseEvent) => {
        event.preventDefault();

        const enteredPassword = passwordInputRef.current?.value;
        const enteredPhone = phoneInputRef.current?.value;
        const enteredNickname = nicknameInputRef.current?.value;
        const enteredzipNo = zipNoInputRef.current?.value;
        const enteredAddress = addressInputRef.current?.value;
        const enteredAddressDetail = addressDetailInputRef.current?.value ?? '';

        if (!enteredPassword) return setvalidationText('변경할 패스워드를 입력해주세요');
        if (!enteredPhone) return setvalidationText('변경할 휴대폰 번호를 입력해주세요.');
        if (!isCellPhone(enteredPhone)) return setvalidationText('휴대폰 번호가 정확한지 확인해 주세요.');
        if (!enteredNickname) return setvalidationText('변경할 닉네임을 입력해주세요.');
        if (!enteredzipNo || !enteredAddress) return setvalidationText('변경할 주소를 입력해주세요.');

        user.current = {
            email, password: enteredPassword, nickname: enteredNickname,
            phone: enteredPhone, isLogin: false, loading: '', role: '',
            zipNo: enteredzipNo, address: enteredAddress, addressDetail: enteredAddressDetail
        };

        const result = await store.dispatch(updateUserInfo(user.current));
        if (result.payload == '200') {
            alert('정보를 수정하였습니다.');
            window.location.replace('/');
        } else {
            alert('정보 수정을 실패했습니다.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, minHeight: '60vh' }}>
            <Paper elevation={3} sx={{ width: 500, p: 4, borderRadius: 3 }}>
                <Typography variant="h5" align="center" fontWeight={600} mb={3}>
                    마이페이지
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="이메일"
                        value={email}
                        disabled
                        fullWidth
                        variant="outlined"
                        inputProps={{ style: { textAlign: 'center' } }}
                    />

                    {role !== 'GUEST' && (
                        <TextField
                            label="패스워드"
                            type="password"
                            placeholder="패스워드를 입력해주세요"
                            fullWidth
                            variant="outlined"
                            inputRef={passwordInputRef}
                            inputProps={{ style: { textAlign: 'center' } }}
                        />
                    )}

                    <TextField
                        label="휴대폰"
                        defaultValue={phone}
                        fullWidth
                        placeholder='01012345678'
                        variant="outlined"
                        inputRef={phoneInputRef}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />

                    <TextField
                        label="닉네임"
                        defaultValue={nickname}
                        fullWidth
                        variant="outlined"
                        inputRef={nicknameInputRef}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />

                    <Box display="flex" gap={1} alignItems="center">
                        <TextField
                            label="우편번호"
                            value={zipNoValue || zipNo}
                            fullWidth
                            disabled
                            inputRef={zipNoInputRef}
                            inputProps={{ style: { textAlign: 'center' } }}
                        />
                        <Box sx={{ minWidth: 120 }}>
                            <AddressButton addressHandler={addressHandler} />
                        </Box>
                    </Box>

                    <TextField
                        label="주소"
                        value={addrValue || address}
                        fullWidth
                        disabled
                        inputRef={addressInputRef}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />

                    <TextField
                        label="상세주소"
                        defaultValue={addressDetail}
                        fullWidth
                        inputRef={addressDetailInputRef}
                        inputProps={{ style: { textAlign: 'center' } }}
                        onChange={handleAddrDetail}
                    />

                    {validationText && (
                        <Typography color="error" align="center">
                            {validationText}
                        </Typography>
                    )}

                    <Divider />

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        onClick={onClickBtn}
                    >
                        정보 수정
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Profile;
