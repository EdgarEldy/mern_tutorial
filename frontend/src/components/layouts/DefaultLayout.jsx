import Nav from "../partials/Nav";
import SideBar from "../partials/SideBar";
import {Outlet} from "react-router";

function DefaultLayout() {
    return (
        <div>
            <Nav/>
            <SideBar/>
            <div className="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main">
                <div className="row">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;