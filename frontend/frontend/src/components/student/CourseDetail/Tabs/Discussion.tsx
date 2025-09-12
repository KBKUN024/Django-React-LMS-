import {
    Col,
    Card,
    Button,
    Form,
    InputGroup,
    Stack,
} from 'react-bootstrap'
import dayjs from 'dayjs'
import type { Question_Answer, EnrolledCourse } from '@/types/base'
import { FaArrowRight, FaSearch } from 'react-icons/fa'

export function Discussion({ questions, course_detail, handleQuestionShow, setQuestions, handleConversationShow }: {
    handleQuestionShow: () => void,
    handleConversationShow: (conversation: Question_Answer) => void,
    questions: Question_Answer[],
    course_detail: EnrolledCourse | undefined,
    setQuestions: React.Dispatch<React.SetStateAction<Question_Answer[]>>
}) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase()
        if (query !== '') {
            const filtered_questions = course_detail?.question_answer.filter(q => q.title?.toLowerCase().includes(query))
            filtered_questions && setQuestions(filtered_questions)
        } else {
            course_detail?.question_answer && setQuestions(course_detail?.question_answer)
        }
    }
    return (
        <Card>
            <Card.Header className="border-bottom p-0 pb-3 bg-white">
                <h4 className="mb-3 p-3">Discussion</h4>
                <Form className="row g-4 p-3">
                    <Col sm={6} lg={9}>
                        <InputGroup>
                            <Form.Control type="search" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                            <Button variant="outline-primary">
                                <FaSearch className="mb-1 me-2" />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col sm={6} lg={3}>
                        <Button variant="primary" className="w-100" onClick={handleQuestionShow}>
                            Ask Question
                        </Button>
                    </Col>
                </Form>
            </Card.Header>
            <Card.Body className="p-0 pt-3">
                <Stack gap={3} className="p-3">
                    {
                        questions.length > 0 ?
                            questions.map((q, index) => (
                                <Card key={index} className="shadow rounded-3 p-3">
                                    <div className="d-sm-flex justify-content-sm-between mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar avatar-sm flex-shrink-0">
                                                <img
                                                    src={String(q.profile.image)}
                                                    className="avatar-img rounded-circle"
                                                    alt="avatar"
                                                    style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="ms-2">
                                                <h6 className="mb-0">
                                                    <a href="#" className='text-decoration-none texmoment(q.date)'>{q.profile.full_name}</a>
                                                </h6>
                                                <small>{dayjs(q.date).format('YY/MM/DD HH:MM:ss')}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <h5>{q.title}</h5>
                                    <Button size="sm" className="mb-3 mt-3" onClick={() => handleConversationShow(q)}>
                                        Join Conversation <FaArrowRight className="mb-1 me-2" />
                                    </Button>
                                </Card>
                            ))
                            :
                            <h4>No Conversation here.</h4>
                    }
                </Stack>
            </Card.Body>
        </Card>
    )
}