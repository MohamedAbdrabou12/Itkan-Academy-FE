import { Outlet } from "react-router";
import GeneralManagerNavbar from "../shared/GeneralManagerNavbar";

const GeneralManagerLayout = () => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <GeneralManagerNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default GeneralManagerLayout;
