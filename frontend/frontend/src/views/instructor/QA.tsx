import { useState, useEffect, useRef } from "react";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import { Container, Row, Col, Card, Form, Button, Modal, ListGroup, Badge } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAuthenticatedAxios } from '@/api/axios';
import { getCurrentTeacherId, getCurrentUserId } from '@/api/constants';
import { FaEnvelope, FaArrowRight, FaSpinner, FaPaperPlane, FaPlane } from "react-icons/fa";
import type { TeacherQuestionAndAnsWer } from '@/types'
import dayjs from 'dayjs'
import Toast from '@/utils/SweetAlert2/Toast'
function QA() {
  const authAxios = createAuthenticatedAxios();
  const teacherId = getCurrentTeacherId();
  const userId = getCurrentUserId();
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TeacherQuestionAndAnsWer | null>(null);
  const lastElementRef = useRef<HTMLAnchorElement>(null)
  const [createMessage, setCreateMessage] = useState({
    title: "",
    message: "",
  });
  const fetchQuestions = async (): Promise<TeacherQuestionAndAnsWer[]> => {
    const response = await authAxios.get(`teacher/question-answer-list/${teacherId}/`);
    return response.data;
  };

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions', teacherId],
    queryFn: fetchQuestions,
    enabled: !!teacherId,
  });
  console.log('questions:', questions)

  const handleJoinConversation = (question: TeacherQuestionAndAnsWer) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };
  console.log('selectedQuestion: ', selectedQuestion)
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
  };
  const mutation = useMutation({
    mutationFn: async () => {
      const formdata = new FormData();
      formdata.append("course_id", String(selectedQuestion?.course.course_id));
      formdata.append("user_id", String(userId));
      formdata.append("message", createMessage.message);
      formdata.append("qa_id", String(selectedQuestion?.qa_id));

      const res = await authAxios.post(`student/question-answer-message-create/`, formdata)
      return res.data
    },
    onSuccess: (data) => {
      console.log('data:', data)
      queryClient.invalidateQueries({ queryKey: ['questions', teacherId] })
      setSelectedQuestion(data.question)
      setCreateMessage(prev=>({
        ...prev,
        message:''
      }))
    }
  })
  const sendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if(createMessage.message == ''){
      Toast.fire({
        icon:'error',
        text:'message 不能为空'
      })
      return
    }
    mutation.mutate()
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCreateMessage({
      ...createMessage,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedQuestion]);

  return (
    <>
      <section className="pt-5 pb-5">
        <Container>
          {/* Header Here */}
          <Header />
          <Row className="mt-0 mt-md-4">
            {/* Sidebar Here */}
            <Sidebar />
            <Col lg={9} md={8} xs={12}>
              <h4 className="mb-0 mb-1">
                <FaEnvelope className="me-2" /> Question and Answer
              </h4>

              <Card>
                {/* Card header */}
                <Card.Header className="border-bottom p-0 pb-3">
                  {/* Title */}
                  <h4 className="mb-3 p-3">Discussion</h4>
                  <Form className="row g-4 p-3">
                    {/* Search */}
                    <Col sm={12} lg={12}>
                      <div className="position-relative">
                        <Form.Control
                          type="search"
                          placeholder="Search Questions"
                          className="pe-5 bg-transparent"
                        />
                      </div>
                    </Col>
                  </Form>
                </Card.Header>

                {/* Card body */}
                <Card.Body className="p-0 pt-3">
                  <div className="vstack gap-3 p-3">
                    {isLoading && (
                      <div className="text-center p-3">
                        <FaSpinner className="fa-spin" /> Loading questions...
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger">
                        Error loading questions. Please try again.
                      </div>
                    )}

                    {questions && questions.length === 0 && (
                      <div className="text-center p-3">
                        <p>No questions yet.</p>
                      </div>
                    )}

                    {questions?.map((question) => (
                      <div className="shadow rounded-3 p-3" key={question.id}>
                        <div className="d-sm-flex justify-content-sm-between mb-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm flex-shrink-0">
                              <img
                                src={question.profile.image || "https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-4.jpg"}
                                className="avatar-img rounded-circle"
                                alt="avatar"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="ms-2">
                              <h6 className="mb-0">
                                <a
                                  href="#"
                                  className="text-decoration-none text-dark"
                                >
                                  {question.profile.full_name}
                                </a>
                              </h6>
                              <small>{dayjs(question.date).format('YYYY.MM.DD HH:MM:ss')}</small>
                            </div>
                          </div>
                        </div>
                        <h5>
                          {question.title}{" "}
                          <Badge bg="success">{question.messages.length}</Badge>
                        </h5>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mb-3 mt-3"
                          onClick={() => handleJoinConversation(question)}
                        >
                          Join Conversation <FaArrowRight className="ms-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Conversations Modal */}
      <Modal show={showModal} size="lg" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Question: {selectedQuestion?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border p-2 p-sm-4 rounded-3">
            <ul
              className="list-unstyled mb-0"
              style={{ overflowY: "scroll", height: "500px" }}
            >
              {
                selectedQuestion?.messages.map((sq, index) => (
                  <li key={index} className="comment-item mb-3">
                    <div className="d-flex">
                      <div className="avatar avatar-sm flex-shrink-0">
                        <a href="#">
                          <img
                            className="avatar-img rounded-circle"
                            src={!sq?.profile.image?.startsWith('http') ? 'http://127.0.0.1:8000' + sq?.profile.image : sq?.profile.image || "https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-4.jpg"}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            alt="student avatar"
                          />
                        </a>
                      </div>
                      <div className="ms-2">
                        {/* Comment by */}
                        <div className="bg-light p-3 rounded w-100">
                          <div className="d-flex w-100 justify-content-center">
                            <div className="me-2 ">
                              <h6 className="mb-1 lead fw-bold">
                                <a
                                  href="#!"
                                  className="text-decoration-none text-dark"
                                >
                                  {sq?.profile.full_name}
                                </a>
                                <br />
                                <span style={{ fontSize: "12px", color: "gray" }}>
                                  {dayjs(sq?.date).format('YYYY.MM.DD HH:MM:ss')}
                                </span>
                                <p>
                                  {sq.message}
                                </p>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              }
              <a ref={lastElementRef}></a>

            </ul>

            <Form onSubmit={sendNewMessage} className="w-100 d-flex">
              <Form.Control
                as="textarea"
                name="message"
                className="one pe-4 w-75 bg-light"
                rows={2}
                placeholder="What's your question?"
                defaultValue={createMessage.message}
                onChange={handleMessageChange}
              />
              <Button className="ms-2 mb-0 w-25" type="submit" disabled={mutation.isPending}>
                {
                  mutation.isPending ?
                    <>
                      Sending... <FaSpinner className="fa-spin ms-1" />
                    </>
                    :
                    <>
                      Post <FaPlane className="fa-spin ms-1" />
                    </>
                }

              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default QA;
