import { RootState } from "@/redux/store";
import { ChevronRight, LogOut } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { logout } from "@/redux/authSlice";
import { toggleSidebar } from "@/redux/sidebarSlice";
import { useSignOutAccount } from "@/lib/react-query/queries";

interface INavLink {
  name: string;
  slug: string;
}
const Header = () => {
  const userData: any = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="p-2 w-full bg-background rounded-lg">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage
            src={userData && userData.imageUrl}
            alt="profile image"
          />
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>

        <div className="max-w-full overflow-hidden whitespace-nowrap">
          <p className="capitalize">{userData && userData.name}</p>
          <p className="lowercase">{userData && userData.email}</p>
        </div>
      </div>
    </header>
  );
};

const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="">{children}</div>;
};

const NavLink = ({ name, slug }: INavLink) => {
  const dispatch = useDispatch();

  return (
    <li onClick={() => dispatch(toggleSidebar(""))}>
      <Link
        to={slug}
        className="capitalize flex items-center justify-between w-full h-full p-2 rounded-lg border-b hover:bg-background"
      >
        <span>{name}</span>
        <ChevronRight size={16} />
      </Link>
    </li>
  );
};

const Links = () => {
  const navLinks = [
    { name: "home", slug: "/" },
    { name: "profile", slug: "/profile" },
  ];

  return (
    <ul className="mt-12 space-y-4">
      {navLinks.map((link, i) => (
        <NavLink key={i} name={link.name} slug={link.slug} />
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
  };

  return (
    <aside
      className="box-border p-3 h-[calc(100dvh)] flex flex-col bg-accent"
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
      <Content>
        <Links />
      </Content>

      <Button className="mt-auto" onClick={logoutHandler}>
        Log Out <LogOut size={16} className="ml-4" />
      </Button>
    </aside>
  );
};

export default Sidebar;
