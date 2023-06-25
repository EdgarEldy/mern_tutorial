function SideBar() {
    return (
        <div>
            <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
                <ul className="nav menu">
                    <li className="active"><a href>
                        <svg className="glyph stroked dashboard-dial">
                            <use xlinkHref="#stroked-dashboard-dial"></use>
                        </svg>
                        Dashboard</a></li>
                    <li><a href>
                        <svg className="glyph stroked calendar">
                            <use xlinkHref="#stroked-calendar"></use>
                        </svg>
                        Orders</a></li>
                    <li><a href>
                        <svg className="glyph stroked clock">
                            <use xlinkHref="#stroked-clock"></use>
                        </svg>
                        Customers</a></li>
                    <li className="parent">
                        <a href><span data-toggle="collapse" href="#sub-item-1"><svg
                            className="glyph stroked chevron-down">
                                    <use xlinkHref="#stroked-chevron-down"/>
                                </svg></span> Products
                        </a>
                        <ul className="children collapse" id="sub-item-1">
                            <li><a className href="/products">
                                <svg className="glyph stroked chevron-right">
                                    <use xlinkHref="#stroked-chevron-right">
                                    </use>
                                </svg>
                                All products
                            </a>
                            </li>
                            <li><a className href>
                                <svg className="glyph stroked chevron-right">
                                    <use xlinkHref="#stroked-chevron-right">
                                    </use>
                                </svg>
                                Categories
                            </a>
                            </li>
                        </ul>
                    </li>
                    <li className="parent">
                        <a href><span data-toggle="collapse" href="#sub-item-2"><svg
                            className="glyph stroked chevron-down">
                                    <use xlinkHref="#stroked-chevron-down"/>
                                </svg></span> Access control
                        </a>
                        <ul className="children collapse" id="sub-item-2">
                            <li><a className href>
                                <svg className="glyph stroked chevron-right">
                                    <use xlinkHref="#stroked-chevron-right">
                                    </use>
                                </svg>
                                Roles
                            </a>
                            </li>
                            <li><a className href>
                                <svg className="glyph stroked chevron-right">
                                    <use xlinkHref="#stroked-chevron-right">
                                    </use>
                                </svg>
                                Users
                            </a>
                            </li>
                        </ul>
                    </li>
                    <li><a href>
                        <svg className="glyph stroked male-user">
                            <use xlinkHref="#stroked-cancel"/>
                        </svg>
                        Logout</a>
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default SideBar;