import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { Container, Row, Col, Card, Form, Table, Button, Image, Badge } from 'react-bootstrap'
import { FaDollarSign, FaEdit, FaGlobe, FaTrash } from 'react-icons/fa'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'
import { getCurrentTeacherId } from '@/api/constants'
import type { Course } from '@/types/base'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import Toast from '@/utils/SweetAlert2/Toast'
import { handleMutationError } from '@/utils'
function Courses() {
    const authAxios = createAuthenticatedAxios()
    const teacherId = getCurrentTeacherId()
    const queryClient = useQueryClient()
    const fetchCourseList = async (): Promise<Course[]> => {
        const res = await authAxios.get(`/teacher/course-list/${teacherId}/`)
        return res.data
    }
    const { data: courses } = useQuery({
        queryKey: ['teacher-course-list', teacherId],
        queryFn: fetchCourseList
    })
    console.log('courses:', courses)

    const deleteCourse = async (course_id: number, teacher_id: number) => {
        const res = await authAxios.delete(
            `teacher/course-delete/${course_id}/${teacher_id}/`
        );
        return res.data;
    }

    const deleteCourseMutation = useMutation({
        mutationFn: (variables: { course_id: number, teacher_id: number }) => deleteCourse(variables.course_id, variables.teacher_id),
        onSuccess: (data) => {
            console.log("删除课程成功,data:", data);
            queryClient.invalidateQueries({ queryKey: ['teacher-course-list', teacherId] })
            Toast.fire({
                icon: "success",
                text: "删除课程成功",
            });
        },
        onError: (error) => {
            console.log("删除课程失败,", error);
            const errorMessage = handleMutationError(error);

            Toast.fire({
                icon: "error",
                text: errorMessage,
            });
        },
    });
    const delteCourse = (course_id: number, teacher_id: number) => {
        deleteCourseMutation.mutate({ course_id: course_id, teacher_id: teacher_id })
    }
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
                            <Row className="mb-4">
                                <Col>
                                    <h4 className="mb-0 mb-2 mt-4">
                                        <i className='bi bi-grid-fill'></i> Courses
                                    </h4>
                                </Col>
                            </Row>
                            <Card className="mb-4">
                                <Card.Header>
                                    <span>
                                        Manage your courses from here, search, view, edit or delete courses.
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Row className="gx-3">
                                            <Col lg={12} md={12} xs={12} className="mb-lg-0 mb-2">
                                                <Form.Control
                                                    type="search"
                                                    placeholder="Search Your Courses"
                                                />
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                                <div className="table-responsive overflow-y-hidden">
                                    <Table
                                        className="mb-0 text-nowrap table-hover table-centered"
                                        responsive
                                        hover
                                        bordered={false}
                                    >
                                        <thead className="table-light">
                                            <tr>
                                                <th>Courses</th>
                                                <th>Enrolled</th>
                                                <th>Level</th>
                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>Action</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                courses?.map((course, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <a href="#">
                                                                        <Image
                                                                            src={course.image?.startsWith('http') ? String(course.image) : String(course.image)}
                                                                            alt="course"
                                                                            rounded
                                                                            style={{
                                                                                width: "100px",
                                                                                height: "70px",
                                                                                borderRadius: "50%",
                                                                                objectFit: "cover"
                                                                            }}
                                                                        />
                                                                    </a>
                                                                </div>
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1 h6">
                                                                        <a href="#" className="text-inherit text-decoration-none text-dark">
                                                                            {course.title}
                                                                        </a>
                                                                    </h4>
                                                                    <ul className="list-inline fs-6 mb-0">
                                                                        <li className="list-inline-item">
                                                                            <small>
                                                                                <FaGlobe />
                                                                                <span className='ms-1'>{course.language}</span>
                                                                            </small>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <small>
                                                                                <FaDollarSign />
                                                                                <span>${course.price}</span>
                                                                            </small>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><p className='mt-3'>{course.lectures_count}</p></td>
                                                        <td>
                                                            <p className='mt-3'>
                                                                <Badge bg="success">{course.level}</Badge>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className='mt-3'>
                                                                <Badge bg="warning" text="dark">{course.platform_status}</Badge>
                                                            </p>
                                                        </td>
                                                        <td><p className='mt-3'>{dayjs(course.date).format('DD MMMM, YYYY')}</p></td>
                                                        <td>
                                                            <Link to={`/instructor/edit-course/${course.course_id}/`} className="btn btn-primary mt-3 me-1">
                                                                <FaEdit />
                                                            </Link>
                                                            <Button onClick={() => delteCourse(Number(course.course_id), course.teacher.id)} variant='danger' className="mt-3 me-1">
                                                                <FaTrash />
                                                            </Button>
                                                        </td>
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

export default Courses