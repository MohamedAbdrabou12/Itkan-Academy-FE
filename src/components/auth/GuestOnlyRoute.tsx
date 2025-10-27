import { useGetMe } from "@/hooks/auth/useGetMe";
import { getHomePath } from "@/utils/getHomePath";
import { Navigate, Outlet } from "react-router";
import Spinner from "../shared/Spinner";

const GuestOnlyRoute = () => {
  const { me, isPending } = useGetMe();

  if (isPending) return <Spinner />;

  if (me) return <Navigate to={getHomePath(me.role)} replace />;

  return <Outlet />;
};

export default GuestOnlyRoute;
