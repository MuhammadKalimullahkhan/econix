import { Provider, useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import Nabvar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import ExplorePage from "@/pages/explore";
import HomePage from "@/pages/home";
import Login from "@/pages/login";
import ProductDetailsPage from "@/pages/product-details";
import Register from "@/pages/register";
import { SearchPage } from "@/pages/search";
import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { login, logout } from "@/redux/authSlice";
import { RootState, store } from "@/redux/store";
import Sidebar from "./components/sidebar";
import { Toaster } from "./components/ui/toaster";
import { getCurrentUser } from "./lib/appwrite/api";
import ProfilePage from "./pages/profile";

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
        { path: "/search/", Component: SearchPage },
        { path: "/search/:term", Component: ExplorePage },
        { path: "/category/:category", Component: HomePage },
        { path: "/product/:productId", Component: ProductDetailsPage },

        // user routes
        { path: "/profile", Component: ProfilePage },

        { path: "*", Component: PageNotFound },
        {
          id: "login",
          path: "auth/login",
          element: <Login />,
          loader: () => null,
        },
        {
          path: "auth/register",
          element: <Register />,
          loader: () => "register Loader..",
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

const PageNotFound = () => {
  return (
    <main className="lg:mx-auto lg:w-[300px] lg:p-0 h-[calc(100vh-55px)] bg-background flex flex-col">
      <div className="m-auto space-y-3">
        <div className="space-x-4">
          <span>404</span> <small>|</small> <span>Page Not Found</span>
        </div>
        <Link className={buttonVariants({ variant: "ghost" })} to={"/"}>
          <span className="mr-2">&larr;</span>
          Back to Home
        </Link>
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

  const navigate = useNavigate();
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

  useEffect(() => {
    if (authStatus) {
      navigate("/");
    } else {
      navigate("/auth/login");
    }
  }, [authStatus, navigate]);

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
        className="w-full lg:mx-auto lg:p-0 h-[calc(100vh-55px)] bg-background flex flex-col transition-transform duration-200"
        style={{
          transform: isExpended ? "scale(.9) translateX(70vw)" : "unset",
        }}
      >
        <Toaster />
        <Nabvar />
        {!loading ? <Outlet /> : <Loading />}
      </section>
    </main>
  );
};
