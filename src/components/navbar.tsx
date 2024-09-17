import { toggleSidebar } from "@/redux/sidebarSlice";
import { ChevronLeft, Menu } from "react-feather";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./profile-dropdown";
import { Button } from "./ui/button";

const Nabvar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    !location.pathname.includes("/auth/") && (
      <nav className="px-4 h-[55px] border-b flex items-center justify-between mb-8 py-2">
        {location.pathname.includes("/category/") ? (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              dispatch(toggleSidebar(""));
            }}
          >
            <Menu size={18} />
          </Button>
        ) : (
          <Button size={"icon"} variant={"ghost"} onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
          </Button>
        )}
        <span className="text-2xl font-bold font-amster tracking-widest">
          {import.meta.env.VITE_APP_NAME.toUpperCase()}
        </span>
        <ProfileDropdown />
      </nav>
    )
  );
};

export default Nabvar;
