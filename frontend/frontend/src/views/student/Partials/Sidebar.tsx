import { Link } from "react-router-dom";
import { BsGridFill } from "react-icons/bs";
import { FaShoppingCart, FaHeart, FaEdit, FaLock, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
    return (
        <div className="col-lg-3 col-md-4 col-12">
            <nav className="navbar navbar-expand-md shadow-sm mb-4 mb-lg-0 sidenav">
                <a
                    className="d-xl-none d-lg-none d-md-none text-inherit fw-bold text-decoration-none text-dark p-3"
                    href="#"
                >
                    Menu
                </a>
                <button
                    className="navbar-toggler d-md-none icon-shape icon-sm rounded bg-primary text-light m-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidenav"
                    aria-controls="sidenav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="bi bi-grid" />
                </button>
                <div className="collapse navbar-collapse p-3" id="sidenav">
                    <div className="navbar-nav flex-column">
                        <ul className="list-unstyled ms-n2 mb-4">
                            <li className="nav-item">
                                <Link className="nav-link" to={`/student/dashboard/`}>
                                    {" "}
                                    <BsGridFill className="mb-1 me-2" />Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/student/courses/`}>
                                    {" "}
                                    <FaShoppingCart className="mb-1 me-2" />My Courses
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to={`/student/wishlist/`}>
                                    {" "}
                                    <FaHeart className="mb-1 me-2" /> Wishlist{" "}
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to={`/student/question-answer/`}>
                                    {" "}
                                    <FaEnvelope className="mb-1 me-2" /> Q/A{" "}
                                </Link>
                            </li> */}
                        </ul>

                        {/* Navbar header */}
                        <span className="navbar-header mb-3">Account Settings</span>
                        <ul className="list-unstyled ms-n2 mb-0">
                            <li className="nav-item">
                                <Link className="nav-link" to={`/student/profile/`}>
                                    {" "}
                                    <FaEdit className="mb-1 me-2" /> Edit Profile
                                </Link>
                            </li>
                            <li className="nav-item ">
                                <Link className="nav-link" to={`/student/change-password/`}>
                                    {" "}
                                    <FaLock className="mb-1 me-2" /> Change Password
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/login/`}>
                                    {" "}
                                    <FaSignOutAlt className="mb-1 me-2" /> Sign Out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
