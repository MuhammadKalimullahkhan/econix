import { useSignOutAccount } from "@/lib/react-query/queries";
import { logout } from "@/redux/authSlice";
import { toggleSidebar } from "@/redux/sidebarSlice";
import { RootState } from "@/redux/store";
import { ChevronRight, Home, LogOut, User } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface INavLink {
  name: string;
  slug: string;
  icon: any;
}
const Header = () => {
  const userData: any = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="w-full">
      <div className="relative w-full h-[200px]">
        <img
          src={userData && userData.imageUrl}
          className="w-full h-full object-cover object-top"
          alt="profile image"
        />
        <div className="text-background p-3 w-full absolute left-0 bottom-0 flex gap-3">
          <div className="max-w-full overflow-hidden whitespace-nowrap">
            <p className="capitalize text-xl font-bold">
              {userData && userData.name}
            </p>
            <p className="lowercase">{userData && userData.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="">{children}</div>;
};

const NavLink = ({ name, slug, icon }: INavLink) => {
  const dispatch = useDispatch();

  return (
    <li onClick={() => dispatch(toggleSidebar(""))}>
      <Link
        to={slug}
        className="capitalize flex items-center justify-between w-full h-full p-2 rounded-lg hover:bg-background"
      >
        <span className="inline-flex gap-2 items-center">
          {icon}
          {name}
        </span>
        <ChevronRight size={16} />
      </Link>
    </li>
  );
};

const Links = () => {
  const navLinks = [
    { name: "home", slug: "/", icon: <Home size={16} /> },
    { name: "profile", slug: "/profile", icon: <User size={16} /> },
  ];

  return (
    <ul className="mt-12 space-y-4">
      {navLinks.map((link, i) => (
        <NavLink key={i} icon={link.icon} name={link.name} slug={link.slug} />
      ))}
    </ul>
  );
};

const Sidebar = () => {
  const isexpended: boolean = useSelector(
    (state: RootState) => state.sidebar.isExpended
  );

  const { mutate: signOut } = useSignOutAccount();

  const dispatch = useDispatch();
  const logoutHandler = () => {
    signOut();
    dispatch(logout());
    dispatch(toggleSidebar(""));
  };

  return (
    <aside
      className="box-border h-[calc(100dvh)] flex flex-col bg-accent"
      style={{
        zIndex: 99999,
        transition: "all 200ms",
        minWidth: isexpended ? "65%" : "0%",
        transform: !isexpended ? "translateX(-100vw)" : "translateX(0)",
        // position: isexpended ? "unset" : "absolute",
        position: "absolute",
      }}
    >
      <Header />

      <div className="p-3">
        <Content>
          <Links />
        </Content>
      </div>
      <Button
        variant={"ghost"}
        className="bg-white mt-auto"
        onClick={logoutHandler}
      >
        Log Out <LogOut size={16} className="ml-4" />
      </Button>
    </aside>
  );
};

export default Sidebar;
