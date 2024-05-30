import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const ItemListItem = ({title}:any) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<any[]>([]);
    const [spacing, setSpacing] = useState(2);
    const {state} = useLocation();

    const getItemList = async () => {
        let URL = '';
        if(state != null) {
            URL = process.env.REACT_APP_API_URL + '/item/findAll?cate='+state.itemId.replace('/','');
        } else {
            URL = process.env.REACT_APP_API_URL + '/item/findAll?cate=BEST';
        }
        axios.get(URL)
          .then(function(response) {
            setRows(response.data);
          })
          .catch(function(error) {
            console.log('error ',error);
            alert('상품 조회 중 에러가 발생했습니다.');
          })
    }

    useEffect(() => {
        getItemList();
    }, [title])

    return (
        <>
            <Grid sx={{ flexGrow: 2, height: '512px'}} container spacing={1}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={spacing} style={{paddingTop:10, justifyContent:'left', paddingLeft:'70px', overflow: 'auto' }}>
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
        </>
    )
}

export default ItemListItem;