import { Link } from 'react-router-dom'
import { Row, Col, Card } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth'
import { FaPlus } from 'react-icons/fa'

function Header() {
    const { profile } = useAuthStore()

    return (
        <Row className="align-items-center">
            <Col xl={12} lg={12} md={12} xs={12}>
                <Card className="px-4 pt-2 pb-4 shadow-sm rounded-3">
                    <div className="d-flex align-items-end justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="me-2 position-relative d-flex justify-content-end align-items-end mt-n5">
                                <img
                                    src={profile?.image || "https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-4.jpg"}
                                    className="avatar-xl rounded-circle border border-4 border-white"
                                    alt="avatar"
                                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                />
                            </div>
                            <div className="lh-1">
                                <h2 className="mb-0">{profile?.full_name || "用户名"}</h2>
                                <p className="mb-0 d-block">@{profile?.user?.username || "username"}</p>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex">
                                <Link
                                    className="btn btn-primary d-md-block ms-2"
                                    to="/instructor/create-course/"
                                >
                                    Create New Course <FaPlus className="ms-1 mb-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default Header