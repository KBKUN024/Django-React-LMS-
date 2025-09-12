import { useState } from 'react'
import type { Cart, CartStats } from "@/types/base/index";
import { useNavigate } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import { GenerateCartId } from "@/utils";
import { getCartCount } from '@/api/auth'
import Toast from '@/utils/SweetAlert2/Toast'
import { getCurrentUserId } from '@/api/constants'
import { createAuthenticatedAxios } from '@/api/axios'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Table,
    ListGroup,
    Breadcrumb,
} from "react-bootstrap";

function Carts() {
    const navigate = useNavigate()
    const authAxios = createAuthenticatedAxios()
    const [bioData, setBioData] = useState({
        full_name: '',
        email: '',
        country: ''
    })
    const queryClient = useQueryClient();
    const cartId = GenerateCartId() as string;
    const userId = getCurrentUserId()

    const fetchCartList = async (): Promise<Cart[]> => {
        const res = await authAxios.get(`/cart/cart-list/${cartId}`);
        return res.data;
    };

    const fetchCartStats = async (): Promise<CartStats> => {
        const res = await authAxios.get(`/cart/stats/${cartId}`);
        return res.data;
    };

    const createOrder = async () => {
        if (bioData.full_name == '' || bioData.email == '' || bioData.country == '') {
            Toast.fire({
                icon: "error",
                text: "请填写full_name,email,country",
            });
            /**
             * 如果这个不抛出错误，而是直接return的话，onSuccess还是会执行！只有手动抛出错误才会进入到onError函数中。
             */
            throw new Error('请填写完整信息')
        }
        const formData = new FormData()
        formData.append('full_name', bioData.full_name)
        formData.append('email', bioData.email)
        formData.append('country', bioData.country)
        formData.append('cart_id', cartId)
        if (!userId) {
            throw new Error('User ID not available')
        }
        formData.append('user_id', String(userId))
        const res = await authAxios.post('/order/create-order/', formData)
        return res.data
    }

    const cartDelete = async (itemId: string) => {
        await authAxios.delete(`/cart/cart-item-delete/${cartId}/${itemId}/`);
    };

    const mutation = useMutation({
        mutationFn: (itemId: string) => cartDelete(itemId),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["course-detail"] });
            queryClient.invalidateQueries({ queryKey: ["cart-list", cartId] });
            queryClient.invalidateQueries({ queryKey: ["cart-stats", cartId] });
            queryClient.invalidateQueries({ queryKey: ["courses_list"] });
            const cart_id = localStorage.getItem("cart_id");
            if (cart_id) {
                await getCartCount(cart_id); // 当add to cart成功之后，调用一下api，设置正确的数量，不然用户多个标签页之间如果同时添加购物车会造成状态混乱
            }
            Toast.fire({
                icon: "success",
                text: "删除成功",
            });
        },
        onError: (error) => {
            Toast.fire({
                icon: "error",
                text: "删除失败" + error,
            });
            console.log("删除失败:", error);
        },
    });
    const mutation_order = useMutation({
        mutationFn: () => createOrder(),
        onSuccess: (data) => {
            // data是createOrder的响应结果
            console.log('data is ----->', data)
            Toast.fire({
                icon: "success",
                text: "创建订单成功",
            });
            navigate(`/checkout/${data?.order_id}`)
        },
        onError: (error) => {
            Toast.fire({
                icon: "error",
                text: "创建订单成功失败" + error,
            });
            console.log("删除失败:", error);
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["cart-list", cartId],
                queryFn: fetchCartList,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: ["cart-stats", cartId],
                queryFn: fetchCartStats,
                staleTime: 5 * 60 * 1000,
            },
        ],
    });

    const checkOut = (e: any) => {
        e.preventDefault()
        mutation_order.mutate()
    }


    const deleteCartItem = (itemId: string) => {
        mutation.mutate(itemId);
    };

    // 访问结果
    const [{ data: cart_list }, { data: cart_stats }] = results;

    const handleBidDataChange = (event: any) => {
        // 这里使用展开运算符(...)来复制现有的bioData对象的所有属性
        // 然后使用计算属性名 [event.target.name] 来动态设置对象的键
        // event.target.name 是表单元素的name属性值，event.target.value是用户输入的值
        // 这样可以根据表单字段的name属性动态更新对应的状态值
        // 例如：如果input的name="email"，用户输入"test@example.com"
        // 那么就会更新 bioData.email = "test@example.com"
        /**
         * 这种展开运算符 ...bioData 配合计算属性名 [event.target.name]: event.target.value 的写法确实是这样工作的：
            已有字段：如果 event.target.name 对应的字段已经在 bioData 中存在（比如 email），新值会覆盖原来的值
            新字段：如果 event.target.name 是一个新的字段名，会自动添加到对象中
            这是因为对象字面量中，后面的属性会覆盖前面相同键名的属性。所以 ...bioData 先展开所有原有属性，然后 [event.target.name]: event.target.value 会覆盖或添加对应的字段。
         */
        setBioData(
            {
                ...bioData, // 保留原有的所有属性
                [event.target.name]: event.target.value // 动态更新对应字段的值
            }
        )
    }
    return (
        <>
            <section className="py-0">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">My cart</h1>
                                {/* Breadcrumb */}
                                <div className="d-flex justify-content-center">
                                    <Breadcrumb>
                                        <Breadcrumb.Item
                                            href="#"
                                            className="text-decoration-none text-dark"
                                        >
                                            Home
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            href="#"
                                            className="text-decoration-none text-dark"
                                        >
                                            Courses
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item active>Cart</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="pt-5">
                <Container>
                    <Form onSubmit={checkOut}>
                        <Row className="g-4 g-sm-5">
                            {/* Main content START */}
                            <Col
                                lg={8}
                                className="mb-4 mb-sm-0"
                            >
                                <Card className="shadow">
                                    <Card.Body className="p-4">
                                        <h5 className="mb-0 mb-3">
                                            Cart Items ({cart_list?.length})
                                        </h5>

                                        <div className="table-responsive border-0 rounded-3">
                                            <Table className="align-middle p-4 mb-0">
                                                <tbody className="border-top-2">
                                                    {cart_list && cart_list.length < 1 ? (
                                                        <tr>
                                                            <td className="text-center">No Cart Item.</td>
                                                        </tr>
                                                    ) : (
                                                        cart_list?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-lg-flex align-items-center">
                                                                        <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                            <img
                                                                                src={String(item.course.image)}
                                                                                style={{
                                                                                    width: "100px",
                                                                                    height: "70px",
                                                                                    objectFit: "cover",
                                                                                }}
                                                                                className="rounded"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                            <a
                                                                                href="#"
                                                                                className="text-decoration-none text-dark"
                                                                            >
                                                                                {item.course.title}
                                                                            </a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <h5 className="text-success mb-0">
                                                                        ${item.price}
                                                                    </h5>
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        onClick={() =>
                                                                            deleteCartItem(String(item.id))
                                                                        }
                                                                        variant="danger"
                                                                        size="sm"
                                                                        className="px-2 mb-0"
                                                                    >
                                                                        <FaTimes className="fas fa-fw fa-times" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Personal info START */}
                                <Card className="shadow mt-5">
                                    <Card.Body className="p-4">
                                        {/* Title */}
                                        <h5 className="mb-0">Personal Details</h5>
                                        {/* Form START */}
                                        <Row className="g-3 mt-0">
                                            {/* Name */}
                                            <Col
                                                md={12}
                                                className="bg-light-input"
                                            >
                                                <Form.Label htmlFor="yourName">Your name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="yourName"
                                                    placeholder="Name"
                                                    name='full_name'
                                                    onChange={handleBidDataChange}
                                                />
                                            </Col>
                                            {/* Email */}
                                            <Col
                                                md={12}
                                                className="bg-light-input"
                                            >
                                                <Form.Label htmlFor="emailInput">
                                                    Email address *
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    id="emailInput"
                                                    placeholder="Email"
                                                    name='email'
                                                    onChange={handleBidDataChange}
                                                />
                                            </Col>

                                            {/* Country option */}
                                            <Col
                                                md={12}
                                                className="bg-light-input"
                                            >
                                                <Form.Label htmlFor="mobileNumber">
                                                    Select country *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="mobileNumber"
                                                    placeholder="Country"
                                                    name='country'
                                                    onChange={handleBidDataChange}
                                                />
                                            </Col>
                                        </Row>
                                        {/* Form END */}
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col lg={4}>
                                <Card className="shadow">
                                    <Card.Body className="p-4">
                                        <h4 className="mb-3">Cart Total</h4>
                                        <ListGroup
                                            variant="flush"
                                            className="mb-3"
                                        >
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                Sub Total
                                                <span>${cart_stats?.price}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                Tax
                                                <span>${cart_stats?.tax}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex fw-bold justify-content-between align-items-center">
                                                Total
                                                <span className="fw-bold">${cart_stats?.total}</span>
                                            </ListGroup.Item>
                                        </ListGroup>
                                        <div className="d-grid">
                                            <Button type="submit" className="btn btn-lg btn-success"
                                                disabled={mutation_order.isPending || mutation_order.isSuccess}
                                            >
                                                {mutation_order.isPending ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            style={{ verticalAlign: "middle" }}
                                                        ></span>
                                                        Processing...
                                                    </>
                                                ) : mutation_order.isSuccess ? (
                                                    <>
                                                        <i className="fas fa-shopping-cart"></i>{" "}
                                                        Done
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-shopping-cart"></i>
                                                        Proceed To Checkout
                                                    </>
                                                )}
                                            </Button>

                                        </div>
                                        <p className="small mb-0 mt-2 text-center">
                                            By proceeding to checkout, you agree to these{" "}
                                            <a href="#">
                                                {" "}
                                                <strong>Terms of Service</strong>
                                            </a>
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </>
    );
}

export default Carts;
