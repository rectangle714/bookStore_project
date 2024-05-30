import { useState } from "react";
import { Button, TextField, ButtonGroup, InputAdornment, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { Container } from "@mui/joy";
import { Tabs, Tab, Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FindEmail = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
      <>
        <Container maxWidth="lg" fixed>
          <section style={{
            minHeight:'84.8vh',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'calc(10px + 2vmin)'
        }}>
          <div style={{fontWeight:800, fontSize:'28px', lineHeight:'20px', textAlign:'center', marginBottom:'20px'}}>이메일 찾기</div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
              <Tabs centered={true} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="휴대폰 인증" {...a11yProps(0)} />
              </Tabs>
            </Box>
            {/* 휴대폰 인증 */}
            <TabPanel value={value} index={0}>
              <form>
                <div>
                  <TextField 
                    label='이름'
                    variant='standard'
                    autoComplete='true'
                    style={{width:'290px', height: '60px'}}
                    placeholder="이름을 입력해주세요"
                    id='name'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailIcon />
                        </InputAdornment>
                      ),
                      }}
                    />
                  </div>
                  <div style={{marginTop:'30px'}}>
                    <TextField 
                      label='휴대폰 번호'
                      type='text'
                      variant='standard'
                      style={{width:'290px'}}
                      placeholder="휴대폰 번호를 입력해주세요"
                      id='phone'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <KeyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <Button style={{width: '100%', height:'50px', marginTop:'30px'}} color='success' variant='contained' type='submit'>인증번호 받기</Button>
                </form>
                  <div style={{paddingTop: 20}}></div>
                    <div style={{
                      paddingTop: 10,
                      fontSize: 12, 
                      color: 'red',
                      textAlign: 'center',
                      paddingLeft: 30
                    }}>
                    </div>
              </TabPanel>
            </section>
          </Container>
        </>
    )
}

export default FindEmail;