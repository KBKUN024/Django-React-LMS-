import { FaTv, FaClipboardCheck, FaMedal } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query'
import SearchAndCourses from '@/components/student/SearchAndCourses'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { createAuthenticatedAxios } from '@/api/axios'
import { GetUserData } from '@/utils'
import type { StudentSummary } from '@/types'
import { BsGridFill } from "react-icons/bs";
import { useAuthStore } from '@/store'
function Dashboard() {
    const authAxios = createAuthenticatedAxios()
    const { profile } = useAuthStore()
    const userData = GetUserData()
    const getStudentSummary = async (): Promise<StudentSummary> => {
        const res = await authAxios.get(`student/summary/${userData?.user_id}`)
        return res.data[0]
    }
    const { data: summary } = useQuery(
        {
            queryKey: ['student-summary', userData?.user_id],
            queryFn: getStudentSummary,
            staleTime: 5 * 60 * 1000
        },
    )

    console.log('summary is:', summary)
    console.log('userData is:', userData)

    return (
        <>
            <section className="pt-5 pb-5">
                <div className="container">
                    {/* Header Here */}
                    <Header profile={profile} />
                    <div className="row mt-0 mt-md-4">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12" style={{ minHeight: 600 }}>
                            <div className="row mb-4">
                                <h4 className="mb-0 mb-4"> <BsGridFill className="mb-1 me-2" /> Dashboard</h4>
                                {/* Counter item */}

                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-orange mb-0">
                                            <FaTv />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold" >{summary?.total_courses}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Total Courses</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Counter item */}
                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-danger bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-purple mb-0">
                                            <FaClipboardCheck />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold" > {summary?.completed_lessons}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Complete lessons</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Counter item */}
                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-success mb-0">
                                            <FaMedal />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold" > {summary?.achieved_certificates}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Achieved Certificates</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <SearchAndCourses path="dashboard" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard