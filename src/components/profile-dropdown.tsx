import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const userData: any = useSelector((state: RootState) => state.auth.user);

  const { mutate: signOut } = useSignOutAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    signOut();
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={userData && userData.imageUrl} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap capitalize">
            {userData && userData.name}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutHandler}>
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
