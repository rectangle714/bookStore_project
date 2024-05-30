import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Box, Container } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Styles from '../../styles/layout/Footer.module.css';
import CurrentMap from '../common/CurrentMap';

const Footer = () => {
    const [value, setValue] = React.useState(0);

    return (
    <>
     <footer className={Styles.footer}>
      <Container maxWidth="sm" fixed>
        <Box sx={{ width: '500' }}>
          <BottomNavigation
            sx={{bgcolor:'white'}}
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <CurrentMap/>
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Box>
      </Container>
    </footer>
  </>
    );
}

export default Footer;