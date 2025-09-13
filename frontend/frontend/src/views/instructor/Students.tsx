import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { createAuthenticatedAxios } from '@/api/axios'
import { getCurrentTeacherId, MEDIA_BASE_URL } from '@/api/constants'
import type { TeacherStudentList } from '@/types'
import { FaMapPin } from 'react-icons/fa'
import dayjs from 'dayjs'
function Students() {
  const authAxios = createAuthenticatedAxios()
  const teacherId = getCurrentTeacherId()

  const fetchStudentList = async (): Promise<TeacherStudentList[]> => {
    if (!teacherId) {
      throw new Error('Teacher ID not available')
    }
    const res = await authAxios.get(`teacher/student-list/${teacherId}`)
    return res.data
  }
  const { data: studentList } = useQuery({
    queryKey: ['student-list', teacherId],
    queryFn: fetchStudentList,
    enabled: !!teacherId
  })
  console.log(studentList)
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
                {/* Card body */}
                <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">Students</h3>
                    <span>Meet people taking your course.</span>
                  </div>
                  {/* Nav */}
                </Card.Body>
              </Card>
              {/* Tab content */}
              <Row>
                <Col lg={4} md={6} xs={12}>
                  {
                    studentList?.map((student, index) => (
                      <Card key={index} className="mb-4">
                        <Card.Body>
                          <div className="text-center">
                            <img
                              src={MEDIA_BASE_URL + student.image}
                              className="rounded-circle avatar-xl mb-3"
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              alt="avatar"
                            />
                            <h4 className="mb-1">{student.full_name}</h4>
                            <p className="mb-0">
                              {" "}
                              <FaMapPin /> {student.country}{" "}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between py-2 mt-4 fs-6">
                            <span>Enrolled</span>
                            <span className="text-dark">{dayjs(student.date).format('YY/MM/DD')}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  }
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Students;
