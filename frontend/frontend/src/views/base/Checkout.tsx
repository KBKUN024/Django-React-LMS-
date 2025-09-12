import { useState } from 'react'
import type { CartOrder } from '@/types/base'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Alert, Button, Table, Form, Card, ListGroup, InputGroup } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedAxios } from '@/api/axios'
import { useParams } from 'react-router-dom'
import { BsFillPatchExclamationFill } from "react-icons/bs";
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { PAYPAL_CLIENT_ID } from '@/api/constants'
import Toast from '@/utils/SweetAlert2/Toast'


function Checkout() {
    const queryClient = useQueryClient()
    const [coupon, setCoupon] = useState('')
    const authAxios = createAuthenticatedAxios()
    const [paymentLoading, setPaymentLoading] = useState(false);
    const params = useParams()
    const navigate = useNavigate()
    // paypal的初始化选项 
    const initialOptions = {
        clientId: PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const fetchOrder = async (): Promise<CartOrder> => {
        const res = await authAxios.get(`/order/checkout/${params.order_id}`)
        return res.data
    }

    const checkCouponCode = async () => {
        const formData = new FormData()
        formData.append('cart_order_id', String(params.order_id))
        formData.append('coupon_code', coupon)
        const res = await authAxios.post('/order/coupon/', formData)
        return res.data
    }

    const { data: fetchOrderResult } = useQuery({
        queryKey: ['checkout-order'],
        queryFn: fetchOrder,
        staleTime: 5 * 60 * 1000
    })

    const mutation = useMutation({
        mutationFn: () => checkCouponCode(),
        onSuccess: (data) => {
            console.log('data is:', data)
            if (data.message == 'Coupon Found and Activated.') {
                queryClient.invalidateQueries({ queryKey: ['checkout-order'] })
            }
            Toast.fire({
                icon: data.icon,
                text: data.message
            })
        },
        onError: (error) => {
            console.log('error is:', error)
            Toast.fire({
                icon: 'error',
                text: (error as any)?.response?.data?.message || 'An error occurred'
            })
        }
    })

    const applyCoupon = () => {
        if (coupon == '') {
            Toast.fire({
                icon: 'error',
                text: '优惠券不能为空'
            })
            return
        }
        mutation.mutate()
    }

    console.log('fetchOrderResult:', fetchOrderResult)

    const payWithStripe = (event: any) => {
        setPaymentLoading(true);
        event.target.form.submit();
    };
    return (
        <>
            <section className="py-0">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">Checkout</h1>
                                {/* Breadcrumb */}
                                <div className="d-flex justify-content-center">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb breadcrumb-dots mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="#" className='text-decoration-none text-dark'>Home</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className='text-decoration-none text-dark'>Courses</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className='text-decoration-none text-dark'>Cart</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Checkout
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="pt-5">
                <Container>
                    <Row className="g-4 g-sm-5">
                        <Col xl={8} className="mb-4 mb-sm-0">
                            <Alert variant="warning" dismissible className="d-flex justify-content-between align-items-center pe-2">
                                <div className='d-flex align-items-center'>
                                    <BsFillPatchExclamationFill className="me-2" />
                                    Review your courses before payment
                                </div>
                                {/* <Button variant="warning" className="mb-0 text-primary-hover text-end" size="sm">
                                    <IoClose className="bi bi-x-lg text-white" />
                                </Button> */}
                            </Alert>

                            <Card className="shadow mt-4">
                                <Card.Body className="p-4">
                                    <Card.Title className="mb-3">Courses</Card.Title>

                                    <div className="table-responsive border-0 rounded-3">
                                        <Table className="align-middle p-4 mb-0">
                                            <tbody className="border-top-2">
                                                {
                                                    fetchOrderResult?.order_items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="d-lg-flex align-items-center">
                                                                    <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                        <img src={String(item.course.image)} style={{ width: "100px", height: "70px", objectFit: "cover" }} className="rounded" alt="" />
                                                                    </div>
                                                                    <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                        <a href="#" className='text-decoration-none text-dark' >{item.course.title}</a>
                                                                    </h6>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <h5 className="text-success mb-0">${item.course.price}</h5>
                                                            </td>
                                                        </tr>

                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <Link to={`/cart/`} className='btn btn-outline-secondary mt-3'>Edit Cart <i className='fas fa-edit'></i></Link>
                                </Card.Body>
                            </Card>

                            <Card className="shadow mt-5">
                                <Card.Body className="p-4">
                                    <Card.Title>Personal Details</Card.Title>
                                    <Form>
                                        <Row className="g-3 mt-0">
                                            <Col md={12} className="bg-light-input">
                                                <Form.Label htmlFor="yourName">
                                                    Your name *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="yourName"
                                                    readOnly
                                                    placeholder="Name"
                                                    value={String(fetchOrderResult?.full_name)}
                                                />
                                            </Col>
                                            <Col md={6} className="bg-light-input">
                                                <Form.Label htmlFor="emailInput">
                                                    Email address *
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    id="emailInput"
                                                    readOnly
                                                    placeholder="Email"
                                                    value={String(fetchOrderResult?.email)}
                                                />
                                            </Col>
                                            {/* Country option */}
                                            <Col md={12} className="bg-light-input">
                                                <Form.Label htmlFor="countryInput">
                                                    Select country *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="countryInput"
                                                    placeholder="Country"
                                                    readOnly
                                                    value={String(fetchOrderResult?.country)}
                                                />
                                            </Col>
                                        </Row>
                                    </Form>
                                    {/* Form END */}
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col xl={4}>
                            <Row className="mb-0">
                                <Col md={6} xl={12}>
                                    <Card className="shadow mb-4">
                                        <Card.Body className="p-4">
                                            <Card.Title>Order Summary</Card.Title>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>Transaction ID</span>
                                                    <p className="mb-0 h6 fw-light">{fetchOrderResult?.cart_order_id}</p>
                                                </div>
                                            </div>
                                            <InputGroup className="mt-4">
                                                <Form.Control placeholder="COUPON CODE" onChange={(e) => setCoupon(e.target.value)} />
                                                <Button variant="primary" onClick={applyCoupon}>Apply</Button>
                                            </InputGroup>

                                            <Card className="mt-3 shadow">
                                                <Card.Body className="p-3">
                                                    <Card.Title>Cart Total</Card.Title>
                                                    <ListGroup variant="flush" className="mb-3">
                                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                            Sub Total
                                                            <span>${fetchOrderResult?.sub_total}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                            Discount
                                                            <span>${fetchOrderResult?.saved}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                            Tax
                                                            <span>${fetchOrderResult?.tax_fee}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex fw-bold justify-content-between align-items-center">
                                                            Total
                                                            <span className='fw-bold'>${fetchOrderResult?.total}</span>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                    <div className="d-grid gap-2">
                                                        <PayPalScriptProvider options={initialOptions}>
                                                            <PayPalButtons className='mt-3'
                                                                createOrder={(_data, actions) => {
                                                                    return actions.order.create({
                                                                        intent: "CAPTURE",
                                                                        purchase_units: [
                                                                            {
                                                                                amount: {
                                                                                    currency_code: "USD",
                                                                                    value: fetchOrderResult?.total || '0'
                                                                                }
                                                                            }
                                                                        ]
                                                                    })
                                                                }}

                                                                onApprove={(data, actions) => {
                                                                    if (!actions.order) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return actions.order.capture().then((details) => {
                                                                        const status = details.status;
                                                                        const paypal_order_id = data.orderID;

                                                                        console.log(status);
                                                                        if (status === "COMPLETED") {
                                                                            navigate(`/payment-success/${fetchOrderResult?.cart_order_id}?paypal_order_id=${paypal_order_id}`)
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </PayPalScriptProvider>
                                                        <form
                                                            action={`http://127.0.0.1:8000/api/v1/payment/stripe-checkout/${fetchOrderResult?.cart_order_id}/`}
                                                            className="w-100"
                                                            target='_blank'
                                                            method="POST"
                                                        >
                                                            <input type="hidden" name="cart_order_id" value={fetchOrderResult?.cart_order_id} />
                                                            {paymentLoading === true ? (
                                                                <button
                                                                    type="submit"
                                                                    disabled
                                                                    className="btn btn-lg btn-success mt-2 w-100"
                                                                >
                                                                    {" "}
                                                                    Processing{" "}
                                                                    <i className="fas fa-spinner f a-spin"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="submit"
                                                                    onClick={payWithStripe}
                                                                    className="btn btn-lg btn-success mt-2 w-100"
                                                                >
                                                                    {" "}
                                                                    Pay With Stripe
                                                                </button>
                                                            )}
                                                        </form>
                                                    </div>
                                                    <p className="small mb-0 mt-2 text-center">
                                                        By proceeding to payment, you agree to these{" "}<a href="#"> <strong>Terms of Service</strong></a>
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Checkout