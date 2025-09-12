import {
    Row,
    Col,
    Card,
    Button,
    Stack,
} from 'react-bootstrap'
import type { EnrolledCourse, Note } from '@/types/base'
import { FaPen } from 'react-icons/fa'
import { BsFillPencilFill, BsFillTrash2Fill } from 'react-icons/bs'

export function Notes({ course_detail, handleNoteShow, deleteNote }: {
    course_detail: EnrolledCourse | undefined,
    handleNoteShow: (type: string, noteData?: Note) => void,
    deleteNote: (note: Note) => void
}) {
    return (
        <Card>
            <Card.Header className="border-bottom p-0 pb-3 bg-white">
                <div className="d-sm-flex justify-content-between align-items-center">
                    <h4 className="mb-0 p-3">All Notes</h4>
                    <Button variant="primary" className="me-3" onClick={() => handleNoteShow('add')}>
                        Add Note <FaPen className="mb-1 ms-1" />
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="p-0 pt-3">
                <Row className="g-4 p-3">
                    {
                        course_detail && course_detail?.note.length > 0 ?
                            course_detail?.note.map((note, index) => (
                                <Col key={index} sm={11} xl={11} className="shadow p-3 m-3 rounded">
                                    <h5>{note.title}</h5>
                                    <p>
                                        {note.note}
                                    </p>
                                    <Stack direction="horizontal" gap={3} className="flex-wrap">
                                        <Button variant="success" onClick={() => handleNoteShow('edit', note)}>
                                            <BsFillPencilFill className="mb-1 me-2" /> Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => deleteNote(note)}>
                                            <BsFillTrash2Fill className="mb-1 me-2" /> Delete
                                        </Button>
                                    </Stack>
                                </Col>
                            ))
                            :
                            <p className='ms-2 fw-bold fs-5'>No note here, you can add one.</p>
                    }
                </Row>
            </Card.Body>
        </Card>
    )
}