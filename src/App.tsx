import { Provider, useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import Nabvar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ExplorePage from "@/pages/explore";
import HomePage from "@/pages/home";
import ProductDetailsPage from "@/pages/product-details";
import { SearchPage } from "@/pages/search";
import { useEffect, useState } from "react";

import BottomNavBar from "@/components/bottom-nav-bar";
import Loading from "@/components/loading";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/appwrite/api";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ProfilePage from "@/pages/profile";
import { login, logout } from "@/redux/authSlice";
import { RootState, store } from "@/redux/store";
import AuthLayout from "./pages/auth/Layout";
import ConfirmEmail from "./pages/confirm-email";
import ForgotPasswordPage from "./pages/forgot-password";
import PlaceOrderPage from "./pages/place-order";
import OrdersPage from "./pages/orders";
import TrackOrder from "./pages/TrackOrder";

//
export default () => {
  const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      Component: Layout,
      children: [
        // product routes
        { index: true, element: <Navigate to={"/category/all"} /> },
        { path: "search/", Component: SearchPage },
        { path: "search/:term", Component: ExplorePage },
        { path: "category/:category", Component: HomePage },
        { path: "product/:productId", Component: ProductDetailsPage },
        { path: "place-order/:productId", Component: PlaceOrderPage },

        // user routes
        { path: "profile", Component: ProfilePage },
        { path: "orders", Component: OrdersPage },
        { path: "orders/:orderId", Component: TrackOrder },
      ],
    },
    {
      id: "auth",
      path: "/auth",
      Component: AuthLayout,
      children: [
        {
          path: "login",
          Component: LoginPage,
        },
        {
          path: "register",
          Component: RegisterPage,
        },
        {
          path: "forgot-password",
          Component: ForgotPasswordPage,
        },
      ],
    },
    {
      path: "/confirm-email",
      element: <ConfirmEmail />,
    },
    { path: "*", Component: PageNotFound },
  ]);

  return (
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  );
};

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <main className="lg:mx-auto lg:w-[300px] lg:p-0 h-[calc(100vh-55px)] bg-background flex flex-col">
      <div className="m-auto space-y-3">
        <div className="space-x-4">
          <span>404</span> <small>|</small> <span>Page Not Found</span>
        </div>
        <Button variant={"ghost"} onClick={() => navigate(-1)}>
          <span className="mr-2">&larr;</span>
          Go Back
        </Button>
      </div>
    </main>
  );
};

const Layout = () => {
  const authStatus = useSelector(
    (state: RootState) => state.auth.isUserAuthenticated
  );
  const isExpended: boolean = useSelector(
    (state: RootState) => state.sidebar.isExpended
  );

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (!authStatus && !loading) return <Navigate to={"/auth/login"} />;

  return (
    <main
      className="lg:mx-auto flex lg:max-w-[300px] lg:justify-center"
      style={{
        width: isExpended ? "100vw" : "unset",
        overflow: isExpended ? "hidden" : "unset",
      }}
    >
      <Sidebar />
      <section
        className="w-full lg:mx-auto lg:p-0 h-screen bg-background flex flex-col transition-transform duration-200"
        style={{
          transform: isExpended ? "scale(.9) translateX(70vw)" : "unset",
        }}
      >
        <Nabvar />
        {!loading ? <Outlet /> : <Loading />}
        <BottomNavBar />
      </section>
    </main>
  );
};
