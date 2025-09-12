import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { Container, Row } from 'react-bootstrap';
import { CourseEditAndCreate } from '@/components'
import { useCourseCreateOrUpdate } from '@/hooks'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createAuthenticatedAxios } from "@/api/axios";
import type { Course } from '@/types/base'
import { getCurrentTeacherId } from '@/api/constants';
import { handleMutationError } from '@/utils'
import Toast from '@/utils/SweetAlert2/Toast'
import { useCallback } from 'react';

function CourseEdit() {
  const { course, ckEdtitorData, setCourse, setCKEditorData, variants, setVariants, category_list, handleCourseInputChange, handleCKEditorChange, handleFileChange, handleCourseIntroVideoChange, handleItemChange, handleVariantChange, addItem, addVariants, removeItem, removeVariant, createAndUpdateFn } = useCourseCreateOrUpdate()

  const authAxios = createAuthenticatedAxios();
  const params = useParams()
  const teacherId = getCurrentTeacherId();


  const fetchCourseDetail = async (): Promise<Course> => {
    const res = await authAxios.get(`teacher/course-detail/${params.course_id}/`)
    return res.data
  }
  const { data: currentCourse } = useQuery({
    queryKey: ['teacher-course-detail', params.course_id],
    queryFn: fetchCourseDetail
  })
  console.log('currentCourse:', currentCourse)

  const updateCourseFn = async () => {
    const formData = createAndUpdateFn(true) // 传递true表示这是更新模式
    
    // 调试：打印FormData内容
    console.log('=== UPDATE FormData Debug ===')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }
    console.log('=== End FormData Debug ===')
    
    const res = await authAxios.patch(`teacher/course-update/${teacherId}/${currentCourse?.course_id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    return res.data
  }

  const mutation = useMutation({
    mutationFn: updateCourseFn,
    onSuccess: (data) => {
      console.log('更新课程成功,', data)
      Toast.fire({
        icon: 'success',
        text: '课程更新成功！'
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

  const updateCourse = useCallback(() => {
    console.log('updating')
    if (mutation.isPending) {
      console.log('课程更新中，请勿重复提交')
      return
    }
    mutation.mutate()
  }, [mutation])
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
              currentCourse={currentCourse}
              setCKEditorData={setCKEditorData}
              setCourse={setCourse}
              type='update'
              isPending={mutation.isPending}
              category_list={category_list}
              handleFileChange={handleFileChange}
              ckEdtitorData={ckEdtitorData}
              variants={variants}
              setVariants={setVariants}
              handleCKEditorChange={handleCKEditorChange}
              handleCourseIntroVideoChange={handleCourseIntroVideoChange}
              handleItemChange={handleItemChange}
              handleVariantChange={handleVariantChange}
              addItem={addItem}
              addVariants={() => addVariants(true, currentCourse)}
              removeItem={removeItem}
              removeVariant={removeVariant}
              handleCourseInputChange={handleCourseInputChange}
              updateCourse={updateCourse}
            />
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CourseEdit