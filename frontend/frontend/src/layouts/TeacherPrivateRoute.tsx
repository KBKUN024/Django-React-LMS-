import { getCurrentTeacherId } from '@/api/constants'
import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

function TeacherPrivateRoute({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isTeacher, setIsTeacher] = useState(false)

    useEffect(() => {
        const checkTeacherStatus = () => {
            try {
                const teacherId = getCurrentTeacherId()
                
                // 检查用户是否是教师
                if (teacherId && teacherId !== "0") {
                    setIsTeacher(true)
                } else {
                    setIsTeacher(false)
                }
            } catch (error) {
                console.error('检查教师状态失败:', error)
                setIsTeacher(false)
            } finally {
                setIsLoading(false)
            }
        }

        checkTeacherStatus()
    }, [])

    // 加载中状态
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    // 不是教师，重定向到首页
    if (!isTeacher) {
        return <Navigate to="/" replace />
    }

    // 是教师，渲染子组件
    return <>{children}</>
}
export default TeacherPrivateRoute