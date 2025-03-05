import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "components/layout/Layout";
import { useAppSelect } from "store/configureStore";
import HomePage from "pages/HomePage";
import CreateAccountPage from "pages/member/user/CreateAccountPage";
import { LoginPage, ProfilePage, AdminPage, FindEmailPage, FindPasswordPage } from "./pages";
import OAuthLogin from "components/auth/OAuthLogin";
import NotFound from "components/common/NotFound";
import UpdatePassword from "components/member/user/UpdatePassword";
import CartPage from "pages/cart/CartPage";
import ItemListPage from "pages/item/ItemListPage";
import ItemDetailPage from "pages/item/ItemDetailPage";

// ✅ ProtectedRoute Props 타입 지정
interface ProtectedRouteProps {
  element: JSX.Element;
  isAllowed: boolean;
}

// ✅ 로그인 및 권한 체크를 위한 보호 라우트
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAllowed }) => {
  return isAllowed ? element : <Navigate to="/" />;
};

// ✅ 라우트 배열 타입 지정
interface RouteConfig {
  path: string;
  element: JSX.Element;
  needAuth?: boolean;
  adminOnly?: boolean;
}

function App() {
  const isLogin = useAppSelect((state) => state.userReducer.isLogin);
  const role = useAppSelect((state) => state.userReducer.role);

  const authRoutes: RouteConfig[] = [
    { path: "/login/*", element: <LoginPage />, needAuth: false },
    { path: "/signup", element: <CreateAccountPage />, needAuth: false },
    { path: "/profile/*", element: <ProfilePage />, needAuth: true },
    { path: "/findPassword/*", element: <FindPasswordPage />, needAuth: false },
    { path: "/updatePassword/*", element: <UpdatePassword />, needAuth: false },
    { path: "/findEmail/*", element: <FindEmailPage />, needAuth: false },
  ];

  const adminRoutes: RouteConfig[] = [
    { path: "/admin/*", element: <AdminPage />, needAuth: true, adminOnly: true },
  ];

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ✅ 유저 관련 라우트 */}
        {authRoutes.map(({ path, element, needAuth }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute element={element} isAllowed={needAuth ? isLogin : !isLogin} />}
          />
        ))}

        {/* ✅ 아이템 관련 라우트 */}
        <Route path="/item/list" element={<ItemListPage />} />
        <Route path="/item/detail/:itemId" element={<ItemDetailPage />} />

        {/* ✅ 장바구니 라우트 */}
        <Route path="/cart/*" element={<ProtectedRoute element={<CartPage />} isAllowed={isLogin} />} />

        {/* ✅ 관리자 전용 라우트 */}
        {adminRoutes.map(({ path, element, adminOnly }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute element={element} isAllowed={isLogin && (!adminOnly || role === "ADMIN")} />}
          />
        ))}

        {/* ✅ OAuth 로그인 */}
        <Route path="/auth/naver-login" element={<OAuthLogin oauthType="NAVER" />} />
        <Route path="/auth/kakao-login" element={<OAuthLogin oauthType="KAKAO" />} />

        {/* ✅ 404 페이지 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
