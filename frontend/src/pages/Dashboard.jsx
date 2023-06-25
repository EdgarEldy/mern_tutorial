function Dashboard() {
    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">Dashboard</h1>
                </div>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
                <a href>
                    <div className="panel panel-orange panel-widget">
                        <div className="row no-padding">
                            <div className="col-sm-3 col-lg-5 widget-left">
                                <svg className="glyph table">
                                    <use xlinkHref="#stroked-table"></use>
                                </svg>
                            </div>
                            <div className="col-sm-9 col-lg-7 widget-right">
                                <div className="text-muted">Orders</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <script type="text/javascript">
            </script>
            <div className="col-xs-12 col-md-6 col-lg-3">
                <a href>
                    <div className="panel panel-teal panel-widget">
                        <div className="row no-padding">
                            <div className="col-sm-3 col-lg-5 widget-left">
                                <svg className="glyph stroked calendar">
                                    <use xlinkHref="#stroked-calendar"></use>
                                </svg>
                            </div>
                            <div className="col-sm-9 col-lg-7 widget-right">
                                <div className="text-muted">Customers</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
                <a href>
                    <div className="panel panel-blue panel-widget ">
                        <div className="row no-padding">
                            <div className="col-sm-3 col-lg-5 widget-left">
                                <svg className="glyph stroked clock">
                                    <use xlinkHref="#stroked-clock"></use>
                                </svg>
                            </div>
                            <div className="col-sm-9 col-lg-7 widget-right">
                                <div className="text-muted">products</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
                <a href>
                    <div className="panel panel-red panel-widget">
                        <div className="row no-padding">
                            <div className="col-sm-3 col-lg-5 widget-left">
                                <svg className="glyph stroked male user">
                                    <use xlinkHref="#stroked-male-user"></use>
                                </svg>
                            </div>
                            <div className="col-sm-9 col-lg-7 widget-right">
                                <div className="text-muted">Profile</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default Dashboard;