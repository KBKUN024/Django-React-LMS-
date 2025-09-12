import SearchAndCourses from '@/components/student/SearchAndCourses'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { useAuthStore } from '@/store'
function Courses() {
    const { profile } = useAuthStore()
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
                            <SearchAndCourses path='my courses' />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Courses