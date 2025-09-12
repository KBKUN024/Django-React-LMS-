import { Row, Col, Card, Button, Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import type { Course } from "@/types/base/index";
import Rater from "react-rater";
import { useAddToCart, useCurrentAddress } from '@/hooks'
import { useAuthStore } from '@/store'
import { GenerateCartId } from '@/utils'
import { IoMdDoneAll } from "react-icons/io";
import { createAuthenticatedAxios } from '@/api/axios'
import { GetUserData } from '@/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from '@/utils/SweetAlert2/Toast'
import { useDebounce } from '@/hooks'

function CourseListItem({ course }: { course: Course }) {
  const authAxios = createAuthenticatedAxios()
  const { user } = useAuthStore()
  const { addToCart, isPending, isSuccess } = useAddToCart()
  const { address } = useCurrentAddress()
  const queryClient = useQueryClient()
  const userId = user().user_id
  const cartId = GenerateCartId()
  const userData = GetUserData()
  const renderTooltip = (props: React.ComponentProps<typeof Tooltip>) => {
    let tooltipText = '';

    if (isPending) {
      tooltipText = 'Adding...';
    } else if (isSuccess || course.isInCart) {
      tooltipText = 'Already in cart';
    } else {
      tooltipText = 'Add to cart';
    }

    return (
      <Tooltip id="button-tooltip" {...props}>
        {tooltipText}
      </Tooltip>
    );
  };
  const { debounce } = useDebounce()

  const addToWishlist = async (variables: { course_id: string }) => {
    const res = await authAxios
      .post(`student/wish_list/${userData?.user_id}/`, {
        course_id: variables.course_id
      })
    return res.data
  };
  const wishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wish-list'] })
      queryClient.invalidateQueries({ queryKey: ['courses_list'] })
      Toast.fire({
        icon: 'success',
        text: '添加到愿望单成功🏅'
      })
      console.log('成功添加到愿望单,data:', data)
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: '添加到愿望单失败☹️' + error
      })
    }
  })

  const like_unlike = debounce((courseId: string) => {
    wishlistMutation.mutate({ course_id: courseId })
  }, 300)

  return (
    <>
      <Card
        className="card-hover"
        style={{ minHeight: "460px" }}
      >
        <Link to={`/course-detail/${course.slug}/`}>
          <Card.Img
            variant="top"
            src={String(course.image)}
            alt="course"
            height={190}
            style={{
              objectFit: 'cover',

            }}
          />
        </Link>
        {/* Card Body */}
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Badge bg="info">{course.level}</Badge>
            {
              userId && like_unlike &&
              (
                course.isInWishlist ?
                  <FaHeart
                    onClick={() => like_unlike(course.course_id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  /> :
                  <FaRegHeart
                    onClick={() => like_unlike(course.course_id)}
                    style={{ cursor: 'pointer' }}
                  />
              )
            }
          </div>
          <Card.Title className="mb-2 text-truncate-line-2">
            <Link
              to={`/course-detail/${course.slug}/`}
              className="text-inherit text-decoration-none text-dark fs-5"
            >
              {course.title}
            </Link>
          </Card.Title>
          <small>By: {course.teacher.full_name}</small> <br />
          <small>
            {course.students.length} Student
            {course.students.length > 1 ? "s" : ""}
          </small>{" "}
          <br />
          <div className="lh-1 mt-3 d-flex">
            <span className="align-text-top">
              <span className="fs-6">
                <Rater
                  total={5}
                  rating={course.average_rating || 0}
                />
              </span>
            </span>
            <span className="text-warning">{course.average_rating || 0}</span>
            <span className="fs-6 ms-2">(9,300)</span>
          </div>
        </Card.Body>
        {/* Card Footer */}
        <Card.Footer>
          <Row className="align-items-center g-0">
            <Col>
              <h5 className="mb-0">${course.price}</h5>
            </Col>
            <Col
              xs="auto"
              className=" d-flex gap-2"
            >
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <div className="d-inline-flex">
                  <Button
                    variant="primary"
                    className=" d-flex align-items-center"
                    onClick={() => addToCart(
                      String(course.id),
                      String(userId),
                      course.price,
                      address?.country ?? 'China',
                      cartId
                    )}
                    disabled={course.isInCart || isPending || isSuccess}
                    style={course.isInCart || isPending || isSuccess ? { pointerEvents: 'none' } : {}}
                  >
                    {
                      isPending ?
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            style={{ verticalAlign: "middle" }}
                          ></span>
                        </> : (
                          isSuccess ? <IoMdDoneAll /> : (course.isInCart ? <IoMdDoneAll /> : <PiShoppingCartSimpleBold />)
                        )
                    }
                  </Button>
                </div>
              </OverlayTrigger>
              <Button
                variant="primary"
                className=" d-flex align-items-center"
                onClick={() => console.log("Enroll Now clicked")}
              >
                Enroll Now
                <FaArrowRight className="ms-1" />
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
}
export default CourseListItem;
