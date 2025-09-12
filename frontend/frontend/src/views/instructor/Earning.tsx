import { Container, Row, Col, Card, Table, Dropdown } from 'react-bootstrap'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { useQuery } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'
import { getCurrentTeacherId } from '@/api/constants'
import type { TeacherSummary, TeacherEarning, TeacherBestSelling } from '@/types'
function Earning() {
    const authAxios = createAuthenticatedAxios()
    const teacherId = getCurrentTeacherId() // 实时获取teacher_id

    console.log('teacherId:', teacherId)

    const fetchTeacherSummary = async (): Promise<TeacherSummary> => {
        const res = await authAxios.get(`teacher/summary/${teacherId}/`)
        return res.data[0]
    }

    const fetchTeacherEarning = async (): Promise<TeacherEarning[]> => {
        if (!teacherId) {
            throw new Error('Teacher ID not available')
        }
        const res = await authAxios.get(`teacher/all-months-earning/${teacherId}/`)
        return res.data
    }

    const fetchTeacherBestSellingCourse = async (): Promise<TeacherBestSelling[]> => {
        if (!teacherId) {
            throw new Error('Teacher ID not available')
        }
        const res = await authAxios.get(`teacher/best-course-selling/${teacherId}/`)
        return res.data
    }

    const { data: teacher_summary } = useQuery({
        queryKey: ['teacher-summary', teacherId],
        queryFn: fetchTeacherSummary,
        enabled: !!teacherId, // 只有当teacherId存在时才执行查询
    })
    const { data: teacher_earning } = useQuery({
        queryKey: ['teacher-earning', teacherId],
        queryFn: fetchTeacherEarning,
        enabled: !!teacherId, // 只有当teacherId存在时才执行查询
    })
    const { data: teacher_best_selling } = useQuery({
        queryKey: ['teacher-best-selling', teacherId],
        queryFn: fetchTeacherBestSellingCourse,
        enabled: !!teacherId, // 只有当teacherId存在时才执行查询
    })
    console.log('teacher_summary: ', teacher_summary)
    console.log('teacher_earning: ', teacher_earning)
    console.log('teacher_best_selling: ', teacher_best_selling)


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
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title className="mb-0">Earnings</Card.Title>
                                    <Card.Text className="mb-0">
                                        You have full control to manage your own account setting.
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <Card className="mb-4">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Earnings</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col xl={6} lg={6} md={12} xs={12} className="mb-3 mb-lg-0">
                                            <div className="border p-3 rounded shadow-sm">
                                                <i className="fe fe-shopping-cart icon-shape icon-sm rounded-3 bg-light-success text-dark-success mt-2" />
                                                <h3 className="display-4 fw-bold mt-3 mb-0">
                                                    ${teacher_summary?.monthly_revenue}
                                                </h3>
                                                <span>Monthly Earnings (Jan)</span>
                                            </div>
                                        </Col>
                                        <Col xl={6} lg={6} md={12} xs={12} className="mb-3 mb-lg-0">
                                            <div className="border p-3 rounded shadow-sm">
                                                <i className="fe fe-shopping-cart icon-shape icon-sm rounded-3 bg-light-success text-dark-success mt-2" />
                                                <h3 className="display-4 fw-bold mt-3 mb-0">
                                                    ${teacher_summary?.total_revenue}
                                                </h3>
                                                <span>Your Revenue</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Card */}
                            <Card className="mb-4">
                                <Card.Header>
                                    <h3 className="mb-0 h4">Best Selling Courses</h3>
                                </Card.Header>
                                {/* Table */}
                                <div className="table-responsive">
                                    <Table hover className="mb-0 text-nowrap table-centered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Courses</th>
                                                <th>Sales</th>
                                                <th>Amount</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                teacher_best_selling?.map((course, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <a href="#" className='text-decoration-none text-dark'>
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={'http://127.0.0.1:8000' + String(course.course_image)}
                                                                        alt="course"
                                                                        style={{ width: "100px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                                                        className="rounded img-4by3-lg"
                                                                    />
                                                                    <h5 className="mb-0 ms-3 ">
                                                                        {course.course_title}
                                                                    </h5>
                                                                </div>
                                                            </a>
                                                        </td>
                                                        <td>{course.sales}</td>
                                                        <td>${course.revenue}</td>
                                                        <td className="align-middle border-top-0">
                                                            <Dropdown align="end">
                                                                <Dropdown.Toggle
                                                                    variant="ghost"
                                                                    className="btn-icon btn-sm rounded-circle"
                                                                    id="courseDropdown1"
                                                                >
                                                                    <i className="fe fe-more-vertical" />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Header>Setting</Dropdown.Header>
                                                                    <Dropdown.Item href="#">
                                                                        <i className="fe fe-edit dropdown-item-icon" />
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#">
                                                                        <i className="fe fe-trash dropdown-item-icon" />
                                                                        Remove
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Card>

                            <Card className="mb-4">
                                {/* Card header */}
                                <Card.Header>
                                    <h3 className="h4 mb-3">Earning History</h3>
                                </Card.Header>
                                {/* Table */}
                                <div className="table-responsive">
                                    <Table className="mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Month</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                teacher_earning?.map((earning, index) => (
                                                    <tr key={index}>
                                                        <td>{`${earning.month_name} ${earning.year}`}</td>
                                                        <td>${earning.total_earning}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Earning
