import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, InputAdornment } from "@mui/material";
import { Container } from "@mui/joy";
import EmailIcon from "@mui/icons-material/Email";
import { useAppDispatch } from "../../../store/configureStore";
import { isExistEmail, verifications, emailAuth, verificationRequests } from "../../../store/modules/user";

const FindPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [authCodeValue, setAuthCodeValue] = useState("");
  const [isAuthCheck, setIsAuthCheck] = useState(false);
  const [findPasswordResultText, setFindPasswordResultText] = useState("");
  const [display, setDisplay] = useState({
    marginTop: "30px",
    paddingLeft:'100px',
    display: "none",
  });

  const onVerificationRequestsButton = async () => {
    if ("" == emailValue) {
      setFindPasswordResultText("이메일을 입력해주세요.");
      return;
    }

    if (!!!emailValidation(emailValue)) {
      setFindPasswordResultText("이메일 형식에 맞게 입력해주세요.");
      return;
    }

    if(await existEmailCheck(emailValue)) {
      setFindPasswordResultText("존재하지 않는 이메일 입니다.");
      return;
    };

    setDisplay({ marginTop: "30px", paddingLeft:'100px', display: "block" });
    setFindPasswordResultText("");
  };

  /* '인증' 버튼 클릭 이벤트 */
  const onVerifiedCodeButton = async () => {
    const email = emailValue;
    const authCode = authCodeValue;

    const result = await dispatch(verifications({email, authCode}));
    if(result.payload == true) {
      setIsAuthCheck(true);
      setFindPasswordResultText('');
      alert('인증이 완료되었습니다.');
    } else {
      setIsAuthCheck(false);
      setFindPasswordResultText('인증코드를 다시 확인해주세요.');
    }
  }

  /* '확인' 버튼 클릭 이벤트 */
  const onSuccessButton = async () => {
    if(isAuthCheck) {
      setFindPasswordResultText('');
      navigate('/UpdatePassword', {state: emailValue});
    } else {
      setFindPasswordResultText('인증을 먼저 완료해주세요.');
    }
  }

  /* 이메일 validation 체크 */
  const emailValidation = (email: string) => {
    const regEmail = /^[a-zA-Z]+[!#$%&'*+-/=?^_`(){|}~]*[a-zA-Z0-9]*@[\w]+\.[a-zA-Z0-9-]+[.]*[a-zA-Z0-9]+$/;
    return regEmail.test(email);
  };

  /* 이메일로 전송된 코드 체크 */
  const existEmailCheck = async (email: string) => {  
    const path = 'findpassword';
    const isExist = (await dispatch(isExistEmail({email,path}))).payload;
    if(!isExist) {
      dispatch(verificationRequests(email));
    }
    return isExist;
  };

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
            패스워드 찾기
          </div>

          {/* 이메일 인증 */}
          <form>
            <div style={{ marginTop: "30px", paddingLeft:'100px' }}>
              <span>
                <TextField
                  label="이메일"
                  type="text"
                  variant="standard"
                  style={{ width: "240px", paddingRight:'10px'}}
                  placeholder="이메일을 입력해주세요"
                  id="email"
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <span>
                  <Button
                    sx={{fontSize:'12px', height:'40px'}}
                    color="success"
                    variant="outlined"
                    onClick={onVerificationRequestsButton}
                  >
                    인증번호 받기
                  </Button>
                </span>
              </span>
            </div>
            <div style={display}>
              <TextField
                label="인증코드"
                type="text"
                variant="standard"
                style={{ width: "240px", paddingRight:'10px'}}
                onChange={(e) => {
                  setAuthCodeValue(e.target.value);
                }}
                id="code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <span>
                <Button
                  sx={{fontSize:'12px', height:'40px'}}
                  color="success"
                  variant="outlined"
                  onClick={onVerifiedCodeButton}
                >
                인증
                </Button>
              </span>
            </div>
            <div
              style={{
                paddingTop: 10,
                fontSize: 12,
                color: "red",
                textAlign: "center",
              }}
            >
              {findPasswordResultText}
            </div>
          </form>
          <Button
            style={{ width: "230px", height: "50px", marginTop: "30px" }}
            color="success"
            variant="contained"
            onClick={onSuccessButton}
          >
          확인
          </Button>
        </section>
      </Container>
    </>
  );
};

export default FindPassword;
