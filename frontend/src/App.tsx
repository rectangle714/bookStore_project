import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "components/layout/Layout";
import { useAppSelect } from "store/configureStore";
import HomePage from "pages/HomePage";
import CreateAccountPage from "pages/member/user/CreateAccountPage";

import {LoginPage, ProfilePage, AdminPage, FindEmailPage, FindPasswordPage} from "./pages";
import OAuthLogin from "components/auth/OAuthLogin";
import NotFound from "components/common/NotFound";
import UpdatePassword from "components/member/user/UpdatePassword";
import CartPage from "pages/cart/CartPage";
import ItemListPage from "pages/item/ItemListPage";
import ItemDetailPage from "pages/item/ItemDetailPage";


function App() {

  const isLogin = useAppSelect((state) => state.userReducer.isLogin);
  const role = useAppSelect((state) => state.userReducer.role);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        {/* User */}
        <Route path="/login/*" element={isLogin ? <Navigate to='/' /> :  <LoginPage/>}></Route>
        <Route path="/signup" element={isLogin ? <Navigate to='/' /> : <CreateAccountPage />}></Route>
        <Route path="/profile/*" element={isLogin ? <ProfilePage/> : <Navigate to='/' />}></Route>
        <Route path="/findPassword/*" element={<FindPasswordPage/>}></Route>
        <Route path="/updatePassword/*" element={<UpdatePassword/>}></Route>
        <Route path="/findEmail/*" element={<FindEmailPage/>}></Route>
        {/* Item */}
        <Route path="/item/list" element={<ItemListPage/>}></Route>
        <Route path="/item/detail/:itemId" element={<ItemDetailPage/>}></Route>
        {/* Cart */}
        <Route path="/cart/*" element={!isLogin ? <Navigate to='/' /> : <CartPage/>}></Route>
        {/* Admin */}
        <Route path="/admin/*" element={(!isLogin) || (isLogin && role != 'ADMIN') ? <Navigate to='/' /> : <AdminPage/>}></Route>
        { /* Auth */ }
        <Route path="/auth/naver-login" element={<OAuthLogin oauthType='NAVER'/>}></Route>
        <Route path="/auth/kakao-login" element={<OAuthLogin oauthType='KAKAO'/>}></Route>
        {/* NotFound */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
