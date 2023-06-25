import {Link} from "react-router-dom";

function SideBar() {
    return (
        <div>
            <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                <ul className="nav menu">
                    <li className="active"><Link to="/"><svg className="glyph stroked dashboard-dial"><use xlinkHref="#stroked-dashboard-dial" /></svg> Home</Link></li>
                    <li><Link to="/contact"><svg className="glyph stroked calendar">
                        <use xlinkHref="#stroked-calendar" /></svg> Contact</Link></li>
                    <li><Link to="/about"><svg className="glyph stroked clock">
                        <use xlinkHref="#stroked-clock" /></svg> About</Link></li>
                    <li className="parent">
                        <a href="#">
                                <span data-toggle="collapse" href="#sub-item-1"><svg className="glyph stroked chevron-down">
                                    <use xlinkHref="#stroked-chevron-down" />
                                </svg></span> Products
                        </a>
                        <ul className="children collapse" id="sub-item-1">
                            <li>
                                <a className href="/products">
                                    <svg className="glyph stroked chevron-right">
                                        <use xlinkHref="#stroked-chevron-right">
                                        </use>
                                    </svg> All products
                                </a>
                            </li>
                            <li>
                                <a className href="/categories">
                                    <svg className="glyph stroked chevron-right">
                                        <use xlinkHref="#stroked-chevron-right">
                                        </use>
                                    </svg> Categories
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="parent">
                        <a href="fake_url">
                                <span data-toggle="collapse" href="#sub-item-2"><svg className="glyph stroked chevron-down">
                                    <use xlinkHref="#stroked-chevron-down" />
                                </svg></span> Access control
                        </a>
                        <ul className="children collapse" id="sub-item-2">
                            <li>
                                <a className href="fake_url">
                                    <svg className="glyph stroked chevron-right">
                                        <use xlinkHref="#stroked-chevron-right">
                                        </use>
                                    </svg> Roles
                                </a>
                            </li>
                            <li>
                                <a className href="fake_url">
                                    <svg className="glyph stroked chevron-right">
                                        <use xlinkHref="#stroked-chevron-right">
                                        </use>
                                    </svg> Users
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li><a href="#&quot;">
                        <svg className="glyph stroked male-user"><use xlinkHref="#stroked-cancel" /></svg> Logout</a>
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default SideBar;