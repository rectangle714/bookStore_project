import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Table,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelect } from "store/configureStore";
import axios from "axios";
import CartItem from "./CartItem";
import PaginationForm, { Page } from "components/common/PaginationForm";
import {
  Iamport,
  RequestPayParams,
  RequestPayResponse,
} from "store/modules/payment";

declare global {
  interface Window {
    IMP?: Iamport;
  }
}

export type Cart = {
  itemId?: Object;
  email?: Object;
  quantity?: Object;
};

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
  const navigate = useNavigate();
  const isLogin = useAppSelect((state) => state.userReducer.isLogin);
  const email = useAppSelect((state) => state.userReducer.email);

  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [pageData, setPageData] = useState<Page>({} as Page);

  const getCartList = async (currentPage: number) => {
    const URL =
      process.env.REACT_APP_API_URL +
      "/cart/selectList?email=" +
      email +
      "&page=" +
      currentPage;
    try {
      const response = await axios.get(URL);
      if (response.data.content.length > 0) {
        setTotalItemPrice(response.data.content[0].totalBookPrice);
        setPageData({
          totalDataCount: response.data.totalElements,
          totalPageCount: response.data.totalPages,
        });
        setCartItems(response.data.content);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.log("error ", error);
      navigate("/", { replace: true });
    }
  };

  const renderTotalPrice = (flag: any, bookPrice: number) => {
    if (flag === "increse") {
      setTotalItemPrice((prev) => prev + bookPrice);
    } else {
      setTotalItemPrice((prev) => prev - bookPrice);
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    if (window.confirm("해당 상품을 삭제 하시겠습니까?")) {
      const URL = process.env.REACT_APP_API_URL + "/cart/delete";
      try {
        const response = await axios.post(URL, cartId);
        if (response.data === "success") {
          alert("해당 상품이 삭제 되었습니다.");
          window.location.reload();
        }
      } catch (error) {
        console.log("error ", error);
        alert("삭제 작업 중 문제가 발생했습니다.");
      }
    }
  };

  const handlePayment = () => {
    if (cartItems.length < 1) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    const payItemName =
      cartItems.length > 1
        ? `${cartItems[0].title} 외 ${cartItems.length - 1}건`
        : cartItems[0].title!;

    window.IMP?.init(process.env.REACT_APP_PAYMEMNTS_KEY + "");
    const data: RequestPayParams = {
      pg: "nice_v2." + process.env.REACT_APP_PAYMEMNTS_PG_KEY,
      pay_method: "card",
      merchant_uid: `orderNo${new Date().getTime()}`,
      amount: totalItemPrice,
      buyer_tel: "010-1234-5678",
      name: payItemName,
    };

    const callback = async (response: RequestPayResponse) => {
      const { success, merchant_uid, imp_uid, error_msg } = response;
      if (success) {
        const URL = process.env.REACT_APP_API_URL + "/item/processPayment";
        const paymentList = cartItems.map((item) => ({
          id: item.cartId,
          email,
          amount: item.quantity * (item.price ?? 0),
          merchantUid: merchant_uid,
          impUid: imp_uid,
        }));

        try {
          const result = await axios.post(URL, paymentList);
          if (result.data === "success") {
            alert("결제가 완료됐습니다.");
            window.location.reload();
          }
        } catch (err) {
          alert("결제를 실패했습니다.");
          console.log("결제 실패 : ", err);
        }
      } else {
        alert(`결제에 실패했습니다: ${error_msg}`);
      }
    };

    window.IMP?.request_pay(data, callback);
  };

  useEffect(() => {
    if (isLogin) getCartList(0);
  }, []);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 5 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
        🛒 장바구니
      </Typography>

      <Grid container spacing={3}>
        {/* 장바구니 아이템 목록 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {cartItems.length > 0 ? (
              <>
                <Table>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.cartId}
                      book={item}
                      onRemove={handleRemoveItem}
                      renderTotalPrice={renderTotalPrice}
                    />
                  ))}
                </Table>
              </>
            ) : (
              <Box textAlign="center" py={5}>
                <Typography variant="body1">
                  장바구니가 비어 있습니다.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 결제 요약 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              결제 요약
            </Typography>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography>상품 금액</Typography>
              <Typography fontWeight="bold">
                {totalItemPrice.toLocaleString()} 원
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handlePayment}
            >
              주문하기
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 페이지네이션 */}
      {pageData.totalPageCount !== undefined && (
        <Grid container justifyContent="center" mt={5}>
          <Grid item>
            <PaginationForm pageData={pageData} getDataList={getCartList} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
