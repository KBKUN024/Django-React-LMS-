import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { useFetchCourses } from '@/hooks'
import CourseListItem from "@/components/base/Index/CourseListItem";
import { useQuery } from '@tanstack/react-query'

function Index() {
  const fetchCourse = useFetchCourses()
  const { data: courses } = useQuery({
    queryKey: ['courses_list'],
    queryFn: fetchCourse,
    staleTime: 5 * 60 * 1000
  })

  return (
    <>
      <section className="py-lg-8 py-5">
        {/* container */}
        <Container className="my-lg-8">
          {/* row */}
          <Row className="align-items-center">
            {/* col */}
            <Col
              lg={6}
              className="mb-6 mb-lg-0"
            >
              <div>
                {/* heading */}
                <h5 className="text-dark mb-4">
                  <i className="fe fe-check icon-xxs icon-shape bg-light-success text-success rounded-circle me-2" />
                  Most trusted education platform
                </h5>
                {/* heading */}
                <h1 className="display-3 fw-bold mb-3">
                  Grow your skills and advance career
                </h1>
                {/* para */}
                <p className="pe-lg-10 mb-5">
                  Start, switch, or advance your career with more than 5,000
                  courses, Professional Certificates, and degrees from
                  world-class universities and companies.
                </p>
                {/* btn */}
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3"
                >
                  Join Free Now <i className="fas fa-plus"></i>
                </Button>
                <Button
                  variant="outline-success"
                  size="lg"
                  href="https://www.youtube.com/watch?v=Nfzi7034Kbg"
                  className="ms-3"
                >
                  Watch Demo <i className="fas fa-video"></i>
                </Button>
              </div>
            </Col>
            {/* col */}
            <Col
              lg={6}
              className="d-flex justify-content-center"
            >
              {/* images */}
              <div className="position-relative">
                <img
                  src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/girl-image.png"
                  alt="girl"
                  className="end-0 bottom-0"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="mb-lg-8">
          {/* row */}
          <Row className="mb-5">
            <Col
              md={6}
              lg={3}
              className="border-top-md border-top pb-4 border-end-md"
            >
              {/* text */}
              <div className="py-7 text-center">
                <div className="mb-3">
                  <i className="fe fe-award fs-2 text-info" />
                </div>
                <div className="lh-1">
                  <h2 className="mb-1">316,000+</h2>
                  <span>Qualified Instructor</span>
                </div>
              </div>
            </Col>
            <Col
              md={6}
              lg={3}
              className="border-top-md border-top border-end-lg"
            >
              {/* icon */}
              <div className="py-7 text-center">
                <div className="mb-3">
                  <i className="fe fe-users fs-2 text-warning" />
                </div>
                {/* text */}
                <div className="lh-1">
                  <h2 className="mb-1">1.8 Billion+</h2>
                  <span>Course enrolments</span>
                </div>
              </div>
            </Col>
            <Col
              md={6}
              lg={3}
              className="border-top-lg border-top border-end-md"
            >
              {/* icon */}
              <div className="py-7 text-center">
                <div className="mb-3">
                  <i className="fe fe-tv fs-2 text-primary" />
                </div>
                {/* text */}
                <div className="lh-1">
                  <h2 className="mb-1">41,000+</h2>
                  <span>Courses in 42 languages</span>
                </div>
              </div>
            </Col>
            <Col
              md={6}
              lg={3}
              className="border-top-lg border-top"
            >
              {/* icon */}
              <div className="py-7 text-center">
                <div className="mb-3">
                  <i className="fe fe-film fs-2 text-success" />
                </div>
                {/* text */}
                <div className="lh-1">
                  <h2 className="mb-1">179,000+</h2>
                  <span>Online Videos</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5">
        <Container className="mb-lg-8">
          <Row className="mb-5 mt-3">
            {/* col */}
            <Col xs={12}>
              <div className="mb-6">
                <h2 className="mb-1 h1">🔥Most Popular Courses</h2>
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
                {courses?.map((course) => (
                  course.featured &&
                  <Col key={course.course_id}>
                    <CourseListItem course={course} />
                  </Col>
                ))}
                <Row>
                  <Col md={12}>
                    <Pagination className="d-flex mt-5">
                      <Pagination.Prev>
                        <i className="ci-arrow-left me-2" />
                        Previous
                      </Pagination.Prev>
                      <Pagination.Item active>1</Pagination.Item>
                      <Pagination.Next>
                        Next
                        <i className="ci-arrow-right ms-3" />
                      </Pagination.Next>
                    </Pagination>
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="my-8 py-lg-8">
        {/* container */}
        <Container>
          {/* row */}
          <Row className="align-items-center bg-primary gx-0 rounded-3 mt-5">
            {/* col */}
            <Col
              lg={6}
              xs={12}
              className="d-none d-lg-block"
            >
              <div className="d-flex justify-content-center pt-4">
                {/* img */}
                <div className="position-relative">
                  <img
                    src="https://geeksui.codescandy.com/geeks/assets/images/png/cta-instructor-1.png"
                    alt="image"
                    className="img-fluid mt-n8"
                  />
                  <div className="ms-n8 position-absolute bottom-0 start-0 mb-6">
                    <img
                      src="https://geeksui.codescandy.com/geeks/assets/images/svg/dollor.svg"
                      alt="dollor"
                    />
                  </div>
                  {/* img */}
                  <div className="me-n4 position-absolute top-0 end-0">
                    <img
                      src="https://geeksui.codescandy.com/geeks/assets/images/svg/graph.svg"
                      alt="graph"
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col
              lg={5}
              xs={12}
            >
              <div className="text-white p-5 p-lg-0">
                {/* text */}
                <h2 className="h1 text-white">Become an instructor today</h2>
                <p className="mb-0">
                  Instructors from around the world teach millions of students
                  on Geeks. We provide the tools and skills to teach what you
                  love.
                </p>
                <Button
                  variant="light"
                  className="fw-bold mt-4"
                >
                  Start Teaching Today <i className="fas fa-arrow-right"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="bg-gray-200 pt-8 pb-8 mt-5">
        <Container className="pb-8">
          {/* row */}
          <Row className="mb-lg-8 mb-5">
            <Col
              lg={{ span: 10, offset: 1 }}
              xs={12}
            >
              <Row className="align-items-center">
                {/* col */}
                <Col
                  lg={6}
                  md={8}
                >
                  {/* rating */}
                  <div>
                    <div className="mb-3">
                      <span className="lh-1">
                        <span className="align-text-top ms-2">
                          <i className="fas fa-star text-warning"></i>
                          <i className="fas fa-star text-warning"></i>
                          <i className="fas fa-star text-warning"></i>
                          <i className="fas fa-star text-warning"></i>
                          <i className="fas fa-star text-warning"></i>
                        </span>
                        <span className="text-dark fw-semibold">4.5/5.0</span>
                      </span>
                      <span className="ms-2">(Based on 3265 ratings)</span>
                    </div>
                    {/* heading */}
                    <h2 className="h1">What our students say</h2>
                    <p className="mb-0">
                      Hear from
                      <span className="text-dark">teachers</span>,
                      <span className="text-dark">trainers</span>, and
                      <span className="text-dark">leaders</span>
                      in the learning space about how Geeks empowers them to
                      provide quality online learning experiences.
                    </p>
                  </div>
                </Col>
                <Col
                  lg={6}
                  md={4}
                  className="text-md-end mt-4 mt-md-0"
                >
                  {/* btn */}
                  <Button variant="primary">View Reviews</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* row */}
          <Row>
            {/* col */}
            <Col md={12}>
              <div className="position-relative">
                {/* controls */}
                {/* slider */}
                <div className="sliderTestimonial">
                  {/* item */}
                  <Row>
                    <Col lg={4}>
                      <div className="item">
                        <Card>
                          <Card.Body className="text-center p-6">
                            {/* img */}
                            <img
                              src="../../assets/images/avatar/avatar-1.jpg"
                              alt="avatar"
                              className="avatar avatar-lg rounded-circle"
                            />
                            <p className="mb-0 mt-3">
                              "The generated lorem Ipsum is therefore always
                              free from repetition, injected humour, or words
                              etc generate lorem Ipsum which looks racteristic
                              reasonable."
                            </p>
                            {/* rating */}
                            <div className="lh-1 mb-3 mt-4">
                              <span className="fs-6 align-top">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              </span>
                              <span className="text-warning">5</span>
                              {/* text */}
                            </div>
                            <h3 className="mb-0 h4">Gladys Colbert</h3>
                            <span>Software Engineer at Palantir</span>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="item">
                        <Card>
                          <Card.Body className="text-center p-6">
                            {/* img */}
                            <img
                              src="../../assets/images/avatar/avatar-1.jpg"
                              alt="avatar"
                              className="avatar avatar-lg rounded-circle"
                            />
                            <p className="mb-0 mt-3">
                              "The generated lorem Ipsum is therefore always
                              free from repetition, injected humour, or words
                              etc generate lorem Ipsum which looks racteristic
                              reasonable."
                            </p>
                            {/* rating */}
                            <div className="lh-1 mb-3 mt-4">
                              <span className="fs-6 align-top">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              </span>
                              <span className="text-warning">5</span>
                              {/* text */}
                            </div>
                            <h3 className="mb-0 h4">Gladys Colbert</h3>
                            <span>Software Engineer at Palantir</span>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="item">
                        <Card>
                          <Card.Body className="text-center p-6">
                            {/* img */}
                            <img
                              src="../../assets/images/avatar/avatar-1.jpg"
                              alt="avatar"
                              className="avatar avatar-lg rounded-circle"
                            />
                            <p className="mb-0 mt-3">
                              "The generated lorem Ipsum is therefore always
                              free from repetition, injected humour, or words
                              etc generate lorem Ipsum which looks racteristic
                              reasonable."
                            </p>
                            {/* rating */}
                            <div className="lh-1 mb-3 mt-4">
                              <span className="fs-6 align-top">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={11}
                                  height={11}
                                  fill="currentColor"
                                  className="bi bi-star-fill text-warning"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              </span>
                              <span className="text-warning">5</span>
                              {/* text */}
                            </div>
                            <h3 className="mb-0 h4">Gladys Colbert</h3>
                            <span>Software Engineer at Palantir</span>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Index;
