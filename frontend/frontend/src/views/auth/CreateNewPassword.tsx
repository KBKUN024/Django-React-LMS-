import { useState, useTransition } from "react";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { IoIosSave } from "react-icons/io";
import Swal from "sweetalert2";
import { apiClient } from "@/api/axios";

import { useNavigate, useSearchParams } from "react-router-dom";

function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, startTransition] = useTransition();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  console.log("params:", params);
  const otp = params.get("otp") as string;
  const uuidb64 = params.get("uuidb64") as string;
  // const refreshToken = params.get("refresh_token") as string;
  const changePassword = async () => {
    try {
      const formData = new FormData();
      formData.append("otp", otp);
      formData.append("uuidb64", uuidb64);
      // formData.append("refreshToken", refreshToken);
      formData.append("password", confirmPassword);

      const res = await apiClient.post("user/password-change/", formData);
      return res;
    } catch (error) {
      Swal.fire({
        title: "修改密码出错",
        icon: "error",
        text: error instanceof Error ? error.message : String(error),
      });
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && confirmPassword) {
      if (confirmPassword !== password) {
        Swal.fire({
          title: "确认密码和之前输入的不匹配",
          icon: "error",
        });
      }
      startTransition(async () => {
        const res = await changePassword();
        console.log("修改密码:", res);
        if (res?.status == 201) {
          Swal.fire({
            title: "密码修改成功！",
            icon: "success",
          });
          navigate("/login/");
        }
      });
    } else {
      Swal.fire({
        title: "密码不能为空",
        icon: "error",
      });
    }
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
                  <h1 className="mb-1 fw-bold">Create New Password</h1>
                  <span>Choose a new password for your account</span>
                </div>
                <Form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <Form.Group
                    className="mb-3"
                    controlId="new-password"
                  >
                    <Form.Label>Enter New Password</Form.Label>
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

                  <Form.Group
                    className="mb-3"
                    controlId="confirm-password"
                  >
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="**************"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid password.
                    </Form.Control.Feedback>
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
                            Saving...
                          </>
                        ) : (
                          <>
                            Save New Password{" "}
                            <IoIosSave style={{ marginLeft: 4 }} />
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

export default CreateNewPassword;
