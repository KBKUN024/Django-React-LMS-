import type { Course } from "@/types/base/index";
import { createAuthenticatedAxios } from "@/api/axios";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    FaStar,
    FaUserGraduate,
    FaSignal,
    FaGlobe,
    FaPlay,
    FaLock,
    FaTwitter,
    FaCopy,
    FaClock,
    FaUserClock,
    FaMedal,
    FaBookOpen,
} from "react-icons/fa";
import { BsFillPatchExclamationFill } from "react-icons/bs";
import Rater from "react-rater";
import { GenerateCartId, GetUserData } from "@/utils";
import useCurrentAddress from "@/hooks/useCurrentAddress";
import { useAddToCart } from "@/hooks";

import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Nav,
    Tab,
    Accordion,
    Button,
    Form,
    Image,
    ListGroup,
    Dropdown,
} from "react-bootstrap";

function CourseDetail() {
    const { addToCart, isSuccess, isPending } = useAddToCart();
    const params = useParams();
    const cartId = GenerateCartId() as string;
    console.log("cartId:", cartId);
    const { address } = useCurrentAddress();
    const user_data = GetUserData();
    const fetchCourseDetail = async (): Promise<Course> => {
        const authAxios = createAuthenticatedAxios();
        const res = await authAxios.get(`/course/course-detail/${params.slug}`);
        console.log("res is:", res);
        return res.data;
    };
    const { data: courseDetail } = useQuery({
        queryKey: ["course-detail", params.slug], // 这里需要加上一个动态参数: params.slug，否则这个query请求就是静态的。这样，当url中的slug参数发生变化的时候，会自动发送请求，否则会一直用其他的slug的请求缓存结果。用了这个动态slug之后，每个slug的请求都会被缓存，也就是说，假如slug为A，那么当再次进入slug为A的页面，除非staleTime到期，否则会用上一次的slug的缓存。
        queryFn: fetchCourseDetail,
        staleTime: 5 * 60 * 1000,
    });
    console.log("data is:", courseDetail);
    return (
        <>
            <>
                <section className="bg-light py-0 py-sm-5">
                    <Container>
                        <Row className="py-5">
                            <Col lg={8}>
                                {/* Badge */}
                                <h6 className="mb-3 font-base bg-primary text-white py-2 px-4 rounded-2 d-inline-block">
                                    {courseDetail?.category?.title}
                                </h6>
                                {/* Title */}
                                <h1 className="mb-3">{courseDetail?.title}</h1>
                                <p className="mb-3">{courseDetail?.description}</p>
                                {/* Content */}
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                        <FaStar className="text-warning me-2" />
                                        <span className="align-middle">
                                            {courseDetail?.average_rating}/5.0
                                        </span>
                                    </li>
                                    <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                        <FaUserGraduate className="fas fa-user-graduate text-orange me-2" />
                                        <span className="align-middle"> Enrolled</span>
                                    </li>
                                    <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                        <FaSignal className="fas fa-signal text-success me-2" />
                                        <span className="align-middle">{courseDetail?.level}</span>
                                    </li>
                                    <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                        <BsFillPatchExclamationFill className="bi bi-patch-exclamation-fill text-danger me-2" />
                                        <span className="align-middle">{courseDetail?.date}</span>
                                    </li>
                                    <li className="list-inline-item h6 mb-0">
                                        <FaGlobe className="fas fa-globe text-info me-2" />
                                        <span className="align-middle">
                                            {courseDetail?.language}
                                        </span>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="pb-0 py-lg-5">
                    <Container>
                        <Row>
                            {/* Main content START */}
                            <Col lg={8}>
                                <Card className="shadow rounded-2 p-0">
                                    {/* Tabs START */}
                                    <Card.Header className="border-bottom px-4 py-3">
                                        <Tab.Container defaultActiveKey="overview">
                                            <Nav
                                                variant="pills"
                                                className="nav-tabs-line py-0"
                                            >
                                                <Nav.Item className="me-2 me-sm-4">
                                                    <Nav.Link
                                                        eventKey="overview"
                                                        className="mb-2 mb-md-0"
                                                    >
                                                        Overview
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className="me-2 me-sm-4">
                                                    <Nav.Link
                                                        eventKey="curriculum"
                                                        className="mb-2 mb-md-0"
                                                    >
                                                        Curriculum
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className="me-2 me-sm-4">
                                                    <Nav.Link
                                                        eventKey="instructor"
                                                        className="mb-2 mb-md-0"
                                                    >
                                                        Instructor
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className="me-2 me-sm-4">
                                                    <Nav.Link
                                                        eventKey="reviews"
                                                        className="mb-2 mb-md-0"
                                                    >
                                                        Reviews
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            {/* Tabs END */}
                                            {/* Tab contents START */}
                                            <Card.Body className="p-4">
                                                <Tab.Content className="pt-2">
                                                    {/* Overview Content */}
                                                    <Tab.Pane eventKey="overview">
                                                        <h5 className="mb-3">Course Description</h5>
                                                        <p className="mb-3">{courseDetail?.description}</p>
                                                        {/* List content */}
                                                    </Tab.Pane>
                                                    {/* Curriculum Content */}
                                                    <Tab.Pane eventKey="curriculum">
                                                        <Accordion
                                                            defaultActiveKey="0"
                                                            className="accordion-icon accordion-bg-light"
                                                        >
                                                            {courseDetail?.curriculum.map((item, index) => (
                                                                <Accordion.Item
                                                                    eventKey={index.toString()}
                                                                    className="mb-3"
                                                                    key={index}
                                                                >
                                                                    <Accordion.Header className="font-base">
                                                                        {item.title}
                                                                        <span className="small ms-0 ms-sm-2">
                                                                            ({item.variant_items.length} Lectures)
                                                                        </span>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body>
                                                                        {/* Course lecture */}
                                                                        <ListGroup>
                                                                            {item.variant_items.map(
                                                                                (variant_item, index) => (
                                                                                    <ListGroup.Item
                                                                                        key={index}
                                                                                        className="d-flex justify-content-between align-items-center"
                                                                                    >
                                                                                        <div className="position-relative d-flex align-items-center">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                                                                            >
                                                                                                {variant_item.preview ? (
                                                                                                    <FaPlay className="fas fa-play me-0" />
                                                                                                ) : (
                                                                                                    <FaLock className="fas fa-play me-0" />
                                                                                                )}
                                                                                            </a>
                                                                                            <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px w-md-400px">
                                                                                                {variant_item.title}
                                                                                            </span>
                                                                                        </div>
                                                                                        <span className="mb-0">
                                                                                            {variant_item.duration
                                                                                                ? variant_item.duration
                                                                                                : "0m 0s"}
                                                                                        </span>
                                                                                    </ListGroup.Item>
                                                                                )
                                                                            )}
                                                                        </ListGroup>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            ))}
                                                        </Accordion>
                                                    </Tab.Pane>

                                                    {/* Instructor Content */}
                                                    <Tab.Pane eventKey="instructor">
                                                        <Card className="mb-0 mb-md-4">
                                                            <Row className="g-0 align-items-center">
                                                                <Col md={5}>
                                                                    <Image
                                                                        src={String(courseDetail?.teacher.avatar)}
                                                                        className="img-fluid rounded-3"
                                                                        alt="instructor-image"
                                                                    />
                                                                </Col>
                                                                <Col md={7}>
                                                                    <Card.Body>
                                                                        <Card.Title className="mb-0">
                                                                            {courseDetail?.teacher.full_name}
                                                                        </Card.Title>
                                                                        <p className="mb-2">
                                                                            {courseDetail?.teacher.bio}
                                                                        </p>
                                                                        <ul className="list-inline mb-3">
                                                                            <li className="list-inline-item me-3">
                                                                                <a
                                                                                    href="#"
                                                                                    className="fs-5 text-twitter"
                                                                                >
                                                                                    <FaTwitter className="fab fa-twitter-square" />
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </Card.Body>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                        <h5 className="mb-3">About Instructor</h5>
                                                        <p className="mb-3">
                                                            {courseDetail?.teacher.about}
                                                        </p>
                                                    </Tab.Pane>

                                                    {/* Reviews Content */}
                                                    <Tab.Pane eventKey="reviews">
                                                        <Row className="mb-1">
                                                            <h5 className="mb-4">Our Student Reviews</h5>
                                                        </Row>

                                                        <Row>
                                                            {courseDetail?.reviews.map((item, index) => (
                                                                <div
                                                                    className="d-md-flex my-4"
                                                                    key={index}
                                                                >
                                                                    <div className="avatar avatar-xl me-4 flex-shrink-0">
                                                                        <Image
                                                                            className="avatar-img rounded-circle"
                                                                            src={String(item.profile.image)}
                                                                            style={{
                                                                                width: "50px",
                                                                                height: "50px",
                                                                                borderRadius: "50%",
                                                                                objectFit: "cover",
                                                                            }}
                                                                            alt="avatar"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div className="d-sm-flex mt-1 mt-md-0 align-items-center">
                                                                            <h5 className="me-3 mb-0">
                                                                                {item.profile.full_name}
                                                                            </h5>
                                                                            <Rater
                                                                                total={5}
                                                                                rating={item.rating || 0}
                                                                            />
                                                                        </div>
                                                                        <p className="small mb-2">5 days ago</p>
                                                                        <p className="mb-2">{item.review}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {courseDetail?.reviews &&
                                                                courseDetail?.reviews.length > 1 ? (
                                                                <hr />
                                                            ) : null}
                                                        </Row>
                                                        <div className="mt-2">
                                                            <h5 className="mb-4">Leave a Review</h5>
                                                            <Form>
                                                                <Row className="g-3">
                                                                    <Col
                                                                        xs={12}
                                                                        className="bg-light-input"
                                                                    >
                                                                        <Form.Select>
                                                                            <option>★★★★★ (5/5)</option>
                                                                            <option>★★★★☆ (4/5)</option>
                                                                            <option>★★★☆☆ (3/5)</option>
                                                                            <option>★★☆☆☆ (2/5)</option>
                                                                            <option>★☆☆☆☆ (1/5)</option>
                                                                        </Form.Select>
                                                                    </Col>
                                                                    <Col
                                                                        xs={12}
                                                                        className="bg-light-input"
                                                                    >
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            rows={3}
                                                                            placeholder="Your review"
                                                                        />
                                                                    </Col>
                                                                    <Col xs={12}>
                                                                        <Button
                                                                            variant="primary"
                                                                            type="submit"
                                                                            className="mb-0"
                                                                        >
                                                                            Post Review
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </div>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Card.Body>
                                        </Tab.Container>
                                    </Card.Header>
                                </Card>
                            </Col>
                            {/* Main content END */}
                            {/* Right sidebar START */}
                            <Col
                                lg={4}
                                className="pt-5 pt-lg-0"
                            >
                                <Row className="mb-5 mb-lg-0">
                                    <Col
                                        md={6}
                                        lg={12}
                                    >
                                        {/* Video START */}
                                        <Card className="shadow p-2 mb-4 z-index-9">
                                            <div className="overflow-hidden rounded-3">
                                                <Image
                                                    src={String(courseDetail?.image)}
                                                    className="card-img"
                                                    alt="course image"
                                                />
                                                <div
                                                    className="m-auto rounded-2 mt-2 d-flex justify-content-center align-items-center"
                                                    style={{ backgroundColor: "#ededed" }}
                                                >
                                                    <a
                                                        href="#"
                                                        className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                                                    >
                                                        <i className="fas fa-play" />
                                                    </a>
                                                    <span className="fw-bold">
                                                        Course Introduction Video
                                                    </span>
                                                </div>
                                            </div>
                                            <Card.Body className="px-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <h3 className="fw-bold mb-0 me-2">
                                                                ${courseDetail?.price}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="light"
                                                            size="sm"
                                                            className="rounded small"
                                                        >
                                                            <i className="fas fa-fw fa-share-alt" />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded">
                                                            <Dropdown.Item href="#">
                                                                <FaTwitter className="fab fa-twitter-square me-2" />
                                                                Twitter
                                                            </Dropdown.Item>
                                                            <Dropdown.Item href="#">
                                                                <FaCopy className="fas fa-copy me-2" />
                                                                Copy link
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="mt-3 d-sm-flex justify-content-sm-between">
                                                    {courseDetail?.isInCart ? (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                className="mb-0 w-100 me-2"
                                                                disabled
                                                            >
                                                                Added To Cart
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                className="mb-0 w-100 me-2"
                                                                onClick={() =>
                                                                    addToCart(
                                                                        String(courseDetail?.id),
                                                                        String(user_data?.user_id),
                                                                        courseDetail?.price || "0",
                                                                        address?.country || "China",
                                                                        cartId
                                                                    )
                                                                }
                                                                disabled={isPending || isSuccess}
                                                            >
                                                                {isPending ? (
                                                                    <>
                                                                        <span
                                                                            className="spinner-border spinner-border-sm me-2"
                                                                            style={{ verticalAlign: "middle" }}
                                                                        ></span>
                                                                        Adding...
                                                                    </>
                                                                ) : isSuccess ? (
                                                                    <>
                                                                        <i className="fas fa-shopping-cart"></i>{" "}
                                                                        Added To Cart
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-shopping-cart"></i> Add
                                                                        To Cart
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button
                                                        as={Link as any}
                                                        to="/cart/"
                                                        variant="success"
                                                        className="mb-0 w-100"
                                                    >
                                                        Enroll Now <i className="fas fa-arrow-right"></i>
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        {/* Video END */}
                                        {/* Course info START */}
                                        <Card className="shadow p-4 mb-4">
                                            <h4 className="mb-3">This course includes</h4>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaBookOpen className="fas fa-fw fa-book-open text-primary me-2" />
                                                        Lectures
                                                    </span>
                                                    <span>{courseDetail?.lectures.length}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center d-none">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaClock className="fas fa-fw fa-clock text-primary me-2" />
                                                        Duration
                                                    </span>
                                                    <span>4h 50m</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaSignal className="fas fa-fw fa-signal text-primary me-2" />
                                                        Skills
                                                    </span>
                                                    <span>{courseDetail?.level}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaGlobe className="fas fa-fw fa-globe text-primary me-2" />
                                                        {courseDetail?.language}
                                                    </span>
                                                    <span>English</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaUserClock className="fas fa-fw fa-user-clock text-primary me-2" />
                                                        Published
                                                    </span>
                                                    <span>{courseDetail?.date}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                    <span className="h6 fw-light mb-0">
                                                        <FaMedal className="fas fa-fw fa-medal text-primary me-2" />
                                                        Certificate
                                                    </span>
                                                    <span>Yes</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card>
                                        {/* Course info END */}
                                    </Col>
                                </Row>
                            </Col>
                            {/* Right sidebar END */}
                        </Row>
                    </Container>
                </section>
                <section className="mb-5">
                    <Container className="mb-lg-8">
                        <Row className="mb-5 mt-3">
                            <Col xs={12}>
                                <div className="mb-6">
                                    <h2 className="mb-1 h1">Related Courses</h2>
                                    <p>
                                        These are the most popular courses among Geeks Courses
                                        learners worldwide in year 2022
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Row
                                    xs={1}
                                    md={2}
                                    lg={4}
                                    className="g-4"
                                >
                                    <Col>
                                        <Card className="card-hover">
                                            <Link to={`/course-detail/slug/`}>
                                                <Card.Img
                                                    variant="top"
                                                    src="https://geeksui.codescandy.com/geeks/assets/images/course/course-css.jpg"
                                                    alt="course"
                                                />
                                            </Link>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Badge bg="info">Intermediate</Badge>
                                                    <a
                                                        href="#"
                                                        className="fs-5"
                                                    >
                                                        <i className="fas fa-heart text-danger align-middle" />
                                                    </a>
                                                </div>
                                                <Card.Title className="mb-2 text-truncate-line-2">
                                                    <Link
                                                        to={`/course-detail/slug/`}
                                                        className="text-inherit text-decoration-none text-dark fs-5"
                                                    >
                                                        How to easily create a website with JavaScript
                                                    </Link>
                                                </Card.Title>
                                                <small>By: Claire Evans</small> <br />
                                                <small>16k Students</small> <br />
                                                <div className="lh-1 mt-3 d-flex">
                                                    <span className="align-text-top">
                                                        <span className="fs-6">
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star-half text-warning"></i>
                                                        </span>
                                                    </span>
                                                    <span className="text-warning">4.5</span>
                                                    <span className="fs-6 ms-2">(9,300)</span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Row className="align-items-center g-0">
                                                    <Col>
                                                        <h5 className="mb-0">$39.00</h5>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="primary"
                                                            className="text-inherit text-decoration-none"
                                                        >
                                                            <i className="fas fa-shopping-cart text-white align-middle me-2" />
                                                            Enroll Now
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </Col>

                                    <Col>
                                        <Card className="card-hover">
                                            <Link to={`/course-detail/slug/`}>
                                                <Card.Img
                                                    variant="top"
                                                    src="https://geeksui.codescandy.com/geeks/assets/images/course/course-angular.jpg"
                                                    alt="course"
                                                />
                                            </Link>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Badge bg="info">Intermediate</Badge>
                                                    <a
                                                        href="#"
                                                        className="fs-5"
                                                    >
                                                        <i className="fas fa-heart text-danger align-middle" />
                                                    </a>
                                                </div>
                                                <Card.Title className="mb-2 text-truncate-line-2">
                                                    <Link
                                                        to={`/course-detail/slug/`}
                                                        className="text-inherit text-decoration-none text-dark fs-5"
                                                    >
                                                        How to easily create a website with JavaScript
                                                    </Link>
                                                </Card.Title>
                                                <small>By: Claire Evans</small> <br />
                                                <small>16k Students</small> <br />
                                                <div className="lh-1 mt-3 d-flex">
                                                    <span className="align-text-top">
                                                        <span className="fs-6">
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star-half text-warning"></i>
                                                        </span>
                                                    </span>
                                                    <span className="text-warning">4.5</span>
                                                    <span className="fs-6 ms-2">(9,300)</span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Row className="align-items-center g-0">
                                                    <Col>
                                                        <h5 className="mb-0">$39.00</h5>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="primary"
                                                            className="text-inherit text-decoration-none"
                                                        >
                                                            <i className="fas fa-shopping-cart text-white align-middle me-2" />
                                                            Enroll Now
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </Col>

                                    <Col>
                                        <Card className="card-hover">
                                            <Link to={`/course-detail/slug/`}>
                                                <Card.Img
                                                    variant="top"
                                                    src="https://geeksui.codescandy.com/geeks/assets/images/course/course-react.jpg"
                                                    alt="course"
                                                />
                                            </Link>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Badge bg="info">Intermediate</Badge>
                                                    <a
                                                        href="#"
                                                        className="fs-5"
                                                    >
                                                        <i className="fas fa-heart text-danger align-middle" />
                                                    </a>
                                                </div>
                                                <Card.Title className="mb-2 text-truncate-line-2">
                                                    <Link
                                                        to={`/course-detail/slug/`}
                                                        className="text-inherit text-decoration-none text-dark fs-5"
                                                    >
                                                        Learn React.Js for Beginners from Start to Finish
                                                    </Link>
                                                </Card.Title>
                                                <small>By: Claire Evans</small> <br />
                                                <small>16k Students</small> <br />
                                                <div className="lh-1 mt-3 d-flex">
                                                    <span className="align-text-top">
                                                        <span className="fs-6">
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star-half text-warning"></i>
                                                        </span>
                                                    </span>
                                                    <span className="text-warning">4.5</span>
                                                    <span className="fs-6 ms-2">(9,300)</span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Row className="align-items-center g-0">
                                                    <Col>
                                                        <h5 className="mb-0">$39.00</h5>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="primary"
                                                            className="text-inherit text-decoration-none"
                                                        >
                                                            <i className="fas fa-shopping-cart text-white align-middle me-2" />
                                                            Enroll Now
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </Col>

                                    <Col>
                                        <Card className="card-hover">
                                            <Link to={`/course-detail/slug/`}>
                                                <Card.Img
                                                    variant="top"
                                                    src="https://geeksui.codescandy.com/geeks/assets/images/course/course-python.jpg"
                                                    alt="course"
                                                />
                                            </Link>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Badge bg="info">Intermediate</Badge>
                                                    <a
                                                        href="#"
                                                        className="fs-5"
                                                    >
                                                        <i className="fas fa-heart text-danger align-middle" />
                                                    </a>
                                                </div>
                                                <Card.Title className="mb-2 text-truncate-line-2">
                                                    <Link
                                                        to={`/course-detail/slug/`}
                                                        className="text-inherit text-decoration-none text-dark fs-5"
                                                    >
                                                        How to easily create a website with JavaScript
                                                    </Link>
                                                </Card.Title>
                                                <small>By: Claire Evans</small> <br />
                                                <small>16k Students</small> <br />
                                                <div className="lh-1 mt-3 d-flex">
                                                    <span className="align-text-top">
                                                        <span className="fs-6">
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star-half text-warning"></i>
                                                        </span>
                                                    </span>
                                                    <span className="text-warning">4.5</span>
                                                    <span className="fs-6 ms-2">(9,300)</span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Row className="align-items-center g-0">
                                                    <Col>
                                                        <h5 className="mb-0">$39.00</h5>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="primary"
                                                            className="text-inherit text-decoration-none"
                                                        >
                                                            <i className="fas fa-shopping-cart text-white align-middle me-2" />
                                                            Enroll Now
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </>
        </>
    );
}

export default CourseDetail;
