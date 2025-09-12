import { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Card, Form, Button, ListGroup, Image, Collapse } from 'react-bootstrap'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'
import { getCurrentTeacherId } from '@/api/constants'
import dayjs from 'dayjs'
import type { Review as ReviewType } from '@/types/base'
import Rater from 'react-rater'
import { FaArrowRight, FaPaperPlane } from 'react-icons/fa'
import Toast from '@/utils/SweetAlert2/Toast'
function Review() {
    const queryClient = useQueryClient()
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [currentTextArea, setCurrentTextArea] = useState('')
    const [filteredReviewList, setFilteredReviewList] = useState<ReviewType[]>([])
    const authAxios = createAuthenticatedAxios()
    const ratingRef = useRef<HTMLSelectElement>(null)
    const dateRef = useRef<HTMLSelectElement>(null)
    const teacherId = getCurrentTeacherId()
    const handleResponseExpandOrCollapse = (index: number) => {
        if (currentIndex == index) {
            setCurrentIndex(-1)
            return
        }
        setCurrentIndex(index)
    }
    const fetchReviewList = async (): Promise<ReviewType[]> => {
        if (!teacherId) {
            throw new Error('Teacher ID not available')
        }
        const res = await authAxios.get(`teacher/review-list/${teacherId}`)
        return res.data
    }
    const { data: reviewList } = useQuery({
        queryKey: ['review-list', teacherId],
        queryFn: fetchReviewList,
        enabled: !!teacherId
    })
    useEffect(() => {
        if (reviewList) {
            setFilteredReviewList(reviewList)
        }
    }, [reviewList])
    console.log('reviewList:', reviewList)
    const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentTextArea(e.target.value)
    }
    console.log(currentTextArea)
    const sendResponseMutation = useMutation({
        mutationFn: async (variables: { review_id: string }) => {
            if (!teacherId) {
                throw new Error('Teacher ID not available')
            }
            const res = await authAxios.patch(`teacher/review-detail/${teacherId}/${variables.review_id}/`, {
                reply: currentTextArea
            })
            return res.data
        },
        onSuccess: (data) => {
            console.log('更新评论data:', data)
            Toast.fire({
                icon: 'success',
                text: '更新评论成功🏅'
            })
            queryClient.invalidateQueries({ queryKey: ['review-list', teacherId] })
        },
        onError: (error) => {
            Toast.fire({
                icon: 'success',
                text: '更新评论失败☹️' + error
            })
        }
    })
    const sendResponse = (e: React.FormEvent, review_id: string) => {
        e.preventDefault()
        sendResponseMutation.mutate({ review_id: review_id })
    }

    // 移除了不再使用的 filterByRating 和 filterByDate 函数
    // 过滤逻辑已经集成到 handleSelectChange 中

    const handleSelectChange = () => {
        // 应用所有过滤条件的核心函数
        const applyAllFilters = () => {
            if (!reviewList) return

            let result = [...reviewList]

            // 应用评分过滤
            const currentRating = ratingRef.current?.value
            if (currentRating && currentRating !== '') {
                result = result.filter(item => String(item.rating) === currentRating)
            }

            // 应用日期排序
            const currentSort = dateRef.current?.value
            if (currentSort && currentSort !== '') {
                if (currentSort === 'Oldest') {
                    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                } else {
                    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                }
            }

            setFilteredReviewList(result)
        }

        // 无论哪个select发生变化，都重新应用所有过滤条件
        applyAllFilters()
    }

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
                                <Card.Header className="d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Reviews</h3>
                                        <span>You have full control to manage your own account setting.</span>
                                    </div>
                                </Card.Header>
                                {/* Card body */}
                                <Card.Body>
                                    {/* Form */}
                                    <Form className="row mb-4 gx-2">
                                        <Col xl={2} lg={2} md={4} xs={12} className="mb-2 mb-lg-0">
                                            {/* Custom select */}
                                            <Form.Select name='rating' onChange={handleSelectChange} ref={ratingRef}>
                                                <option value="">Rating</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xl={3} lg={3} md={4} xs={12} className="mb-2 mb-lg-0">
                                            {/* Custom select */}
                                            <Form.Select name='sort' onChange={handleSelectChange} ref={dateRef}>
                                                <option value="">Sort by</option>
                                                <option value="Newest">Newest</option>
                                                <option value="Oldest">Oldest</option>
                                            </Form.Select>
                                        </Col>
                                    </Form>
                                    {/* List group */}
                                    {
                                        filteredReviewList?.map((review, index) => (
                                            <ListGroup key={index} variant="flush">
                                                {/* List group item */}
                                                <ListGroup.Item className="p-4 shadow rounded-3">
                                                    <div className="d-flex w-100">
                                                        <Image
                                                            src={String(review.profile.image)}
                                                            alt="avatar"
                                                            roundedCircle
                                                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                        />
                                                        <div className="ms-3 mt-2 w-100">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <h4 className="mb-0">{review.profile.full_name}</h4>
                                                                    <span>{dayjs(review.date).fromNow()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <Rater total={5} rating={review.rating || 0} />
                                                                <span className="me-1">for</span>
                                                                <span className="h5">
                                                                    {review.course.title}
                                                                </span>
                                                                <p className="mt-2">
                                                                    <span className='fw-bold me-2'>Review <FaArrowRight /></span>
                                                                    {review.review}
                                                                </p>
                                                                <p className="mt-2">
                                                                    <span className='fw-bold me-2'>Response <FaArrowRight /></span>
                                                                    {review.reply}
                                                                </p>
                                                                <p>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        onClick={() => handleResponseExpandOrCollapse(index)}
                                                                        aria-controls="collapseExample"
                                                                        aria-expanded={currentIndex == index}
                                                                    >
                                                                        {currentIndex == index ? 'Collapse' : 'Send Response'}
                                                                    </Button>
                                                                </p>
                                                                <Collapse in={index == currentIndex}>
                                                                    <div id="collapseExample">
                                                                        <Card >
                                                                            <Card.Body>
                                                                                <Form onSubmit={(e) => sendResponse(e, String(review.id))}>
                                                                                    <Form.Group className="mb-3">
                                                                                        <Form.Label htmlFor="exampleInputEmail1">Write Response</Form.Label>
                                                                                        <Form.Control
                                                                                            as="textarea"
                                                                                            rows={4}
                                                                                            onChange={handleResponseChange}
                                                                                        />
                                                                                    </Form.Group>

                                                                                    <Button type="submit" variant="primary">
                                                                                        Send Response <FaPaperPlane />
                                                                                    </Button>
                                                                                </Form>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </div>
                                                                </Collapse>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                            </ListGroup>
                                        ))
                                    }
                                    {
                                        filteredReviewList.length == 0 &&
                                        <>
                                            <h3>No Review here.</h3>
                                        </>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Review

