import { useAppDispatch } from "store/configureStore";
import { useState, useEffect } from 'react';
import { itemDetailInfo, recentRegisteredItem } from 'store/modules/item';
import { useNavigate } from "react-router";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ItemModal from "./ReviewModal";

interface modalValue {
  itemId: string,
  title: string,
  contents: string,
  price: number,
  category: string
}

const ItemGrid = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const modalClose = () => setOpen(false);

  const [imgSrc, setImgSrc] = useState('');
  const [modalValue, setModalValue] = useState<modalValue>(
    {itemId: '', title: '', contents: '', price: 0, category: ''}
  );

  const getItemList = async () => {
      const result = await dispatch(recentRegisteredItem());
      if(result.payload != undefined) {
        setRows(result.payload);
      }
  }

  const handleOpen = async (arg:any, e:any) => {
    e.stopPropagation();
    const URL = process.env.REACT_APP_API_URL + '/item/detail?itemId='+arg;
    await axios.get(URL)
      .then(function(response) {
        setModalValue({itemId:response.data.itemId, title:response.data.title, contents:response.data.contents,
          price:response.data.price, category:response.data.category});
      })
      .catch(function(error) {
        console.log('error :', error);
        alert('오류가 발생했습니다.');
      });
    setOpen(() => true);
  }

  useEffect(() => {
    getItemList();
  },[]);

  return (
    <>
      <div>
        <Grid sx={{flexGrow: 2, minHeight: '512px', height:'100%'}} container spacing={1}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2} style={{paddingTop:10, justifyContent:'left', paddingLeft:'70px', overflow: 'auto'}}>
              {rows.map((value, index) => (
                <Grid key={value.id} item >
                  <Paper
                    elevation={1}
                    sx={{
                      height: 204,
                      width: 140,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : 'white', textAlign: 'left'
                    }}
                    onClick={(e) => {navigate('/item/detail/'+value.id)}}
                  >
                  {value.fileList[0] != undefined? <img
                    src={process.env.REACT_APP_FILE_URL + value.fileList[0].storedFileName}
                    alt='logo image'
                    style={{ width:140, height:204, cursor:"pointer" }}
                    item-id={value.id}
                  /> : ''}
                  </Paper>
                  <div style={{textAlign:'center', width:'140px'}}>
                    <span style={{fontFamily: 'Noto Sans KR, sans-serif'}}>{value.title}</span>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div>
        <ItemModal modalValue={modalValue} imgSrc={imgSrc} open={open} handleOpen={handleOpen} handleClose={modalClose} ></ItemModal>
      </div>
    </>
  );
}

export default ItemGrid;