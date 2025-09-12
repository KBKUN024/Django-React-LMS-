import {
    Col,
    Card,
    Button,
    Form,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'

export function Review({ handleReviewChange, postReview, studentExistingReview }: {
    handleReviewChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void,
    postReview: (e: React.FormEvent<HTMLFormElement>) => void,
    studentExistingReview: {
        rating: string;
        review: string;
    }
}) {
    const [currentRating, setCurrentRating] = useState('0')
    const [currentReview, setCurrentReview] = useState('')
    const [buttonType, setButtonType] = useState(true) // true: post a new review, false: update a existing review

    useEffect(() => {
        if (studentExistingReview.rating !== '' && studentExistingReview.review !== '') {
            setCurrentRating(studentExistingReview.rating)
            setCurrentReview(studentExistingReview.review)
            setButtonType(false)
        } else {
            setCurrentRating('0')
            setCurrentReview('')
            setButtonType(true)
        }
    }, [studentExistingReview])

    const handleLocalChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'rating') {
            setCurrentRating(value)
        } else if (name === 'review') {
            setCurrentReview(value)
        }
        // 同时调用父组件的处理函数
        handleReviewChange(e)
    }
    return (
        <Card>
            <Card.Header className="border-bottom p-0 pb-3 bg-white">
                <h4 className="mb-3 p-3">Leave a Review</h4>
                <div className="mt-2">
                    <Form onSubmit={postReview} className="row g-3 p-3">
                        <Col xs={12} className="bg-light-input">
                            <Form.Select
                                id="inputState2"
                                name='rating'
                                value={currentRating}
                                onChange={handleLocalChange}
                            >
                                <option value="0">Rating here</option>
                                <option value="1">★☆☆☆☆ (1/5)</option>
                                <option value="2">★★☆☆☆ (2/5)</option>
                                <option value="3">★★★☆☆ (3/5)</option>
                                <option value="4">★★★★☆ (4/5)</option>
                                <option value="5">★★★★★ (5/5)</option>
                            </Form.Select>
                        </Col>
                        <Col xs={12} className="bg-light-input">
                            <Form.Control
                                as="textarea"
                                placeholder="Your review"
                                rows={3}
                                name='review'
                                value={currentReview}
                                onChange={handleLocalChange}
                            />
                        </Col>
                        <Col xs={12}>
                            <Button type="submit" className="mb-0">
                                {buttonType?'Post':'Update'} Review
                            </Button>
                        </Col>
                    </Form>
                </div>
            </Card.Header>
        </Card>
    )
}