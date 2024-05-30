import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, TextField, InputAdornment} from "@mui/material";
import { Container } from "@mui/joy";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { useAppDispatch } from "store/configureStore";
import { updateUserPassword } from "store/modules/user";

const UpdatePassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [checkPasswordResultText, setCheckPasswordResultText] = useState('');
    const [isCheck, setIsCheck] = useState(false);
    const { state } = useLocation();

    const checkSamePassword = (checkPassword:string) => {
        if(newPassword != checkPassword) {
            setCheckPasswordResultText('패스워드가 일치하지 않습니다.');
        } else {
            setIsCheck(true);
            setCheckPasswordResultText('');
        }
    }

    const onUpdateButton = async () => {
        const email = state;
        const password = newPassword;
        if(isCheck) {
            const result = await dispatch(updateUserPassword({email, password}));
            if(result.payload == 'success') {
                alert('패스워드가 변경되었습니다.');
                navigate('/', {replace:true});
            } else {
                alert('패스워드 변경이 실패했습니다.');
            }
        } else {
            alert('패스워드를 다시 입력해주세요.');
        }
    }

  return (
    <>
      <Container maxWidth="lg" fixed>
        <section
          style={{
            minHeight: "84.8vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "calc(10px + 2vmin)",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "28px",
              lineHeight: "20px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            패스워드 변경
          </div>

          {/* 새로운 패스워드 입력 */}
          <form>
            <div style={{ marginTop: "30px" }}>
              <TextField
                label="패스워드"
                type="password"
                variant="standard"
                style={{ width: "290px" }}
                placeholder="변경할 패스워드를 입력해주세요."
                id="email"
                onChange={(e) => {
                    setNewPassword(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div style={{ marginTop: "30px" }}>
              <TextField
                label="패스워드 확인"
                type="password"
                variant="standard"
                style={{ width: "290px" }}
                placeholder="다시 한번 입력해주세요."
                onBlur={(e) => {
                    checkSamePassword(e.target.value);
                }}
                id="code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div
              style={{
                paddingTop: 10,
                fontSize: 12,
                color: "red",
                textAlign: "center",
              }}
            >
              {checkPasswordResultText}
            </div>
            <Button
              style={{ width: "100%", height: "50px", marginTop: "30px" }}
              color="success"
              variant="contained"
              onClick={onUpdateButton}
            >
              확인
            </Button>
          </form>
        </section>
      </Container>
    </>
  );
};

export default UpdatePassword;
