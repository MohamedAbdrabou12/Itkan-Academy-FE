import { Outlet } from "react-router";

const GuestOnlyRoute = () => {
  // const { me, isPending } = useGetMe();

  // if (isPending) return <Spinner />;

  // if (me) return <Navigate to={getHomePath(me.role)} replace />;

  return <Outlet />;
};

export default GuestOnlyRoute;
