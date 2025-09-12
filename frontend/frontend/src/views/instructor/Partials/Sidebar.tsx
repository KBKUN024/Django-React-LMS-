import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Card, Offcanvas } from "react-bootstrap";
import {
    BsGrid,
    BsCart,
    BsPlus,
    BsStar,
    BsBook,
    BsCurrencyDollar,
    BsEnvelope,
    BsPerson,
    BsLock,
    BsBoxArrowRight,
    BsTag,
    BsList,
} from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";

import { useState } from "react";

function Sidebar() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sidebarContent = (
        <Nav className="flex-column">
            <Nav.Item>
                <h5 className="px-3 py-2 text-muted border-bottom">Menu</h5>
            </Nav.Item>

            <Nav.Link as={Link} to="/instructor/dashboard/" className="d-flex align-items-center py-2">
                <BsGrid className="me-2" /> Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/courses/" className="d-flex align-items-center py-2">
                <BsBook className="me-2" />My Courses
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/create-course/" className="d-flex align-items-center py-2">
                <BsPlus className="me-2" />Create Course
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/reviews/" className="d-flex align-items-center py-2">
                <BsStar className="me-2" />Review
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/students/" className="d-flex align-items-center py-2">
                <BsPerson className="me-2" />Students
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/earning/" className="d-flex align-items-center py-2">
                <BsCurrencyDollar className="me-2" />Earning
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/orders/" className="d-flex align-items-center py-2">
                <BsCart className="me-2" /> Orders
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/coupon/" className="d-flex align-items-center py-2">
                <BsTag className="me-2" /> Coupons
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/notifications/" className="d-flex align-items-center py-2">
                <MdNotificationsNone className="me-2" /> Notifications
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/question-answer/" className="d-flex align-items-center py-2">
                <BsEnvelope className="me-2" /> Q/A
            </Nav.Link>

            <Nav.Item>
                <h6 className="px-3 py-2 text-muted border-bottom border-top mt-2">Account Settings</h6>
            </Nav.Item>

            <Nav.Link as={Link} to="/instructor/profile/" className="d-flex align-items-center py-2">
                <BsPerson className="me-2" /> Edit Profile
            </Nav.Link>

            <Nav.Link as={Link} to="/instructor/change-password/" className="d-flex align-items-center py-2">
                <BsLock className="me-2" /> Change Password
            </Nav.Link>

            <Nav.Link as={Link} to="/login/" className="d-flex align-items-center py-2 text-danger">
                <BsBoxArrowRight className="me-2" /> Sign Out
            </Nav.Link>
        </Nav>
    );

    return (
        <>
            {/* 移动端菜单按钮 */}
            <div className="d-lg-none mb-3">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleShow}
                >
                    <BsList className="me-2" />
                    Menu
                </button>
            </div>

            {/* 桌面端侧边栏 */}
            <div className="col-lg-3 col-md-4 d-none d-md-block">
                <Card>
                    <Card.Body className="p-0">
                        {sidebarContent}
                    </Card.Body>
                </Card>
            </div>

            {/* 移动端侧边栏 (Offcanvas) */}
            <Offcanvas show={show} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Instructor Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    {sidebarContent}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Sidebar;
