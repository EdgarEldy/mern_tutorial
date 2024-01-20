import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div>
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gray-200 sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="index.html"
        >
          <div className="sidebar-brand-icon rotate-n-15"></div>
          <div className="sidebar-brand-text mx-3">REACT.JS TUTORIAL</div>
        </a>
        {/* Nav Item - Dashboard */}
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="fas fa-fw fa-home" />
            <span>Accueil</span>
          </Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" href>
            <i className="fas fa-shopping-cart" />
            <span>Orders</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href>
            <i className="fas fa-fw fa-users" />
            <span>Customers</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href
            className="nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseEvents"
            aria-expanded="true"
            aria-controls="collapseEvents"
          >
            <i className="fas fa-fw fa-shopping-bag" />
            <span>Products</span>
          </a>
          <div
            id="collapseEvents"
            className="collapse"
            aria-labelledby="headingEvents"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href>
                All
              </a>
              <a className="collapse-item" href>
                Categories
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a
            href
            className="nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseSettings"
            aria-expanded="true"
            aria-controls="collapseSettings"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Access control</span>
          </a>
          <div
            id="collapseSettings"
            className="collapse"
            aria-labelledby="headingSettings"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href>
                Roles
              </a>
              <a className="collapse-item" href>
                Users
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" href>
            <i className="fas fa-fw fa-sign-out-alt" />
            <span>Logout</span>
          </a>
        </li>
        {/* Sidebar Toggler (Sidebar) */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" />
        </div>
      </ul>
    </div>
  );
}

export default SideBar;
