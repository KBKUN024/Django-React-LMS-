import { useState, useTransition } from "react";

import { login } from "@/api/auth";
import { PiSignInBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      if (email && password) {
        const { error } = await login(email, password);
        if (error) {
          Swal.fire({
            title: "登录出错",
            icon: "error",
            text: error,
          });
        } else {
          navigate("/");
        }
      } else {
        Swal.fire({
          title: "邮箱或者密码不能为空",
          icon: "error",
        });
      }
    });
  };

  return (
    <>
      <Container
        className="d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <Row className="align-items-center justify-content-center g-0 h-lg-100 py-8">
          <Col
            lg={5}
            md={8}
            className="py-8 py-xl-0"
          >
            <Card className="shadow">
              <Card.Body className="p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign in</h1>
                  <span>
                    Don’t have an account?
                    <Link
                      to="/register/"
                      className="ms-1"
                    >
                      Sign up
                    </Link>
                  </span>
                </div>
                {/* Form */}
                <Form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  {/* Username */}
                  <Form.Group
                    className="mb-3"
                    controlId="email"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="johndoe@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid username.
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Password */}
                  <Form.Group
                    className="mb-3"
                    controlId="password"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="**************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Checkbox & Forgot */}
                  <div className="d-lg-flex justify-content-between align-items-center mb-4">
                    <Form.Group
                      controlId="rememberme"
                      className="mb-0"
                    >
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <Form.Control.Feedback type="invalid">
                        You must agree before submitting.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div>
                      <Link to="/forgot-password/">Forgot your password?</Link>
                    </div>
                  </div>
                  <div>
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              style={{ verticalAlign: "middle" }}
                            ></span>
                            Loading
                          </>
                        ) : (
                          <>
                            {"Sign In "}
                            <PiSignInBold />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
