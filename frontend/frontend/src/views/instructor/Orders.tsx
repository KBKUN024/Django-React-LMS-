import { useQuery } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'

import { Container, Row, Col, Card, Table } from 'react-bootstrap'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { getCurrentTeacherId } from '@/api/constants'
import type { CartOrderItem } from '@/types/base'
import dayjs from 'dayjs'
function Orders() {
    const authAxios = createAuthenticatedAxios()
    const teacherId = getCurrentTeacherId()
    const fetchTeacherOrders = async (): Promise<CartOrderItem[]> => {
        if (!teacherId) {
            throw new Error('Teacher ID not available')
        }
        const res = await authAxios.get(`teacher/course-order-list/${teacherId}/`)
        return res.data
    }
    const { data: teacher_orders } = useQuery({
        queryKey: ['teacher-orders', teacherId],
        queryFn: fetchTeacherOrders,
        enabled: !!teacherId, // 只有当teacherId存在时才执行查询
    })
    console.log('teacher_orders:', teacher_orders)
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
                                <Card.Header className="border-bottom-0">
                                    <h3 className="mb-0">Orders</h3>
                                    <span>Order Dashboard is a quick overview of all current orders.</span>
                                </Card.Header>
                                {/* Table */}
                                <div className="table-responsive">
                                    <Table hover className="mb-0 text-nowrap table-centered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Courses</th>
                                                <th>Amount</th>
                                                <th>Invoice</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                teacher_orders?.map((order, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h5 className="mb-0">
                                                                <a href="#" className="text-inherit text-decoration-none text-dark">
                                                                    {order.course.title}
                                                                </a>
                                                            </h5>
                                                        </td>
                                                        <td>${order.price}</td>
                                                        <td>#{order.cart_order_item_id}</td>
                                                        <td>{dayjs(order.date).format('MMMM DD,YY')}</td>
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

export default Orders
