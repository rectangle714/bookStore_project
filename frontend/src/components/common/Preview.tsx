import { useState, useRef } from "react";
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Preview = () => {
    const [imageSrc, setImegeSrc]: any = useState(null);
    const fileInputRef:any = useRef("");
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const onSelectedFiles = (e: any) => {
        let reader = new FileReader();
        console.log('선택 파일 값',e.target.files);

        reader.onload = function(e) {
            setImegeSrc(e.target?.result);
        };

        reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <>
            <div style={{height:'200px', position:'relative'}}>
                <div style={{border:'solid 1px ', height:'210px', width:'210px', margin:'0 auto', borderRadius:'20px'}}>
                    <img src={imageSrc} style={{maxWidth:'100px',position:'absolute', top:'25%', left:'44%'}}/>
                </div>
            </div>
            <div style={{paddingTop:'20px'}}>
                <Button color='success' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload
                    <VisuallyHiddenInput 
                    accept="image/*" 
                    multiple type="file"
                    ref={fileInputRef}
                    onChange={e => onSelectedFiles(e)}
                    />
                </Button>
            </div>
            <input type="hidden" value={fileInputRef.current}/>
        </>
    )
}

export default Preview;