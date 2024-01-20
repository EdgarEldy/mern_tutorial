import SideBar from "../partials/SideBar";
import { Outlet } from "react-router";
import TopBar from "../partials/TopBar";
import Footer from "../partials/Footer";

function DefaultLayout() {
  return (
    <div id="wrapper">
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopBar />
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;
