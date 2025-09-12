import {
    Button,
    Modal,
    Form,
} from 'react-bootstrap'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'

export function NoteAddOrEditModal({ editOrAdd, noteShow, createNote, saveNote, handleNoteClose, handleNoteChange }: {
    editOrAdd: boolean,
    noteShow: boolean,
    createNote: {
        title: string;
        note: string;
    },
    saveNote: (e: React.FormEvent<HTMLFormElement>) => void,
    handleNoteClose: () => void,
    handleNoteChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
    return (
        <Modal show={noteShow} size='lg' onHide={handleNoteClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editOrAdd ? 'Add Note' : 'Edit Note'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveNote}>
                    <Form.Group className="mb-3" controlId="noteTitle">
                        <Form.Label>Note Title</Form.Label>
                        <Form.Control
                            name='title'
                            type="text"
                            value={createNote.title}
                            onChange={handleNoteChange}
                            placeholder="Enter note title"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="noteContent">
                        <Form.Label>Note Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='note'
                            rows={10}
                            value={createNote.note}
                            onChange={handleNoteChange}
                            placeholder="Enter note content"
                        />
                    </Form.Group>
                    <Button variant="secondary" className="me-2" onClick={handleNoteClose}>
                        <FaArrowLeft className="mb-1 me-2" /> Close
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Note <FaCheckCircle className="mb-1 me-2" />
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}