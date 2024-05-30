import { useState } from 'react';
import Container from '@mui/material/Container';
import { Tabs, Tab, Box } from '@mui/material';
import Styls from'../../../styles/member/admin/Admin.module.css';
import AdminMemberInfo from './AdminMemberInfo';
import AdminItemList from './AdminItemList';
import AdminItemRegister from './AdminItemRegister'; 

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

const Admin = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
        <Container maxWidth="lg" fixed className={Styls.container}>
          <section style={{
            height:'100%',
            paddingBottom:'50px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center'
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: '100px'}}>
                <Tabs centered={true} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="회원정보" {...a11yProps(0)} />
                    <Tab label="상품등록" {...a11yProps(1)} />
                    <Tab label="상품조회" {...a11yProps(2)} />
                </Tabs>
            </Box>
            {/* 회원정보 */}
            <TabPanel value={value} index={0}>
              <AdminMemberInfo></AdminMemberInfo>
            </TabPanel>
            {/* 상품등록 */}
            <TabPanel value={value} index={1}>
              <AdminItemRegister></AdminItemRegister>
            </TabPanel>
            {/* 상품조회 */}
            <TabPanel value={value} index={2}>
              <AdminItemList></AdminItemList>
            </TabPanel>
          </section>
        </Container>
    )
}

export default Admin;