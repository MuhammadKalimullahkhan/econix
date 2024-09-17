import { RootState } from "@/redux/store";
import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";

const RequiredLogin: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isUserAuthenticated = useSelector(
    (state: RootState) => state.auth.isUserAuthenticated
  );

  return isUserAuthenticated && user && <>{children}</>;
};
export default RequiredLogin;
