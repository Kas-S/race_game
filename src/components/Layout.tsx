import { Outlet, Link} from "react-router-dom"

function Layout () {
    return (
        <>
            <nav>
                <div className="nav-wrapper">
                    <div className="nav-logo">
                        <a href="#">Async Race by Izzat Sotimkulov</a>
                    </div>
                    <ul className="nav-list">
                        <li><Link to="/">Garage</Link></li>
                        <li><Link to="/winners">Winners</Link></li>
                    </ul>
                </div>
            </nav>
            <br/>
            <Outlet/>
        </>
    )
}

export default Layout