import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
// CKEditor是一个强大的富文本编辑器库，用于在React应用中集成CKEditor 5
// 它提供了现代化的所见即所得(WYSIWYG)编辑体验，支持格式化文本、图片插入、表格等功能
// 常用于课程描述、文章内容等需要富文本编辑的场景
import { Container, Row } from 'react-bootstrap';
import { useCallback } from 'react';
import { createAuthenticatedAxios } from '@/api/axios'
import { useMutation } from '@tanstack/react-query'
import Toast from '@/utils/SweetAlert2/Toast'
import { CourseEditAndCreate } from '@/components'
import { useCourseCreateOrUpdate } from '@/hooks'
import { handleMutationError } from '@/utils'
function CourseCreate() {
  const authAxios = createAuthenticatedAxios()
  const { course, category_list, ckEdtitorData, variants, setVariants, handleCourseInputChange, handleCKEditorChange, handleFileChange, handleCourseIntroVideoChange, handleItemChange, handleVariantChange, addItem, addVariants, removeItem, removeVariant, createAndUpdateFn } = useCourseCreateOrUpdate()

  console.log('variants:', variants)
  const createCourseFn = async () => {
    console.log('in createCourse,variants:', variants)
    const formData = createAndUpdateFn()
    const res = await authAxios.post('teacher/course-create/', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    return res.data
  }

  const mutation = useMutation({
    mutationFn: createCourseFn,
    onSuccess: (data) => {
      console.log('创建课程成功,', data)
      Toast.fire({
        icon: 'success',
        text: '课程创建成功！'
      })
    },
    onError: (error: unknown) => {
      console.log('创建课程失败,', error)
      const errorMessage = handleMutationError(error)

      Toast.fire({
        icon: 'error',
        text: errorMessage
      })
    }
  })

  const createCourse = useCallback(() => {
    // 防止重复提交
    if (mutation.isPending) {
      console.log('课程创建中，请勿重复提交')
      return
    }

    // 简单验证
    if (!course.title.trim()) {
      Toast.fire({
        icon: 'warning',
        text: '请输入课程标题'
      })
      return
    }

    if (!course.category) {
      Toast.fire({
        icon: 'warning',
        text: '请选择课程分类'
      })
      return
    }

    mutation.mutate()
  }, [mutation, course.title, course.category])

  return (
    <>
      <section className="pt-5 pb-5">
        <Container>
          {/* Header Here */}
          <Header />
          <Row className="mt-0 mt-md-4">
            {/* Sidebar Here */}
            <Sidebar />
            <CourseEditAndCreate
              course={course}
              handleFileChange={handleFileChange}
              handleCourseIntroVideoChange={handleCourseIntroVideoChange}
              handleCourseInputChange={handleCourseInputChange}
              category_list={category_list}
              ckEdtitorData={ckEdtitorData}
              handleCKEditorChange={handleCKEditorChange}
              variants={variants}
              setVariants={setVariants}
              handleVariantChange={handleVariantChange}
              removeVariant={removeVariant}
              handleItemChange={handleItemChange}
              addVariants={addVariants}
              addItem={addItem}
              createCourse={createCourse}
              removeItem={removeItem}
              isPending={mutation.isPending}
              type='create'
            />


          </Row>
        </Container>
      </section>
    </>
  )
}

export default CourseCreate
