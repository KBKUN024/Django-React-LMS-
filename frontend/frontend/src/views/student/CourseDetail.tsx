import { useState, useRef, useEffect } from 'react'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import ReactPlayer from 'react-player'
import { useAuthStore } from '@/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { EnrolledCourse, VariantItem, Note, Question_Answer } from '@/types/base'
import { Lectures, Notes, Discussion, Review, LecturesVideoModal, NoteAddOrEditModal, AskQuestionModal, ConversationModal } from '@/components'
import {
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
} from 'react-bootstrap'
import { createAuthenticatedAxios } from '@/api/axios'
import { GetUserData } from '@/utils'
import { useParams } from 'react-router-dom'
import Toast from '@/utils/SweetAlert2/Toast'

function CourseDetail() {
  const queryClient = useQueryClient()
  const authAxios = createAuthenticatedAxios()
  const { profile } = useAuthStore()
  console.log('profile in coursedetail:', profile)
  const userData = GetUserData()
  const params = useParams()
  const [variant_item, setVariantItem] = useState<VariantItem>()
  const [percentage, setPercentage] = useState(0)
  const [completedStatus, setCompletedStatus] = useState<{ [key: string]: boolean }>({})
  const [isPlaying, setIsPlaying] = useState(false);
  const [createNote, setCreateNote] = useState({ title: '', note: '' })
  const [selectedNote, setSelectedNote] = useState<Note>()
  const [editOrAdd, setEditOrAdd] = useState(true) // true代表add，false代表edit
  const [createQuestion, setCreateQuestion] = useState({
    title: '',
    message: ''
  })
  const [createReview, setCreateReview] = useState({ rating: '', review: '' })
  const [questions, setQuestions] = useState<Question_Answer[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Question_Answer>()
  const [studentExistingReview, setStudentExistingReview] = useState({ rating: '', review: '' })
  const playerRef = useRef<ReactPlayer>(null);
  const initialCompletedStatusRef = useRef(completedStatus)

  // modal start
  const [show, setShow] = useState(false);
  const handleClose = () => {
    // 强制停止当前播放
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setIsPlaying(false);
    setShow(false);
    // 延迟清除视频数据，确保ReactPlayer完全卸载
    setTimeout(() => {
      setVariantItem(undefined);
    }, 100);
  };
  const handleShow = (variant_item: VariantItem) => {
    // 如果已经有视频在播放，先关闭
    if (show && playerRef.current) {
      playerRef.current.seekTo(0);
      setIsPlaying(false);
    }
    setVariantItem(variant_item);
    setShow(true);
    // 延迟开始播放，确保Modal完全打开
    setTimeout(() => {
      setIsPlaying(true);
    }, 200);
  }

  // 监听Modal的显示状态，确保在Modal关闭时停止播放
  useEffect(() => {
    if (!show) {
      setIsPlaying(false);
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    }
  }, [show]);

  const [noteShow, setNoteShow] = useState(false);
  const [askQuestionShow, setAskQuestionShow] = useState(false)

  const handleNoteClose = () => setNoteShow(false);
  const handleNoteShow = (type: string, noteData?: Note) => {
    setNoteShow(true);
    if (type == 'add') {
      setEditOrAdd(true) // add
      // 重置表单数据
      setCreateNote({ title: '', note: '' })
    } else {
      setEditOrAdd(false) // edit
      if (noteData) {
        setSelectedNote(noteData)
        // 初始化编辑表单数据
        setCreateNote({
          title: noteData.title || '',
          note: noteData.note || ''
        })
      }
    }
  }
  const handleQuestionClose = () => setAskQuestionShow(false);
  const handleQuestionShow = () => {
    setAskQuestionShow(true)
  }

  const [conversationShow, setConversationShow] = useState(false);
  const handleConversationClose = () => {
    setConversationShow(false)
    setSelectedConversation(undefined)
  };
  const handleConversationShow = (conversation: Question_Answer) => {
    setConversationShow(true);
    setSelectedConversation(conversation)
  }
  // modal end

  const [tabKey, setTabKey] = useState('lectures');

  const fetchStudentCourseDetail = async (): Promise<EnrolledCourse> => {
    const res = await authAxios.get(`/student/course-detail/${userData?.user_id}/${params.enrollment_id}`)
    return res.data
  }
  const { data: course_detail } = useQuery({
    queryKey: ['student-course-detail', userData?.user_id, params.enrollment_id],
    queryFn: fetchStudentCourseDetail,
    staleTime: 5 * 60 * 1000,
    enabled: !!userData?.user_id
  })
  console.log('course_detail', course_detail)
  // 使用useEffect监听course_detail变化来初始化completedStatus和计算percentage
  useEffect(() => {
    if (course_detail?.completed_lesson && course_detail?.lectures) {
      // 初始化completedStatus状态
      const initialCompletedStatus: { [key: string]: boolean } = {}
      for (const cl of course_detail.completed_lesson) {
        initialCompletedStatus[cl.variant_item.variant_item_id] = true
      }
      initialCompletedStatusRef.current = initialCompletedStatus
      setCompletedStatus(initialCompletedStatus)
      setQuestions(course_detail.question_answer)
      if (course_detail.review) {
        setStudentExistingReview({
          rating: String(course_detail?.review?.rating),
          review: course_detail?.review.review
        })
      }
      if (selectedConversation) {
        const newSelectedConversation = course_detail.question_answer.filter(q => q.qa_id === selectedConversation.qa_id)
        setSelectedConversation(newSelectedConversation[0])
      }
      // 计算初始进度百分比
      const percent = (course_detail.completed_lesson.length / course_detail.lectures.length)
      setPercentage(Math.round(percent * 100))
    }
  }, [course_detail])

  const handleCompletedStatus = (e: React.ChangeEvent<HTMLInputElement>, variant_item_id: string) => {
    setCompletedStatus(prev => ({
      ...prev,
      [variant_item_id]: e.target.checked
    }))
  }
  const syncMutation = useMutation({
    mutationFn: async (variables: { course_id: string, user_id: string, completed_variant_ids: string[] }) => {
      const res = await authAxios.post('/student/course-completed-sync/', {
        course_id: variables.course_id,
        user_id: variables.user_id,
        completed_variant_ids: variables.completed_variant_ids
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('同步成功:', data)
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      queryClient.invalidateQueries({ queryKey: ['student-course-list'] })
      queryClient.invalidateQueries({queryKey: ['student-summary', userData?.user_id] })
    },
    onError: (error) => {
      console.log('同步失败', error)
    }
  })

  // 监听completedStatus变化来重新计算进度百分比
  useEffect(() => {
    if (course_detail?.lectures) {
      const lecturesLength = course_detail.lectures.length

      // 计算已完成的课程数量
      const completedCount = Object.values(completedStatus).filter(Boolean).length
      const percent = lecturesLength > 0 ? (completedCount / lecturesLength) : 0
      setPercentage(Math.round(percent * 100))
    }
  }, [completedStatus, course_detail?.lectures])

  // 使用useRef保存最新的completedStatus，用于清理函数
  const latestCompletedStatus = useRef(completedStatus)

  // 更新ref中的值
  useEffect(() => {
    latestCompletedStatus.current = completedStatus
  }, [completedStatus])

  // 使用useRef保存最新的数据，避免useEffect依赖问题
  const latestCourseDetail = useRef(course_detail)
  const latestUserData = useRef(userData)

  // 使用useRef保存最新的数据
  useEffect(() => {
    latestCourseDetail.current = course_detail
    latestUserData.current = userData
  }, [course_detail, userData])

  const shallowEqual = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    return keys1.length === keys2.length &&
      keys1.every(key => obj1[key] === obj2[key])
  }

  // 只在组件卸载时执行的清理函数（无依赖项）,组件卸载的时候，自动同步所有checkbox的选中状态
  useEffect(() => {
    return () => {
      // 比较最新的completedStatus和最初的completedStatus是不是一样的，如果一样，则 shallowEqual 返回true
      // hasChanged就是false，代表未改变，就不用发出下面的同步请求。
      // 不然之前每次退出此组件的时候都会执行清理函数，执行不必要的同步请求
      const hasChanged = !shallowEqual(latestCompletedStatus.current, initialCompletedStatusRef.current)
      // 在组件卸载时发送POST请求同步completed_lesson状态
      if (hasChanged && Object.keys(latestCompletedStatus.current).length > 0 && latestCourseDetail.current) {
        console.log('组件卸载，同步最终完成状态:', latestCompletedStatus.current)

        // 获取所有被标记为完成的variant_item_id
        const completedVariantIds = Object.keys(latestCompletedStatus.current)
          .filter(key => latestCompletedStatus.current[key] === true)

        console.log('需要同步的完成课程:', completedVariantIds)

        // 使用新的同步API
        syncMutation.mutate({
          course_id: String(latestCourseDetail.current.course.course_id),
          user_id: String(latestUserData.current?.user_id),
          completed_variant_ids: completedVariantIds
        })
      }
    }
  }, [])

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateNote(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateQuestion(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleReviewChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    if (studentExistingReview.rating !== '' && studentExistingReview.review !== '') {
      // 更新现有评价模式
      setStudentExistingReview(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      // 创建新评价模式
      setCreateReview(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  console.log('createReview:', createReview)

  const editOrAddFunc = async () => {
    // 表单验证
    if (!createNote.title.trim()) {
      Toast.fire({
        icon: 'error',
        text: '请输入笔记标题'
      })
      throw new Error('请输入笔记标题')
    }
    if (!createNote.note.trim()) {
      Toast.fire({
        icon: 'error',
        text: '请输入笔记内容'
      })
      throw new Error('请输入笔记内容')
    }

    const formData = new FormData();
    formData.append("title", createNote.title.trim());
    formData.append("note", createNote.note.trim());

    if (editOrAdd) {
      // 添加模式
      const path = `student/course-note/${userData?.user_id}/${params.enrollment_id}/`
      const res = await authAxios.post(path, formData)
      return res.data
    } else {
      // 编辑模式
      if (!selectedNote?.note_id) {
        Toast.fire({
          icon: 'error',
          text: '未找到要编辑的笔记'
        })
        throw new Error('未找到要编辑的笔记')
      }
      const path = `student/course-note-detail/${userData?.user_id}/${params.enrollment_id}/${selectedNote.note_id}/`
      const res = await authAxios.patch(path, formData)
      return res.data
    }
  }

  const saveAddNoteMutation = useMutation({
    mutationFn: editOrAddFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: editOrAdd ? '创建笔记成功' : '更新笔记成功'
      })
      handleNoteClose()
      // 重置表单数据
      setCreateNote({ title: '', note: '' })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: error.message || (editOrAdd ? '创建笔记失败' : '更新笔记失败')
      })
      // 不要在错误时关闭Modal，让用户可以修正错误
    }
  })

  const saveQuestionMutation = useMutation({
    mutationFn: async () => {
      const path = `student/question-answer-list-create/${course_detail?.course.course_id}/`
      const formData = new FormData();
      formData.append("user_id", String(userData?.user_id));
      formData.append("course_id", String(course_detail?.course.course_id));
      formData.append("title", createQuestion.title.trim());
      formData.append("message", createQuestion.message.trim());
      const res = await authAxios.post(path, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: '创建问题成功'
      })
      handleQuestionClose()
      // 重置表单数据
      setCreateQuestion({ title: '', message: '' })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: error.message + '创建问题失败'
      })
      // 不要在错误时关闭Modal，让用户可以修正错误
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const path = `student/course-note-detail/${userData?.user_id}/${params.enrollment_id}/${selectedNote?.note_id}/`
      const res = await authAxios.delete(path)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: '删除成功'
      })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: '删除成功' + error
      })
    }
  })

  const postConversationMessageMutation = useMutation({
    mutationFn: async (variables: { qa_id: string, message: string }) => {
      const path = `student/question-answer-message-create/`
      const formData = new FormData();
      formData.append("user_id", String(userData?.user_id));
      formData.append("course_id", String(course_detail?.course.course_id));
      formData.append("qa_id", variables.qa_id);
      formData.append("message", variables.message);
      const res = await authAxios.post(path, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: '回复成功'
      })
      handleQuestionClose()
      // 重置表单数据
      setCreateQuestion({ title: '', message: '' })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: error.message + '回复失败'
      })
      // 不要在错误时关闭Modal，让用户可以修正错误
    }
  })

  const post_a_review = async (variables: { rating: string, review: string }) => {
    const path = `student/rate-course/`
    const formData = new FormData();
    formData.append("user_id", String(userData?.user_id));
    formData.append("course_id", String(course_detail?.course.course_id));
    formData.append("rating", variables.rating);
    formData.append("review", variables.review);
    const res = await authAxios.post(path, formData)
    return res.data
  }
  const update_a_review = async (variables: { course_id: string, rating: string, review: string }) => {
    const path = `student/review-detail/${userData?.user_id}/${course_detail?.review?.id}/`
    const formData = new FormData();
    formData.append("course_id", variables.course_id);
    formData.append("rating", variables.rating);
    formData.append("review", variables.review);
    const res = await authAxios.patch(path, formData)
    return res.data
  }

  const postReviewMutation = useMutation({
    mutationFn: post_a_review,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: '评分成功'
      })
      setCreateReview({ rating: '', review: '' })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: error.message + '评分失败'
      })
    }
  })
  const updateReviewMutation = useMutation({
    mutationFn: update_a_review,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] })
      Toast.fire({
        icon: 'success',
        text: '评分修改成功'
      })
      console.log('修改review data：', data)
      setCreateReview({ rating: '', review: '' })
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: error.message + '评分修改失败'
      })
    }
  })

  const deleteNote = (note: Note) => {
    setSelectedNote(note)
    deleteMutation.mutate()
  }

  const saveNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveAddNoteMutation.mutate()
  }
  const saveQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveQuestionMutation.mutate()
  }
  const postMessage = (qa_id: string, message: string) => {
    if (message == '') {
      Toast.fire({
        icon: 'error',
        text: '请输入你的回复↩️'
      })
      return
    }
    postConversationMessageMutation.mutate({ qa_id, message })
  }
  const postReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (studentExistingReview.rating !== '' && studentExistingReview.review !== '') {
      updateReviewMutation.mutate({ course_id: String(course_detail?.course.course_id), rating: studentExistingReview.rating, review: studentExistingReview.review })
    } else {
      if (createReview.rating == '' || createReview.review == '') {
        Toast.fire({
          icon: 'error',
          text: '请评分并且给出你的评价'
        })
        return
      }
      postReviewMutation.mutate({ rating: createReview.rating, review: createReview.review })
    }
  }

  return (
    <>
      <section className="pt-5 pb-5">
        <Container>
          <Header profile={profile} />
          <Row className="mt-0 mt-md-4">
            <Sidebar />
            <Col lg={9} md={8} xs={12}>
              <section className="mt-4">
                <Container>
                  <Row>
                    <Col xs={12}>
                      <Card className="shadow rounded-2 p-0 mt-n5">
                        <Card.Header className="border-bottom px-4 pt-3 pb-0 bg-white">
                          <Tabs
                            id="course-tabs"
                            activeKey={tabKey}
                            onSelect={(k) => setTabKey(k || 'lectures')}
                            className="mb-0"
                          >
                            <Tab eventKey="lectures" title="Course Lectures" />
                            <Tab eventKey="notes" title="Notes" />
                            <Tab eventKey="discussion" title="Discussion" />
                            <Tab eventKey="review" title="Leave a Review" />
                          </Tabs>
                        </Card.Header>
                        <Card.Body className="p-sm-4">
                          <Tab.Content>
                            <Tab.Pane eventKey="lectures" active={tabKey === 'lectures'}>
                              <Lectures percentage={percentage} course_detail={course_detail} handleCompletedStatus={handleCompletedStatus} handleShow={handleShow} completedStatus={completedStatus} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="notes" active={tabKey === 'notes'}>
                              <Notes course_detail={course_detail} handleNoteShow={handleNoteShow} deleteNote={deleteNote} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="discussion" active={tabKey === 'discussion'}>
                              <Discussion course_detail={course_detail} questions={questions} handleQuestionShow={handleQuestionShow} handleConversationShow={handleConversationShow} setQuestions={setQuestions} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="review" active={tabKey === 'review'}>
                              <Review studentExistingReview={studentExistingReview} handleReviewChange={handleReviewChange} postReview={postReview} />
                            </Tab.Pane>
                          </Tab.Content>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </section>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Lecture Modal */}
      <LecturesVideoModal show={show} variant_item={variant_item} playerRef={playerRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} handleClose={handleClose} />

      {/* Note Edit and Add Modal */}
      <NoteAddOrEditModal editOrAdd={editOrAdd} noteShow={noteShow} createNote={createNote} saveNote={saveNote} handleNoteClose={handleNoteClose} handleNoteChange={handleNoteChange} />

      {/* Conversation Modal */}
      <ConversationModal isPending={postConversationMessageMutation.isPending} postMessage={postMessage} selectedConversation={selectedConversation} conversationShow={conversationShow} handleConversationClose={handleConversationClose} />

      {/* Ask Question Modal */}
      <AskQuestionModal askQuestionShow={askQuestionShow} createQuestion={createQuestion}
        handleQuestionChange={handleQuestionChange} handleQuestionClose={handleQuestionClose}
        saveQuestion={saveQuestion}
      />
    </>
  )
}

export default CourseDetail
