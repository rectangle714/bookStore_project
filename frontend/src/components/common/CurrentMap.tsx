import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

declare global {
  interface Window {
    kakao: any;
  }
}

const CurrentMap = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [location, setLoacation] = useState<any>(null); // 현재 위치를 저장할 상태

  /** 현재 위치를 불러오는 로직 **/
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
	}, []);

	const successHandler = (response:any) => {
		// console.log(response);  coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
		const { latitude, longitude } = response.coords;
    setLoacation({ latitude, longitude });
	};
	const errorHandler = (error:any) => {
		console.log(error);
	};
  /****/

  return (
    <>
    <BottomNavigationAction onClick={handleOpen} label="Map" icon={<LocationOnIcon />}  showLabel />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{textAlign:'center', backgroundColor:'white' ,fontWeight:'bold', paddingBottom:'40px'}}>현재위치</div>
          {location && (
          <Map 
            center={{ lat: location.latitude, lng: location.longitude }} 
            style={{ width: '1000px', height: '500px' }} 
            level={3}
          >
            <MapMarker position={{ lat: location.latitude, lng: location.longitude }} />
          </Map>
        )}
        </Box>
      </Modal>
    </>
  );
}

export default CurrentMap;