import {
    Button,
    Modal,
    Form,
    ListGroup,
} from 'react-bootstrap'
import type { Question_Answer } from '@/types/base'
import { FaPaperPlane } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export function ConversationModal({ conversationShow, postMessage, isPending, selectedConversation, handleConversationClose }: {
    conversationShow: boolean,
    selectedConversation: Question_Answer | undefined,
    isPending: boolean,
    handleConversationClose: () => void,
    postMessage: (qa_id: string, message: string) => void
}) {
    const [message, setMessage] = useState('')
    const listRef = useRef<HTMLAnchorElement>(null)
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({ behavior: 'instant' })
        }
    }, [selectedConversation])
    useEffect(() => {
        setMessage('')
    }, [isPending])
    return (
        <Modal show={conversationShow} size='lg' onHide={handleConversationClose}>
            <Modal.Header closeButton>
                <Modal.Title>Question:{selectedConversation?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="border p-2 p-sm-4 rounded-3">
                    <ListGroup variant="flush" style={{ overflowY: "scroll", height: "300px" }}>
                        {selectedConversation?.messages.map((message, idx) => (
                            <ListGroup.Item ref={listRef} key={idx} className="comment-item">
                                <div className="d-flex">
                                    <div className="avatar avatar-sm flex-shrink-0">
                                        <a href="#">
                                            <img className="avatar-img rounded-circle" src={String(message.profile.image)} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt={message.profile.full_name} />
                                        </a>
                                    </div>
                                    <div className="ms-2">
                                        <div className="bg-light p-3 rounded w-100">
                                            <div className="d-flex w-100 justify-content-center">
                                                <div className="me-2 ">
                                                    <h6 className="mb-1 lead fw-bold">
                                                        <a href="#!" className='text-decoration-none text-dark'>{message.profile.full_name} </a><br />
                                                        <span style={{ fontSize: "12px", color: "gray" }}>{dayjs(message.date).fromNow()}</span>
                                                    </h6>
                                                    <p className="mb-0 mt-3">
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <Form className="w-100 mt-3">
                        <Form.Control
                            as="textarea"
                            name="message"
                            className="one pe-4 mb-2 bg-light"
                            rows={5}
                            placeholder="What's your conversation message?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button className="mb-0 w-25" type="button" onClick={() => selectedConversation && postMessage(selectedConversation?.qa_id, message.trim())}>
                            Post <FaPaperPlane className="mb-1 me-2" />
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}