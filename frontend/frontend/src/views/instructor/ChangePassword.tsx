import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'
import { GetUserData } from '@/utils'
import { createAuthenticatedAxios } from '@/api/axios'
import { FaCheckCircle } from "react-icons/fa";
import { logout } from '@/api/auth'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import Toast from '@/utils/SweetAlert2/Toast'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
    const navigate = useNavigate()
    const userData = GetUserData()
    const authAxios = createAuthenticatedAxios()
    const [password, setPassword] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    })
    const handlePasswordChange = (e: any) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }
    const onPasswordSubmit = (e: any) => {
        e.preventDefault()
        if (password.old_password && password.new_password && password.confirm_password) {
            if (password.new_password !== password.confirm_password) {
                Toast.fire({
                    icon: 'error',
                    text: '两次输入的密码不一致'
                })
                return
            }
            mutation.mutate()
        } else {
            Toast.fire({
                icon: 'error',
                text: '密码不能为空'
            })
        }
    }

    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData()
            formData.append('user_id', String(userData?.user_id))
            formData.append('old_password', password.old_password)
            formData.append('new_password', password.new_password)
            const res = await authAxios.post('user/change-password/', formData)
            return res.data
        },
        onSuccess: (data) => {
            Toast.fire({
                icon: data.icon,
                text: data.message
            })
            logout('密码已修改，请重新登录')
            navigate('/login/')
        },
        onError: (error) => {
            console.log('修改密码出错,', error)
            Toast.fire({
                icon: (error as any)?.response?.data?.icon || 'error',
                text: (error as any)?.response?.data?.message || 'An error occurred'
            })
        }
    })

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
                            <Card>
                                {/* Card header */}
                                <Card.Header>
                                    <h3 className="mb-0">Change Password</h3>
                                </Card.Header>
                                {/* Card body */}
                                <Card.Body>
                                    <div>
                                        <Form onSubmit={onPasswordSubmit} className="row gx-3 needs-validation" noValidate>
                                            {/* Old Password */}
                                            <Form.Group className="mb-3 col-12 col-md-12" controlId="oldPassword">
                                                <Form.Label>
                                                    Old Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="**************"
                                                    required
                                                    name='old_password'
                                                    value={password.old_password}
                                                    onChange={handlePasswordChange}

                                                />
                                            </Form.Group>
                                            {/* New Password */}
                                            <Form.Group className="mb-3 col-12 col-md-12" controlId="newPassword">
                                                <Form.Label>
                                                    New Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="**************"
                                                    required
                                                    name='new_password'
                                                    value={password.new_password}
                                                    onChange={handlePasswordChange}
                                                />
                                            </Form.Group>

                                            {/* Confirm New Password */}
                                            <Form.Group className="mb-3 col-12 col-md-12" controlId="confirmPassword">
                                                <Form.Label>
                                                    Confirm New Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="**************"
                                                    required
                                                    name='confirm_password'
                                                    value={password.confirm_password}
                                                    onChange={handlePasswordChange}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please confirm your new password.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <div className="col-12">
                                                {/* Button */}
                                                <Button variant="primary" type="submit" disabled={mutation.isPending || mutation.isSuccess}
                                                >
                                                    {mutation.isPending ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                style={{ verticalAlign: "middle" }}
                                                            ></span>
                                                            Saving...
                                                        </>
                                                    ) :
                                                        <>
                                                            Save New Password
                                                            <FaCheckCircle className=' ms-1 mb-1' />
                                                        </>
                                                    }
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </section>
        </>
    )
}

export default ChangePassword