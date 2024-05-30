import axios from 'axios';
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Typography } from '@mui/material';
import { useAppSelect } from "store/configureStore";
import CartItem from './CartItem';
import PaginationForm, { Page } from 'components/common/PaginationForm';
import { Iamport, RequestPayParams, RequestPayResponse } from 'store/modules/payment';

declare global {
  interface Window {
      IMP?: Iamport
  }
}

export type Cart = {
  itemId? : Object,
  email? : Object,
  quantity? : Object
}

export interface Book {
  cartId: number;
  category?: string;
  contents?: string;
  title?: string;
  price?: number;
  quantity: number;
  storedFileName?: string;
}

const Cart = () => {
  const navigation = useNavigate();
  const isLogin = useAppSelect((state) => state.userReducer.isLogin);
  const email = useAppSelect((state) => state.userReducer.email);
  
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [pageData, setPageData] = useState<Page>(Object);

  // 버튼 로직
  const handlePayment = () => {

    if(cartItems.length < 1) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    let payItemName = '';
    if(cartItems.length > 1) {
      payItemName = cartItems[0].title + ' 외 ' + (cartItems.length-1) + '건';
    } else {
      payItemName = cartItems[0].title!;
    }

    window.IMP?.init(process.env.REACT_APP_PAYMEMNTS_KEY+'');
    const amount: number = totalItemPrice;
    if (!amount) {
      alert('상품을 선택 후 주문해주세요.');
      return;
    }

    const data: RequestPayParams = {
      pg: 'nice_v2.'+process.env.REACT_APP_PAYMEMNTS_PG_KEY,
      pay_method: 'card',
      merchant_uid: `orderNo${new Date().getTime()}`,
      amount: totalItemPrice,
      buyer_tel: '010-1234-5678',
      name: payItemName
    }

    const callback = (response: RequestPayResponse) => {
      const {success, merchant_uid, error_msg, imp_uid, error_code} = response;

      if (error_msg == undefined) {
        const URL = process.env.REACT_APP_API_URL + '/item/processPayment';
        const paymentList:any = [];

        cartItems.forEach(function(item){
          let cartItem = {};
          const amount = item.quantity * item.price!;
          cartItem = {
            id : item.cartId,
            email : email,
            amount : amount,
            merchantUid : merchant_uid,
            impUid : imp_uid
          }
          paymentList.push(cartItem);
        })

        axios.post(URL,paymentList)
          .then(function(response) {
            if(response.data == 'success') {
              alert('결제가 완료됐습니다.');
              window.location.reload();
            }
          })
          .catch(function(error) {
            alert('결제를 실패했습니다.');
            console.log('결제 실패 : ' + error);
          })

      } else {

      }
    }

    window.IMP?.request_pay(data, callback)
  }

  const getCartList = async (currentPage:number) => {
    const URL = process.env.REACT_APP_API_URL + '/cart/selectList?email='+email+'&page='+currentPage;
    axios.get(URL)
      .then(function(response) {
        if(response.data.content.length > 0) {
          setTotalItemPrice(response.data.content[0].totalBookPrice);
          setPageData({totalDataCount:response.data.totalElements, totalPageCount:response.data.totalPages});
          setCartItems(response.data.content);
        }
      })
      .catch(function(error) {
        console.log('error ', error);
        navigation('/', {replace:true})
      });
  }

  const renderTotalPrice = (flag:any, bookPrice:number) => {
    if(flag == 'increse') {
      setTotalItemPrice(totalItemPrice + bookPrice);
    } else {
      setTotalItemPrice(totalItemPrice - bookPrice);
    }
  }

  const handleRemoveItem = async (cartId: number) => {
    if(window.confirm('해당 상품을 삭제 하시겠습니까?')) {
      const URL = process.env.REACT_APP_API_URL + '/cart/delete';
      axios.post(URL, cartId)
        .then(function(response) {
          if(response.data == 'success') {
            alert('해당 상품이 삭제 되었습니다.');
            window.location.reload();
          }
        }).catch(function(error) {
          console.log('error ',error);
          alert('삭제 작업 중 문제가 발생했습니다.');
        });
    }
  };

  useEffect(() => {
    if(isLogin) {
      getCartList(0);
    }
  }, []);

  return (
    <>
        <div style={{paddingBottom:'50px', textAlign:'center'}}>
          <span style={{fontWeight: '500', fontSize: '24px', color: 'rgb(51, 51, 51)', lineHeight:'48px'}}>장바구니</span>
        </div>
        <section style={{verticalAlign:'center', minHeight:'100%', width:'100%', display:'flex'}}>
            <div style={{textAlign:'center'}}>
                <div style={{borderTop: 'solid 3px black',borderBottom: 'solid 3px black'}}>
                    {cartItems.length > 0 ? (
                        <Table>
                            {cartItems.map(item => (
                                <CartItem key={item.cartId} book={item} onRemove={handleRemoveItem} renderTotalPrice={renderTotalPrice} />
                            ))}
                        </Table> 
                    ) : (
                      <Table>
                        <tr style={{borderBottom:'1px solid black'}}>
                          <td style={{width:'720px', height:'150px'}}>
                            <Typography variant="body1">장바구니가 비어 있습니다.</Typography>
                          </td>
                        </tr>
                      </Table>
                    )}
                </div>
            </div>
            <div style={{width:'30%', padding:'15px', height:'300px', paddingTop:'0px'}}>
              <div style={{border:'3px solid grey', borderRadius:'10px', height:'100%'}}>
                <div style={{margin:'20px', height:'65%', textAlign:'center'}}>
                  <div style={{margin:'20px'}}>
                    <span style={{float:'left'}}>상품금액 : </span><span style={{float:'right', fontWeight:'600'}}>{totalItemPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{border:'3px solid grey', margin:'20px', borderRadius:'10px',
                  height:'12%', textAlign:'center', paddingTop:'10px', cursor:'pointer', background:'#5055b1'}}>
                  <div style={{verticalAlign:'middle', height:'100%', color:'white', fontWeight:'500'}} onClick={()=>handlePayment()}>주문하기</div>
                </div>
              </div>
            </div>
        </section>
        <div style={{width:'65%'}}>
          {pageData.totalPageCount != undefined ? <PaginationForm pageData={pageData} getDataList={getCartList}/> : ''}
        </div>
    </>
  );
};

export default Cart;