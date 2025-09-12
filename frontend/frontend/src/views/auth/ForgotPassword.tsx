import { useTransition, useState } from "react";

import { apiClient } from "@/api/axios";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { MdLockReset } from "react-icons/md";
import Swal from "sweetalert2";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, startTransition] = useTransition();
  const forgotPassword = async () => {
    const res = await apiClient.get(`/user/password-reset/${email}`);
    return res;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      startTransition(async () => {
        const res = await forgotPassword();
        console.log("重置密码,res:", res);
        if (res.data.username == "") {
          Swal.fire({
            title: "当前用户不存在",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "密码重置",
            icon: "success",
            text: `已经向您的邮箱📮:${email}中发送了一封邮件，请注意查收！`,
          });
        }
      });
      return;
    }
    Swal.fire({
      title: "邮箱不能为空",
      icon: "error",
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
            mg={8}
            className="py-8 py-xl-0"
          >
            <Card className="shadow">
              <Card.Body className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Forgot Password</h1>
                  <span>Let's help you get back into your account</span>
                </div>
                <Form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      className="form-control"
                      name="email"
                      placeholder="johndoe@gmail.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <div className="d-grid">
                      <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              style={{ verticalAlign: "middle" }}
                            ></span>
                            Resetting...
                          </>
                        ) : (
                          <>
                            {"Reset Password "}
                            <MdLockReset />
                          </>
                        )}
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ForgotPassword;
