import { Link } from "react-router-dom";
import { useAuthStore } from "@/store";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Navbar, Nav, NavDropdown, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { useEffect, useState, useCallback } from "react";
import Cookie from "js-cookie";

function BaseHeader() {
  const { cart_count, isTeacher, allUserData, isLoggedIn } = useAuthStore();
  
  // 改进的登录状态检查：结合多个来源
  const checkLoggedInStatus = useCallback(() => {
    const hasTokens = !!(Cookie.get("access_token") && Cookie.get("refresh_token"));
    const hasUserData = !!allUserData && !!allUserData.user_id;
    const storeLoggedIn = isLoggedIn();
    
    // 只有当所有条件都满足时才认为用户已登录
    return hasTokens && hasUserData && storeLoggedIn;
  }, [allUserData, isLoggedIn]);
  
  const [userLoggedIn, setUserLoggedIn] = useState(checkLoggedInStatus());
  const [current_user_role, setCurrentRole] = useState(false) // true:teacher,false:student
  const [isShowRole, setRoleShow] = useState(false)
  
  console.log('BaseHeader - userLoggedIn:', userLoggedIn)
  console.log('BaseHeader - allUserData:', allUserData)
  console.log('BaseHeader - hasTokens:', !!(Cookie.get("access_token") && Cookie.get("refresh_token")))
  console.log('BaseHeader - isTeacher:', isTeacher?.() ?? false)
  
  useEffect(() => {
    const loggedIn = checkLoggedInStatus();
    setUserLoggedIn(loggedIn);
    
    if (!loggedIn) {
      setRoleShow(false);
      setCurrentRole(false);
      return;
    }
    
    setRoleShow(true);
    setCurrentRole(isTeacher?.() ?? false);
  }, [allUserData, cart_count, checkLoggedInStatus, isTeacher]); // 监听关键状态变化
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          T-Yuan.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/pages/contact-us/">
              <i className="fas fa-phone"></i> Contact Us
            </Nav.Link>
            <Nav.Link as={Link} to="/pages/about-us/">
              <i className="fas fa-address-card"></i> About Us
            </Nav.Link>
            {
              isShowRole && current_user_role &&
              <NavDropdown title={<><i className="fas fa-chalkboard-user"></i> Instructor</>} id="instructor-dropdown">
                <NavDropdown.Item as={Link} to="/instructor/dashboard/">
                  <i className="bi bi-grid-fill"></i> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/courses/">
                  <i className="fas fa-shopping-cart"></i> My Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/create-course/">
                  <i className="fas fa-plus"></i> Create Course
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/reviews/">
                  <i className="fas fa-star"></i> Reviews
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/question-answer/">
                  <i className="fas fa-envelope"></i> Q/A
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/students/">
                  <i className="fas fa-users"></i> Students
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/earning/">
                  <i className="fas fa-dollar-sign"></i> Earning
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/instructor/profile/">
                  <i className="fas fa-gear"></i> Settings & Profile
                </NavDropdown.Item>
              </NavDropdown>
            }

            {
              isShowRole && !current_user_role &&
              <NavDropdown title={<><i className="fas fa-graduation-cap"></i> Student</>} id="student-dropdown">
                <NavDropdown.Item as={Link} to="/student/dashboard/">
                  <i className="bi bi-grid-fill"></i> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/courses/">
                  <i className="fas fa-shopping-cart"></i> My Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/wishlist/">
                  <i className="fas fa-heart"></i> Wishlist
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/question-answer/">
                  <i className="fas fa-envelope"></i> Q/A
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/profile/">
                  <i className="fas fa-gear"></i> Profile & Settings
                </NavDropdown.Item>
              </NavDropdown>
            }

          </Nav>

          <Form className="d-flex me-3">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search Courses"
                aria-label="Search Courses"
              />
              <Button variant="outline-success" type="submit">
                Search <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>

          <div className="d-flex">
            {userLoggedIn ? (
              <Link to="/logout/" className="btn btn-primary ms-2">
                Logout <FaSignOutAlt />
              </Link>
            ) : (
              <Link to="/login/" className="btn btn-success ms-2">
                LogIn <FaSignInAlt />
              </Link>
            )}

            {!userLoggedIn && (
              <Link to="/register/" className="btn btn-primary ms-2">
                Register <i className="fas fa-user-plus"></i>
              </Link>
            )}

            {userLoggedIn && (
              <Link to="/cart/" className="btn btn-success ms-2">
                Cart ({cart_count}) <i className="fas fa-shopping-cart"></i>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BaseHeader;
