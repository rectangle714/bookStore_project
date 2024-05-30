import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useAppSelect} from "store/configureStore";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

const ReviewModal = ({ modalValue, imgSrc, open, handleOpen, handleClose }:any) => {
  const email = useAppSelect((state) => state.userReducer.email);
  const contentsInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const onClickWriteButton = () => {
    const URL = process.env.REACT_APP_API_URL + '/item/writeReview';
    const contentsValue:string = contentsInputRef.current!.value;
    let param = {
      itemId : '',
      contents : '',
      email : ''
    };

    param.itemId = modalValue.itemId;
    param.contents = contentsValue.split('\n').join('<br>');
    if(email == '') {
      alert('로그인 후 이용해주세요.');
      navigate('/login', {replace:true});
      return;
    } else {
      param.email = email;
    }

    axios.post(URL, param)
      .then(function(response) {
        alert('리뷰가 작성되었습니다.');
        console.log('response ',response);
        window.location.reload();
      })
      .catch(function(error) {
        alert('리뷰 작성을 실패했습니다.');
        console.log('error ',error);
        window.location.reload();
      });
    handleClose();
  }

  return (
    <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div style={{position:'relative', transform:'translateY(0%)', textAlign:'right'}}>
              <span onClick={handleClose} style={{cursor:'pointer'}} className="material-symbols-outlined">close</span>
            </div>
            <div>
              <div style={{borderBottom:'3px solid #eaeaea', padding:'10px', textAlign:'center'}}>
                <Typography id="modal-modal-title" variant="h5" component="h3" sx={{wordWrap:'break-word', fontWeight:'800'}}>
                  {modalValue.title}
                </Typography>
              </div>
            </div>
            <div style={{textAlign:'center', display:'flex'}}>
              <div style={{paddingTop:'5px', marginBottom:'50px' ,flex:'1' }}>
                {imgSrc != '' && imgSrc != undefined ? <img
                  src={imgSrc}
                  alt='logo image'
                  style={{ width:150, height:200 }}/> : ''}
              </div>
              <div style={{ paddingLeft:'50px', flex:'2'}}>
                <div style={{borderBottom:'3px solid #eaeaea', padding:'5px'}}>
                  <Typography id="modal-modal-description" sx={{ mt: 1, textAlign:'left' }}> 가격 </Typography>
                  <Typography sx={{ mt: 1, textAlign:'right', fontWeight:'600' }}>{modalValue.price && modalValue.price.toLocaleString()} 원</Typography>
                </div>
                <div style={{borderBottom:'3px solid #eaeaea', padding:'5px'}}>
                  <Typography id="modal-modal-description" sx={{ mt: 1, textAlign:'left' }}> 분류 </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 1, textAlign:'right', fontWeight:'600' }}>{modalValue.category}</Typography>
                </div>
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <TextField
                inputRef={contentsInputRef}
                sx={{width:'100%'}}
                label="후기작성"
                multiline
                rows={3}
                placeholder="내용을 입력해주세요."
              />
            </div>
            <div style={{paddingTop:'10px', paddingBottom:'10px', marginLeft:'250px'}}>
              <div style={{borderRadius: '15px', textAlign:'center', cursor:'pointer',
                background:'#5055b1',  height:'30px', width:'100px'}} onClick={() => {onClickWriteButton()}}>
                <span style={{verticalAlign:'middle', color:'white', fontWeight:'500'}}>등록</span>
              </div>
            </div>
          </Box>
        </Modal>
    </>
  );
};

export default ReviewModal;