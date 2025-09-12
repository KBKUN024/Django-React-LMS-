import {
    Button,
    Accordion,
    ProgressBar,
    Form,
    ListGroup,
} from 'react-bootstrap'
import type { EnrolledCourse, VariantItem } from '@/types/base'
import { FaPlay } from 'react-icons/fa'

export function Lectures({ percentage, course_detail, handleCompletedStatus, handleShow, completedStatus }: {
    percentage: number,
    course_detail: EnrolledCourse | undefined,
    handleCompletedStatus: (e: React.ChangeEvent<HTMLInputElement>, variant_item_id: string) => void,
    handleShow: (variant_item: VariantItem) => void,
    completedStatus: { [key: string]: boolean }
}) {
    return <>
        <Accordion defaultActiveKey="0" className="mb-3">
            <div className="mb-3">
                <ProgressBar now={percentage} label={`${percentage}%`} />
            </div>
            {
                course_detail?.curriculum.map((chapter, index) => (
                    <Accordion.Item
                        key={index}
                        eventKey={String(index)}
                        style={{
                            borderTop: index === 0
                                ? '1px solid #dee2e6'
                                : '1px solid inherit',
                            overflow: 'hidden',
                            borderTopLeftRadius: index === 0 ? '0.5rem' : 0,
                            borderTopRightRadius: index === 0 ? '0.5rem' : 0,
                        }}
                    >
                        <Accordion.Header>
                            {chapter.title}
                            <span className="small ms-2">({chapter.variant_items.length} Lecture{chapter.variant_items.length > 1 && 's'})</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ListGroup className="d-flex justify-content-between align-items-center">
                                {
                                    chapter.variant_items.map((item, item_index) => (
                                        <ListGroup.Item key={item_index} className="w-100 d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <Button variant="danger" size="sm" className="me-2" onClick={() => handleShow(item)}>
                                                    <FaPlay className="mb-1" />
                                                </Button>
                                                <span className="text-truncate h6 fw-light" style={{ maxWidth: 400 }}>{item.title}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span className="mb-0 me-2">{item.content_duration || '0m 0s'}</span>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={(e) => handleCompletedStatus(e, item.variant_item_id)}
                                                    checked={completedStatus[item.variant_item_id] || false}
                                                />
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                ))

            }
        </Accordion>
    </>
}
