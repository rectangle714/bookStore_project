import Button from '@mui/material/Button';
import { ChangeEvent, MouseEvent, useState } from 'react';

declare global {
    export interface Window {
        daum: any;
    }
}

interface IAddr {
    address: string;
    zonecode: string;
}

const AddressButton = ({addressHandler}:any) => {
    const onClickAddr = (event: MouseEvent<HTMLElement>) => {
        new window.daum.Postcode({
          oncomplete: function (data: IAddr) {
            addressHandler(data.address, data.zonecode, '');
            document.getElementById('addrDetail')?.focus();
          }
        }).open();
    };
    
    
    return(
        <>
            <Button 
                sx={{height:'53px'}}
                variant="contained"
                color="success"
                onClick={onClickAddr}
            >주소검색</Button>
        </>
    )
}

export default AddressButton;