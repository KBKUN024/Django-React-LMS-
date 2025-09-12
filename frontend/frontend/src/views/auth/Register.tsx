import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaUserPlus } from "react-icons/fa6";

import { register } from "@/api/auth";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import Swal from "sweetalert2";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, startTransition] = useTransition();

  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("e:", e);
    if (fullName && email && password && password2) {
      if (password !== password2) {
        Swal.fire({
          title: "密码不一致",
          icon: "error",
        });
        return;
      }
      startTransition(async () => {
        const { error } = await register(fullName, email, password, password2);
        if (error) {
          Swal.fire({
            title: "出错",
            icon: "error",
            text: error.toString(),
          });
        } else {
          Swal.fire({
            title: "Registration",
            text: "Registration Successfull, you have now been logged in",
            icon: "success",
          });
          navigate("/");
        }
      });
      return;
    }
    Swal.fire({
      title: "你应该填写所有字段",
      icon: "warning",
    });
    return;
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
                  <h1 className="mb-1 fw-bold">Sign up</h1>
                  <span>
                    Already have an account?
                    <Link
                      to="/login/"
                      className="ms-1"
                    >
                      Sign In
                    </Link>
                  </span>
                </div>
                {/* Form */}
                <Form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  {/* Username(Full Name) */}
                  <Form.Group
                    className="mb-3"
                    controlId="full_name"
                  >
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      placeholder="John Doe"
                      required
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="email"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="johndoe@gmail.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="confirm_password"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      placeholder="**************"
                      required
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </Form.Group>
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
                            {"Sign Up"}
                            <FaUserPlus />
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

export default Register;
