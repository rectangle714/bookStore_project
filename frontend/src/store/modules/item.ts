import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    title: '',
    contents: ''
}

export interface Item {
    title: string,
    contents: string
    price: number,
    category: string
}

const itemSlice = createSlice({
    name: 'itemReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        
    },

})

/* 상품 등록 */
export const registerItem = createAsyncThunk('REGISTER_ITEM', async(item:any) => { 
    try {
        const URL = process.env.REACT_APP_API_URL + '/item/save';
        const response = await axios.post(URL, item);
        return response.data;
    } catch(error) {
        alert('상품 입력 에러가 발생했습니다.');
        console.error('에러발생 :'+ error);
    }
});

/* 전체 상품 조회 */
export const allItemInfo = createAsyncThunk('ALL_ITEM_INFO', async() => {
    try {
        const URL = process.env.REACT_APP_API_URL + '/item/findAll';
        const response = await axios.get(URL);
         return response.data;
    } catch(error) {
        alert('상품 조회 에러가 발생했습니다.');
        console.log('에러발생 : ' + error);
    }
});

/* 최근 추가된 책 조회 */
export const recentRegisteredItem = createAsyncThunk('RECENT_REGISTERED_ITEM', async() => {
    try {
        const URL = process.env.REACT_APP_API_URL + '/item/findRecentRegisteredItem';
        const response = await axios.get(URL);
         return response.data;
    } catch(error) {
        alert('상품 조회 에러가 발생했습니다.');
        console.log('에러발생 : ' + error);
    }
});


/* 상품 상세 조회 */
export const itemDetailInfo = createAsyncThunk('ITEM_DETAIL_INFO', async(itemId:any) => {
    try {
        const URL = process.env.REACT_APP_API_URL + '/item/detail?itemId='+itemId;
        const response = await axios.get(URL);
        return response.data;
    } catch(error) {
        alert('상품 조회 에러가 발생했습니다.');
        console.log('에러발생 : ' + error);
    }
});

/* 상품 삭제 */
export const deleteItem = createAsyncThunk('DELETE_ITEM', async(param:any) => {
    console.log('[상품 삭제 시작]');
    const URL = process.env.REACT_APP_API_URL + '/item/delete';
    const response = await axios.post(URL, param);
    return response.status;
})


export default itemSlice.reducer;