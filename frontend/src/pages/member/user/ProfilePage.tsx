import Container from '@mui/material/Container';
import Profile from "../../../components/member/user/Profile";

const ProfilePage = () => {
    return (
        <>
            <Container maxWidth="md" sx={{height:'100%'}}>
                <Profile></Profile>
            </Container>
        </>
    )
}

export default ProfilePage;