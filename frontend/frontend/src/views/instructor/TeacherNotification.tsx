import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAuthenticatedAxios } from '@/api/axios';
import { getCurrentTeacherId } from '@/api/constants';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import type { NotificationType } from '@/types'
import dayjs from 'dayjs'
import Toast from '@/utils/SweetAlert2/Toast'
import { FaCheck, FaCheckDouble } from "react-icons/fa";

function TeacherNotification() {
  const authAxios = createAuthenticatedAxios();
  const teacherId = getCurrentTeacherId();
  const queryClient = useQueryClient()

  const fetchNotifications = async (): Promise<NotificationType[]> => {
    const res = await authAxios.get(`teacher/notification-list/${teacherId}/`);
    return res.data;
  };

  const markNotification = async (notification_id: number) => {
    const res = await authAxios.patch(`teacher/notification-detail/${teacherId}/${notification_id}/`, {
      seen: true
    })
    return res.data
  }

  const mutation = useMutation({
    mutationFn: (variables: { notification_id: number }) => markNotification(variables.notification_id),
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['notifications-list', teacherId] })
      Toast.fire({
        icon: 'success',
        text: '标记成功🏅'
      })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: '标记失败☹️' + error
      })
    }
  })

  const markAsSeen = (notification_id: number) => {
    mutation.mutate({ notification_id: notification_id })
  }

  const { data: notifications } = useQuery({
    queryKey: ['notifications-list', teacherId],
    queryFn: fetchNotifications,
    enabled: !!teacherId, // 只有当teacherId存在时才执行查询
  });
  console.log('notifications:', notifications)
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
              {/* Card */}
              <Card className="mb-4">
                {/* Card header */}
                <Card.Header className="d-lg-flex align-items-center justify-content-between">
                  <div className="mb-3 mb-lg-0">
                    <h3 className="mb-0">Notifications</h3>
                    <span>Manage all your notifications from here</span>
                  </div>
                </Card.Header>
                {/* Card body */}
                <Card.Body>
                  {/* List group */}
                  <ListGroup variant="flush">
                    {/* List group item */}
                    {
                      notifications?.map((noti, index) => (
                        <ListGroup.Item key={index} className="p-4 shadow rounded-3">
                          <div className="d-flex">
                            <div className="ms-3 mt-2">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h4 className="mb-0">{noti.type}</h4>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="mt-1">
                                  <span className="me-2 fw-bold">
                                    Date: <span className="fw-light">{dayjs(noti.date).format('DD/MM/YY')}</span>
                                  </span>
                                </p>
                                <p>
                                  <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => markAsSeen(noti.id)}
                                    disabled={noti.seen}
                                    className="text-white fw-bold"
                                    style={{
                                      backgroundColor: noti.seen ? '#28a745' : '#ffc107',
                                      borderColor: noti.seen ? '#28a745' : '#ffc107',
                                      border: '1px solid',
                                      cursor: noti.seen ? 'not-allowed' : 'pointer',
                                      opacity: noti.seen ? 0.8 : 1,
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!noti.seen) {
                                        e.currentTarget.style.backgroundColor = '#e0a800';
                                        e.currentTarget.style.borderColor = '#e0a800';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!noti.seen) {
                                        e.currentTarget.style.backgroundColor = '#ffc107';
                                        e.currentTarget.style.borderColor = '#ffc107';
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }
                                    }}
                                  >
                                    {
                                      !noti.seen ? <>Mark as Seen<FaCheck className="ms-2 mb-1" /></> : <>Already Seen<FaCheckDouble className="ms-2 mb-1" /></>
                                    }

                                  </Button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    }
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default TeacherNotification;
