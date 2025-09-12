import { useEffect, useState } from 'react'
import { FaArrowRight, FaUser, FaRegFrownOpen, FaShoppingCart } from "react-icons/fa";
import { BsReception4 } from "react-icons/bs";
import type { EnrolledCourse } from '@/types/base'
import dayjs from 'dayjs'
import { createAuthenticatedAxios } from '@/api/axios'
import { GetUserData } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
function SearchAndCourses({ path }: { path: string }) {
    const [courses, setCourses] = useState<EnrolledCourse[]>([])
    const authAxios = createAuthenticatedAxios()
    const userData = GetUserData()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase()
        if (query !== '') {
            const filted_enrolled_courses = enrolled_courses?.filter(course => course.course.title.toLowerCase().includes(query)) as EnrolledCourse[]
            setCourses(filted_enrolled_courses)
        } else {
            setCourses(enrolled_courses as EnrolledCourse[])
        }
    }
    const getStudentCourseList = async (): Promise<EnrolledCourse[]> => {
        console.log('Fetching course list for user_id:', userData?.user_id);
        try {
            const res = await authAxios.get(`student/course-list/${userData?.user_id}/`)
            console.log('Course list response:', res.data);
            return res.data
        } catch (error) {
            console.error('Error fetching course list:', error);
            throw error;
        }
    }
    const { data: enrolled_courses, isLoading, error } = useQuery({
        queryKey: ['student-course-list', userData?.user_id],
        queryFn: getStudentCourseList,
        staleTime: 5 * 60 * 1000,
        enabled: !!userData?.user_id, // 只有当有用户ID时才执行查询
    })
    useEffect(() => {
        console.log('enrolled_courses:', enrolled_courses);
        console.log('isLoading:', isLoading);
        console.log('error:', error);

        if (enrolled_courses) {
            setCourses(enrolled_courses)
        } else if (!isLoading && !enrolled_courses) {
            // 如果没有数据且不在加载中，设置为空数组
            setCourses([])
        }
    }, [enrolled_courses, isLoading, error])
    return (
        <div className="card mb-4">
            <div className="card-header">
                {
                    path == 'my courses' &&
                    <h3 className="mb-0 mb-4">
                        {" "}
                        <FaShoppingCart className='mb-2 me-2' /> My Courses
                    </h3>
                }
                {
                    path == 'dashboard' &&
                    <h3 className="mb-0">Courses</h3>
                }
                <span>
                    Start watching courses now from your dashboard page.
                </span>
            </div>
            <div className="card-body">
                <form className="row gx-3">
                    <div className="col-lg-12 col-md-12 col-12 mb-lg-0 mb-2">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search Your Courses"
                            onChange={handleSearch}
                        />
                    </div>
                </form>
            </div>

            <div className="table-responsive overflow-y-hidden">
                <table className="table mb-0 text-nowrap table-hover table-centered text-nowrap">
                    <thead className="table-light">
                        <tr>
                            <th>Courses</th>
                            <th>Date Enrolled</th>
                            <th>Lectures</th>
                            <th>Completed</th>
                            <th>Action</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            courses?.map((course, index) => (
                                <tr key={index}>
                                    <td>
                                        <div key={index} className="d-flex align-items-center">
                                            <div>
                                                <a href="#">
                                                    <img
                                                        src={String(course.course.image)}
                                                        alt="course"
                                                        className="rounded img-4by3-lg"
                                                        style={{ width: "100px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                </a>
                                            </div>
                                            <div className="ms-3">
                                                <h4 className="mb-1 h5">
                                                    <a href={`/course-detail/${course.course.slug}`} className="text-inherit text-decoration-none text-dark">
                                                        {course.course.title}
                                                    </a>
                                                </h4>
                                                <ul className="list-inline fs-6 mb-0">
                                                    <li className="list-inline-item">
                                                        <FaUser className="mb-1" />
                                                        <span className='ms-1'>{course.course.language}</span>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <BsReception4 className="mb-1" />
                                                        <span className='ms-1'>{course.course.level}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td><p className='mt-3'>{dayjs(course.date).format('MM/DD/YY')}</p></td>
                                    <td><p className='mt-3'>{course.lectures?.length || 0}</p></td>
                                    <td><p className='mt-3'>{course.completed_lesson.length}</p></td>
                                    <td>
                                        {
                                            course.completed_lesson.length > 0 ?
                                                <>
                                                    <Link to={`/student/courses/${course.enrollment_id}`} className='btn btn-primary btn-sm mt-3'>Continue Course <FaArrowRight /></Link>
                                                </>
                                                :
                                                <>
                                                    <Link to={`/student/courses/${course.enrollment_id}`} className='btn btn-primary btn-sm mt-3'>Start Course <FaArrowRight /></Link>
                                                </>
                                        }

                                    </td>
                                </tr>
                            ))
                        }
                        {
                            courses.length < 1 && !isLoading &&
                            <>
                                <tr>
                                    <td colSpan={6} className=' text-center'>
                                        <h5>
                                            <FaRegFrownOpen className='mb-1' />
                                            {error ? 'Error loading courses' : 'No content here.'}
                                        </h5>
                                        {error && <p className="text-danger">{String(error)}</p>}
                                    </td>
                                </tr>
                            </>
                        }
                        {
                            isLoading &&
                            <>
                                <tr>
                                    <td colSpan={6} className=' text-center'>
                                        <h5>Loading courses...</h5>
                                    </td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SearchAndCourses