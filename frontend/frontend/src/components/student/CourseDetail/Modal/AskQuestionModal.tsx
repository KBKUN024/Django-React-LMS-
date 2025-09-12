import {
    Button,
    Modal,
    Form,
} from 'react-bootstrap'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'

export function AskQuestionModal({ askQuestionShow, createQuestion, saveQuestion, handleQuestionClose, handleQuestionChange }: {
    askQuestionShow: boolean,
    createQuestion: {
        title: string;
        message: string;
    },
    saveQuestion: (e: React.FormEvent<HTMLFormElement>) => void,
    handleQuestionClose: () => void,
    handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
    return (
        <Modal show={askQuestionShow} size='lg' onHide={handleQuestionClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ask Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveQuestion}>
                    <Form.Group className="mb-3" controlId="noteTitle">
                        <Form.Label>Question Title</Form.Label>
                        <Form.Control
                            name='title'
                            type="text"
                            value={createQuestion.title}
                            onChange={handleQuestionChange}
                            placeholder="Enter question title"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="noteContent">
                        <Form.Label>Question Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='message'
                            rows={10}
                            value={createQuestion.message}
                            onChange={handleQuestionChange}
                            placeholder="Enter question content"
                        />
                    </Form.Group>
                    <Button variant="secondary" className="me-2" onClick={handleQuestionClose}>
                        <FaArrowLeft className="mb-1 me-2" /> Close
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Question <FaCheckCircle className="mb-1 me-2" />
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}